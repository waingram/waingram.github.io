# Dark Mode Design

## Purpose

Add a restrained, accessible dark mode to the personal academic portfolio without changing the site's information architecture or scholarly tone. Visitors should be able to choose `System`, `Light`, or `Dark`; first-time visitors should follow their system preference automatically.

## Context

The site is a Jekyll portfolio with Bootstrap present but custom visual identity defined primarily in `css/main.css`. The existing stylesheet already uses `--wai-*` CSS custom properties for the core palette, which makes a token-based dark theme the lowest-risk path. The header lives in `_includes/header.html`, shared page chrome lives in `_layouts/default.html`, and `js/main.js` is currently empty.

The product register is `brand`: the site must preserve academic credibility, legibility, and restraint. Dark mode should feel like the same scholarly site in a lower-light environment, not a separate developer-themed surface.

## Requirements

- Add a compact theme control in the navbar.
- Provide three choices: `System`, `Light`, and `Dark`.
- Default first-time visitors to `System`.
- When `System` resolves to an unknown, unsupported, or non-dark preference, use light mode.
- Persist explicit choices across visits in the current browser.
- Returning to `System` should clear the explicit override so no stored value means system-following behavior.
- Avoid flash of the wrong theme before the page becomes interactive.
- Keep menu operation keyboard-accessible and screen-reader legible.
- Preserve WCAG AA contrast for body text, links, muted text, focus states, and menu controls.
- Update browser chrome color through `meta[name="theme-color"]`.

## Interaction Design

The navbar gets one compact theme button near the existing navigation. The button should look like a quiet utility control, not a primary action. It opens a small menu containing `System`, `Light`, and `Dark` choices.

The button exposes `aria-haspopup="menu"` and `aria-expanded`. Menu items are buttons. Selecting an item applies the theme, updates the selected state, persists or clears the preference, and closes the menu. Pressing `Escape` closes the menu. Clicking outside the menu closes it. Keyboard tab order should remain natural, with visible focus states on the trigger and each option.

The trigger icon reflects the selected preference or effective theme. The accessible label should include the current mode so assistive technology users can understand the state without opening the menu.

## Theme Behavior

Use `System` as the default by storing no preference and leaving the root element without a theme override. The effective system theme is dark only when `window.matchMedia('(prefers-color-scheme: dark)').matches` is true. Otherwise, the effective theme is light. This matches current web behavior where no active color-scheme preference is treated as light.

When a visitor selects `Light` or `Dark`, store the explicit value in `localStorage` and set `data-theme="light"` or `data-theme="dark"` on `<html>`. When a visitor selects `System`, remove the stored value and remove the `data-theme` attribute.

While in `System`, listen for changes to `prefers-color-scheme` and update the effective theme, icon, selected menu item, and theme-color meta tag. While in explicit `Light` or `Dark`, ignore OS changes until the visitor returns to `System`.

If `localStorage` is unavailable, the control should still apply the selected theme for the current page session and fail without breaking navigation.

## Visual Treatment

The light palette remains the baseline. The dark palette should use:

- A deep blue-black page background.
- Slightly lifted dark surfaces for hero blocks, mobile profile panels, menus, and navigation chips.
- Off-white primary text with enough line-height and contrast for long reading.
- Muted blue-gray secondary text that still meets AA contrast.
- Brighter blue links and warm copper/focus accents that remain distinct on dark surfaces.
- Clear but restrained borders using a low-chroma blue-gray.

The compact menu should inherit the navbar's restrained style. It should avoid glow, glass effects, oversized rounding, and decorative shadows. Selected state can use a subtle surface shift plus checkmark or icon state. Focus rings should remain visible in both themes.

## Implementation Architecture

Implement the feature in four focused places:

- `_layouts/default.html`: add a tiny early inline script before stylesheets or before body paint to apply the saved explicit theme immediately and set the initial color-scheme hint.
- `_includes/header.html`: add the compact theme trigger and menu markup.
- `css/main.css`: add light/dark token definitions, theme menu styling, and dark overrides for hard-coded light colors.
- `js/main.js`: add the theme controller for menu behavior, persistence, effective theme resolution, `meta[name="theme-color"]` updates, and system preference changes.

Keep CSS custom properties as the public interface between behavior and styling. JavaScript should not set individual color values except for the theme-color meta tag.

## Data Flow

1. Early script reads `localStorage.themePreference`.
2. If it is `light` or `dark`, the script sets `document.documentElement.dataset.theme`.
3. If it is absent or invalid, the root stays in `System` mode and CSS resolves the system preference through media queries.
4. Main JavaScript initializes after load, computes selected and effective modes, updates labels/icons/menu state, and attaches event handlers.
5. User selection updates storage, root attributes, control state, and theme-color.

## Error Handling

- Invalid stored values are ignored and removed when possible.
- Storage read/write failures are caught.
- Missing markup exits gracefully.
- Browsers without `matchMedia` use light as the effective system fallback.
- Browsers without modern `MediaQueryList.addEventListener` use the older listener API when available.

## Testing And Verification

Add focused JavaScript behavior tests before implementation. Tests should cover:

- no stored value defaults to `System`;
- system fallback is light when dark is not matched;
- saved `dark` and `light` values apply explicit root attributes;
- selecting `System` clears the override;
- invalid stored values are ignored;
- menu state, labels, and selected options update after choices;
- Escape and outside click close the menu.

Verification should include:

- JavaScript behavior tests;
- `npm run test:eval`;
- `npm run eval:agent`;
- `/opt/homebrew/opt/ruby/bin/bundle exec jekyll build`;
- browser inspection of light, dark, and system states at desktop and mobile widths.

## References

- MDN documents `prefers-color-scheme` as detecting whether the user requested light or dark, with `light` also covering no active preference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
- CSS Media Queries Level 5 notes user agents converged on treating the default/no-preference behavior as light: https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme
