# White finish and public discovery — 9 November 2026

## Changes
- Replaced warm yellow surfaces with white throughout intro, sign-in, navigation, catalog, profile/settings, booking, points and shared admin/partner surfaces. Navy/orange brand accents remain.
- Increased mobile control targets and input text size, including 16px text inputs to avoid automatic iPhone input zoom. Removed the artificial 120ms loading flash when switching already-loaded views.
- Google/Apple sign-in are explicitly disabled with a coming-soon explanation because those providers are not configured. Email and guest paths remain accessible.
- Added a card-payment availability notice based on the live health endpoint. Existing server payment/QR verification stays authoritative; no live payments enabled or credentials changed.
- Added visible brand information and real public links, guest-accessible explicit public routes, crawlable offer-title links, per-view metadata, seven prerendered public HTML pages and a seven-URL sitemap. Private account screens retain authentication requirements and noindex metadata.
- Fixed support fallback to the same support email already present in the public footer.

## Verification
- TypeScript: passed.
- Regression suite: 60/60 passed. Includes two new tests for public-route access versus protected account routes and crawlable brand links/metadata, plus existing authentication, server payment, QR, cancellation/refund-points, content and role isolation tests.
- Production web build: passed. Existing large-bundle warning remains.
- All seven built public HTML documents checked for unique titles, matching canonical URLs, substantive initial headings and five public links.
- Browser home matrix: 280, 320, 360, 390, 430, 540, 768, 1024, 1440px plus 844×390 landscape. White background and no horizontal page overflow observed.
- Browser Explore matrix: 280, 320, 390, 430, 540, 768, 1024, 1440px plus 844×390 landscape. No horizontal page overflow observed.
- Browser controls checked: email form expansion, recovery/back, registration form, guest entry, Waterparks category, empty-search/reset, city selection, sorting, weekend/clear-date filtering, profile/settings, Arabic RTL, notification preference toggle and restoration. Narrow Arabic settings had no offscreen controls at 280px. Support chat open/close, refund FAQ expansion and the support email link were also checked without sending messages. A fresh guest session followed the About link without a sign-in gate, with the expected canonical URL and title.
- Pre-deploy live GET endpoints: health, auth status, public app config, robots and sitemap all returned 200. Health reports accounts/admin configured and card payments NOT configured.

## Limits
Responsive browser-frame checks are not physical iPhone/Samsung/foldable device tests. No real registration, password-reset email, authenticated admin/partner operation, purchase, refund or redemption was performed. Such transactions were covered only by the automated regression suite. The optional AI chat service was not exercised with a paid model request.

Public search did not establish a verified official brand result. Search Console property access is not available in this session, so an indexing request was not submitted. A sitemap and crawlable pages support discovery; Google controls crawling, indexing and ranking. The correct brand spelling remains SpoteraDeals (also Spotera Deals).
