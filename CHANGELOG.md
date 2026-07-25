# Changelog

All notable changes to this project are documented in this file.

## [0.6.8] - 2026-07-25

### Changed

- Renamed the public “Stato richieste” section to “Stato ordini” across navigation, headings, footer, and dynamic status messages.
- Collapsed the custom model form on mobile: only the two source buttons are visible initially; the rest expands after selection.
- Removed the 3D printer animation from the mobile hero section.

### Fixed

- Updated the public page test to match the new `stato-ordini` identifier.

## [0.6.7] - 2026-07-25

### Changed

- Hidden hero action buttons on mobile because the same links are available in the hamburger menu.

### Fixed

- Adjusted the 3D printer head animation so the extruder no longer intersects the growing printed object.
- Restored a missing `@keyframes viewer-layer` definition used by the 3D viewer loader.

## [0.6.6] - 2026-07-25

### Added

- Mobile product card details toggle: only image, name, and price are visible by default; tapping "Dettagli" expands description, specs, color, quantity, and add-to-cart.

### Changed

- Hidden secondary/explanatory texts on mobile: hero intro, catalog description, request tracker intro, custom model description, field hints, cart/checkout notes, account intro, registration hint, and password-change hint.

## [0.6.5] - 2026-07-25

### Added

- Mobile hamburger menu for the main navigation.
- Horizontal swipeable product catalog with scroll-snap and dot indicator on narrow screens.

### Changed

- Improved mobile readability: larger small text, looser headings, bigger touch targets, higher contrast for secondary text.
- Product specs and order headers now stack vertically on mobile.
- Dialog panels have extra bottom padding to avoid the on-screen keyboard.
- Relaxed `body` minimum width to prevent forced horizontal scroll on very small viewports.

## [0.6.4] - 2026-07-24

### Changed

- Translated README, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, and SECURITY to English.
- Translated comments and placeholder values in `compose.yml`, `compose.cloudflare.yml`, and `.env.cloudflare.example` to English.

### Fixed

- Added Docker build context to `compose.yml` and a stub `.env` file in CI workflows to fix `Test / docker` and release failures.

## [0.6.3] - 2026-07-24

### Changed

- Rewrote `README.md` with a cleaner structure, screenshots, and table of contents.
- Updated `compose.yml` and `compose.cloudflare.yml` to load environment variables from `.env` via `env_file`.

### Added

- `screenshots/` folder with images of the home page and the Control Room.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.

### Removed

- Local `docs/` folder and related references from `README.md`.

## [0.6.2] - 2026-07-24

### Added

- HTTP security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Strict-Transport-Security` (when the connection is HTTPS).
- Basic Content Security Policy (CSP) to limit external resource loading and mitigate XSS risks.

## [0.6.1] - 2026-07-24

### Added

- Cache-busting for public assets (`styles.css`, `admin.css`, `app.js`, `admin.js`) via versioned query strings.
- Animated stripe effect on the printer progress bar in the home page.

### Changed

- Home progress bar text now shows `Level <completed> / <total>` instead of `<completed> / <pending>`.

## [0.6.0] - 2026-07-24

### Added

- Rate limit for file uploads and order submissions (5 requests every 5 minutes).
- `delivered` order status and **Archive** section in the Control Room.
- Limit of 15 open orders (`pending`, `in progress`, `completed`) with a public warning.
- **Delete all** button in the Control Room to remove all orders and their files.
- **Delete** button in the user history to remove one's own order.
- `AGENTS.md` file with project conventions (local only).

### Fixed

- Undefined `orderSidebar` variable in `public/admin.js` that blocked navigation buttons after archiving an order.

## [0.5.1] - 2026-07-18

### Fixed

- Same Bitwarden issue in the checkout dialog (name/surname fields): made it non-modal with backdrop and close on Esc or outside click.
- Scrollability of account and checkout dialogs on mobile (`overflow: auto`) to prevent forms from being cut off or unsubmittable.

## [0.5.0] - 2026-07-18

### Fixed

- Conflict between Bitwarden's inline menu and native modal dialogs: account and admin settings popups now open as non-modal dialogs so Bitwarden's menu can overlap login and password fields.

## [0.4.1] - 2026-07-18

### Added

- Password change for authenticated users from the profile popup, with `PUT /api/account/password` API.
- 3D printer animation in the hero: extruder and filament move layer by layer while the object grows from bottom to top.
- "Level X / Y" bar and screen with the in-progress order code, linked to real orders.

## [0.4.0] - 2026-07-18

### Added

- Change of admin username and password from the Control Room settings popup, with verification of the current password.
- `admin:reset` command to restore credentials from environment variables.

### Changed

- Custom credentials stored in the database take precedence over environment ones; every change invalidates active admin sessions.

## [0.3.0] - 2026-07-17

### Added

- Optional accounts with registration, login, and personal order history.
- Unified login for the administrator and direct link to the Control Room.

### Changed

- Replaced Docker bind mounts with named volumes to avoid manual permission setup.
- Persisted customer sessions and optional account-to-order association in SQLite.

## [0.2.0] - 2026-07-17

### Added

- Optional SMTP sending for new orders.
- Admin settings popup opened from the gear icon.

### Changed

- Removed simulated email outbox and tutorial exercises.
- Simplified Docker Compose using bind mounts for `data` and `storage`.

## [0.1.0] - 2026-07-17

### Added

- Persistent catalog with products, colors, and STL/3MF viewer.
- Cart and order submission with custom files or links.
- Public tracking limited to code and status.
- Protected admin panel for orders, catalog, and colors.
- Safe inspection of STL, generic 3MF, and Bambu Studio projects.
- Self-hosted distribution with Docker Compose and persistent volumes.
- Automated tests and Docker build via GitHub Actions.

[0.6.4]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.4.1...v0.5.0
[0.4.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.3.0...v0.4.0
[0.4.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.4.0...v0.4.1
[0.3.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Moffoletta/pixel-print-lab/releases/tag/v0.1.0
