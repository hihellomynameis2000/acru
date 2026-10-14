# ACRU product design standard

ACRU should feel as immediate and trustworthy as Stripe, Mercury, Cash App, Apple, or Tesla software. New pages must
reuse the established shell and interaction patterns instead of reinterpreting them page by page.

## Product principles

- Make the common path obvious. A first-time user should understand the page without documentation.
- Prefer calm density over oversized UI. Controls are generally 36px high, navigation rows are 36px, and spacing is
  deliberate rather than loose.
- Every visible control must work. Do not ship decorative search fields, filters, dropdowns, buttons, or rows.
- Every interactive surface gets a hand cursor, keyboard access, a visible focus state, and immediate visual feedback.
- Use restrained 160–180ms ease-in-out transitions. Hover effects may subtly lighten a surface or lift it by 1px but
  must not cause layout movement.
- Preserve user context. Filters update the page in place, selection is visually persistent, and empty/loading/error
  states should be clear.
- Financial information must be easy to scan: consistent alignment, unambiguous status color, sufficient spacing,
  and no overlapping or truncated amounts.

## Visual language

- Poppins is the product typeface. Sidebar navigation uses Medium/500.
- Shopify Polaris is the default interface icon system. Brand and payment-network marks may use their official assets.
- Use the established near-black background, subtly lighter cards, thin glass-like borders, and restrained blue accent.
- Rounded corners should feel engineered, not inflated. Match existing component radii and avoid excessive pills.
- Keep the sidebar, top navigation, control heights, card borders, typography, and hover language consistent with the
  dashboard.
- Follow supplied references pixel-for-pixel where they define sizing, spacing, alignment, color, or hierarchy.

## Interaction baseline

- Buttons, links, clickable cards, and actionable rows use `cursor: pointer`.
- Disabled controls use `cursor: not-allowed` and a clear disabled appearance.
- Search supports mouse and keyboard operation; date controls use real range selection and explicit Apply/Cancel
  behavior.
- Tooltips work on hover and keyboard focus, remain concise, and explain calculations or unfamiliar concepts.
- Popovers are anchored, layered above surrounding content, dismissible, and styled consistently.
- Responsive layouts preserve the intended desktop composition for as long as it remains readable, then reflow cleanly
  without overlap.

## Definition of done for new pages

Before considering a page complete, verify its primary actions, hover/focus/disabled states, keyboard flow, responsive
layout, empty/loading/error states, text and amount spacing, route navigation, and formatting/lint/type/tests. Reuse
shared components whenever an established pattern already exists.
