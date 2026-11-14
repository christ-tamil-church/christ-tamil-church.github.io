# Contact page

The Contact page follows the CTC inner-page blueprint with a visitor-first, action-based experience. It offers direct phone, email, directions, and prayer-request paths without implying that the site processes form submissions.

## Structure

- Light hero with one bronze email CTA and a floating direct-contact card.
- Cream closing band pairing lightweight Facebook and YouTube channel cards.

## Responsive behavior

Two-column areas stack at 900px, buttons expand where useful at phone width, and interactive controls retain at least 44px touch targets. Reveal and hover motion is suppressed for `prefers-reduced-motion`.

## Content sources

Worship time, address, phone number, email address, and map link come from `churchInfo` in `src/data/site.ts`. Facebook remains an external link; the page intentionally does not load a social embed.
