import { createOptimizedPicture } from '../../scripts/aem.js';

function updateActiveIndicator(block, slideIndex) {
  const indicators = block.querySelectorAll('.cards-slider-indicator button');
  indicators.forEach((btn, idx) => {
    if (idx === slideIndex) {
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'true');
    } else {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    }
  });
}

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'cards-slider-inner';

  const ul = document.createElement('ul');
  ul.className = 'cards-slider-list';

  const cards = [...block.children];

  cards.forEach((row, index) => {
    const li = document.createElement('li');
    li.className = 'cards-slider-item';
    li.dataset.index = index;

    // Move content
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Identify image vs text content
    let cardBody = null;

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-slider-image';
      } else {
        div.className = 'cards-slider-body';
        cardBody = div;
      }
    });

    // Extract link if exists to make a chevron button
    if (cardBody) {
      const link = cardBody.querySelector('a');
      if (link) {
        // Create premium circular chevron button
        const arrowBtn = document.createElement('a');
        arrowBtn.className = 'cards-slider-arrow';
        arrowBtn.href = link.href;
        arrowBtn.setAttribute('aria-label', link.textContent || 'Read more');

        // Double chevron right SVG icon
        arrowBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        `;

        cardBody.appendChild(arrowBtn);

        // Make the entire card clickable, except when clicking other links
        li.style.cursor = 'pointer';
        li.addEventListener('click', (e) => {
          if (!e.target.closest('a') && !window.getSelection().toString()) {
            window.location.href = link.href;
          }
        });
      }
    }

    ul.append(li);
  });

  // Optimize pictures
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
  });

  container.append(ul);
  block.replaceChildren(container);

  // Add indicators/dots if there's more than one card
  if (cards.length > 1) {
    const nav = document.createElement('nav');
    nav.className = 'cards-slider-nav';
    nav.setAttribute('aria-label', 'Cards slider controls');

    const ol = document.createElement('ol');
    ol.className = 'cards-slider-indicators';

    cards.forEach((_, idx) => {
      const li = document.createElement('li');
      li.className = 'cards-slider-indicator';

      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === 0) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'true');
      }

      button.addEventListener('click', () => {
        const item = ul.querySelector(`.cards-slider-item[data-index="${idx}"]`);
        if (item) {
          ul.scrollTo({
            left: item.offsetLeft - ul.offsetLeft,
            behavior: 'smooth',
          });
        }
      });

      li.append(button);
      ol.append(li);
    });

    nav.append(ol);
    block.append(nav);

    // Setup scroll observer to update active indicator dot
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index, 10);
          updateActiveIndicator(block, idx);
        }
      });
    }, {
      root: ul,
      threshold: 0.6, // Card is mostly visible
    });

    ul.querySelectorAll('.cards-slider-item').forEach((item) => {
      observer.observe(item);
    });
  }
}
