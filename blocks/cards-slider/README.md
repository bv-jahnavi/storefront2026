# Cards Slider Block

## Overview

The Cards Slider block is a premium, highly responsive carousel component designed to display a collection of curated cards (typically featuring an image and body content) in a horizontal slider layout. It is ideal for showcasing hero products, feature collections, promotions, or editorial content on the storefront.

It offers a visually rich experience, featuring a dynamic hover-zoom effect on images, overlapping floating card content, custom circular navigation chevron buttons, and smooth transition pagination dots.

---

## Authoring & Configuration

### Authoring Structure
In the AEM document authoring experience, the block is structured as a table. Each row represents a single card item, consisting of two columns:

1. **First Column**: Image/Picture.
2. **Second Column**: Rich text content (titles, description, and an optional link).

Example authoring table in the editor:

| Cards Slider | |
| --- | --- |
| ![Promo Image 1](promo1.jpg) | <span>Category</span><br><h3>Promo Title One</h3><p>Description text.</p><p>[Call to Action](https://example.com/promo1)</p> |
| ![Promo Image 2](promo2.jpg) | <span>Category</span><br><h3>Promo Title Two</h3><p>Description text.</p><p>[Call to Action](https://example.com/promo2)</p> |

### Configuration Definitions (`_cards-slider.json`)
The Universal Editor definition specifies the structure and mapping of the block models:

- **Block Model (`cards-slider`)**: Configured with 1 row and 2 columns for Universal Editor plugins.
- **Item Model (`cards-slider-item`)**:
  - `image`: Reference path to the picture element.
  - `imageAlt`: Plain text mapping for the image alt description.
  - `text`: Rich text container containing headings, paragraphs, and links.

### Block Class Modifiers
This block relies on its default CSS styling. There are no additional class modifiers (e.g., `cards-slider (dark)`) configured or checked in the JavaScript logic.

---

## Integration Details

### URL Parameters
- No external URL parameters affect this block's behavior.

### Local Storage
- No local storage keys are read or modified by this block.

### Events
- **DOM Events**:
  - The block registers click handlers on card items (`li.cards-slider-item`) if they contain an anchor link.
  - It prevents default action and navigation when standard text selection is performed (`window.getSelection()`) or when a child anchor element itself is clicked directly.
- **Custom Events**:
  - This block does not dispatch or listen to custom JavaScript events.

---

## Behavior Patterns

### Visual Layout & Responsiveness
The layout adapts fluidly across different screen viewports:
- **Mobile First** (default):
  - Displays a single card per view (`flex: 0 0 calc(100% - var(--spacing-large))`).
  - Employs CSS Scroll Snapping aligned to the center (`scroll-snap-align: center`).
- **Tablet** (`min-width: 600px`):
  - Displays two cards per view (`flex: 0 0 calc(50% - (var(--spacing-medium) / 2))`).
  - Snaps to the start of each card (`scroll-snap-align: start`).
- **Desktop** (`min-width: 900px`):
  - Displays three cards per view (`flex: 0 0 calc(33.333% - (var(--spacing-medium) * 2 / 3))`).

### Image Optimization
- Images inside the slider are automatically optimized via AEM's `createOptimizedPicture` utility, resizing them to a maximum width of `750px` for optimal performance.
- On hover, the card's image scales up by `5%` with a smooth, premium easing animation (`cubic-bezier(0.16, 1, 0.3, 1)`).

### Premium Chevron Button & Card Clickability
- If a link (`<a>`) is authored in the card body:
  - The block extracts its `href` and `textContent`.
  - It creates a floating circular button (`a.cards-slider-arrow`) with a premium double-chevron SVG icon inside the card body.
  - The original text link in the card body is hidden from view via CSS (`display: none`).
  - The entire card item (`li`) is configured to be a clickable card surface, navigating to the link destination when clicked.

### Navigation Indicators & Dot Navigation
- When the block contains more than one card, a navigation bar (`.cards-slider-indicators`) with dynamic navigation buttons is rendered at the bottom.
- **Scroll Observer**: An `IntersectionObserver` with a visibility threshold of `0.6` (card is 60% visible) tracks the viewport scrolling.
- As the user scrolls through the carousel, the indicator dot corresponding to the active card dynamically expands in width and updates its accessibility state (`aria-current="true"`).

---

## User Interaction Flows

1. **Card Scroll**:
   - The user swipes or drags (on mobile/touch devices) or scrolls horizontally (on trackpads) to navigate between cards.
   - The carousel snaps smoothly to card bounds.
2. **Indicator Dot Navigation**:
   - The user clicks on any navigation dot at the bottom of the block.
   - The block calculates the element offset and triggers smooth scrolling (`scrollTo({ behavior: 'smooth' })`) to position the requested card in the viewport.
3. **Card Click / Tap**:
   - The user clicks anywhere on the card container (or the floating chevron button).
   - If the user is not selecting text, they are redirected to the destination URL of the link.

---

## Error Handling & Fallbacks

- **Missing Images**: If a card row does not contain an image, the content is decorated gracefully without generating a picture element, and only the text content body is displayed.
- **Missing Link / Call-to-Action**: If no anchor tag is authored inside the card body, the block will render as a static informational card. The chevron arrow button is not generated, and the card surface is not clickable.
- **Single Card Fallback**: If only one card is authored, the slider navigation controls (`.cards-slider-nav`) and `IntersectionObserver` instance are not initialized, ensuring no unnecessary script overhead or empty indicator dots.
- **Null Safety**: The block checks for the existence of elements (e.g., `cardBody`, `link`, `item`) before reading attributes or applying event handlers, preventing JavaScript execution errors.
