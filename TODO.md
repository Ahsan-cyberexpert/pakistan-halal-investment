# Roziq Upgrade TODO

## Current progress

- [x] Shared Demo Mode contract, dashboard banner, public-site disclosure, focus ring, touch-target utility, and reduced-motion foundation are implemented and build-verified.
- [x] Deposit, withdrawal, and stock-buy demo actions now use truthful simulated wording, virtual-money warnings, review summaries, mobile numeric input behavior, and demo-only result language without changing their existing simulated outcomes.
- [x] Dashboard home now leads with Available Demo Cash, Invested Value, Total Demo Wealth, Pending Demo, Zakat status, and a Next Demo Action card.
- [x] Balance card status badges now say Virtual Demo Balance and No Real Funds instead of unsupported certification or fee claims.
- [x] Mobile dashboard navigation now uses five primary destinations with accessible active-state semantics, 44px touch targets, Android safe-area spacing, and a labeled transaction dialog.
- [x] Reset Demo now removes only Roziq-prefixed demo/session keys instead of clearing unrelated browser storage; new simulated transactions receive stable references and explicit no-real-funds notes in activity history.
- [x] Every newly recorded simulated transaction now stores a full demo receipt with reference, timestamp, action, amount, method/asset details, status, before balance, after balance, and explicit no-real-funds disclosure; Recent Activity opens the receipt viewer.
- [x] Stock holdings now support a standardized demo sell flow: choose units, review estimated proceeds and P&L, simulate the sale, confirm through the existing trading PIN, update virtual balance/holdings, and create a full demo receipt.
- [x] Transaction dialogs now support Escape-to-close, dialog semantics, labeled inputs, helper text, `aria-describedby`, `aria-invalid`, alert messages, and live processing/result regions for keyboard and TalkBack users.
- [x] Website and dashboard routes plus `public/manus-routes.json` build successfully; the same shared frontend is the source for the Capacitor Android app.

## Demo boundary and status

- [ ] Add a persistent, high-contrast Demo Mode banner stating that balances, prices, payments, orders, Zakat, Wali actions, and AI context are simulated and no real money moves.
- [ ] Replace ambiguous demo labels such as `Live`, `Live Cash Balance`, `Account Linked`, `Deposit Successful`, and `Order Executed` with truthful demo wording while preserving current demo outcomes.
- [ ] Keep demo state in a clearly namespaced storage path and keep `Reset demo only` scoped to demo data.
- [x] Add demo receipts with stable references, timestamp, action, amount, resulting balance, and simulated status.
- [ ] Create an explicit landing-page choice between `Try interactive demo` and `Create real account`; the demo path must not require CNIC or GPS.

## GUI and visual system

- [ ] Add shared typography floors: body 14–16px, metadata at least 12px, buttons at least 14px, primary values 28–40px.
- [ ] Add shared touch-target utility with 44px preferred target and visible focus ring; use it for important touch controls.
- [ ] Add consistent status colors and text/icons for Demo, Pending, Processing, Complete, and Failed; never use color alone.
- [ ] Reduce unnecessary gradients, glass effects, hover lift, and decorative animation so primary financial surfaces have the strongest hierarchy.
- [ ] Add `prefers-reduced-motion` behavior and preserve state through text/borders.
- [ ] Standardize button hierarchy: primary, secondary, demo simulation, and destructive.
- [ ] Standardize modal layout, close/back/cancel placement, step indicator, and result panel.

## Public website

- [ ] Rewrite hero around one clear promise and two paths: demo and future real account.
- [ ] Group features by Invest, Plan, Purify, and Learn instead of showing every feature at equal priority.
- [ ] Add How It Works, Demo Safety, Shariah Methodology, product previews, FAQ, and an accurate footer.
- [ ] Replace unsupported security, certification, live-data, and guaranteed-return claims with scoped prototype/demo language.
- [ ] Add a real mobile menu at small breakpoints and keep the primary Demo CTA visible.

## Mobile app and Android shell

- [ ] Keep the Android app on the same shared responsive UI and Demo Mode data/service contract as the website; do not create a separate native demo state.
- [ ] Apply Android safe-area/inset padding so the header, bottom navigation, sheets, toasts, and floating AI controls never overlap system bars or each other.
- [ ] Implement Android back behavior: close an open dialog/sheet first, return from a nested tool to its parent, and exit only from the top-level screen with the normal Android confirmation behavior where appropriate.
- [ ] Ensure mobile keyboard behavior keeps focused form fields visible and does not cover amount, PIN, search, or confirmation controls; use correct numeric input modes.
- [ ] Preserve demo fixtures for offline/restricted connectivity after the app shell loads; show an offline/demo status instead of implying live data.
- [ ] Configure mobile status-bar/navigation-bar colors, splash/icon metadata, orientation behavior, and app display name consistently with Roziq branding.
- [ ] Verify touch feedback, haptic behavior if later added, screen-reader labels, TalkBack focus order, reduced motion, Urdu RTL, and 320px-equivalent layouts on Android devices.
- [ ] Build and install the Capacitor Android artifact after each major UI batch without enabling real payment, brokerage, identity, or notification integrations.

## Dashboard UX

- [ ] Make the first summary show Available demo cash, Invested value, Total demo wealth, Pending amount, and Zakat due with definitions and timestamps.
- [ ] Add a `Next demo action` card and move advanced modules under `Explore all tools` without deleting them.
- [ ] Use consistent desktop and mobile navigation order; reduce mobile bottom navigation to five primary destinations.
- [ ] Move Reset Demo into Demo controls and keep it away from normal account actions.
- [ ] Prevent AI/voice controls from overlapping navigation, toasts, or primary content.

## Transaction and feature flows

- [ ] Standardize deposit and withdrawal as Amount → Method → Review → Processing → Result.
- [ ] Standardize stock buy/sell with quote status, timestamp, units, fees, risk, resulting balance, and explicit `Simulate purchase/sale` wording. Buy and sell wording/results are implemented; quote risk/fees metadata remains.
- [ ] Add truthful pending/failure/retry states and preserve important results in activity history.
- [ ] Add starter stock shortlist, risk/time filters, and `Why this is shown?` explanation.
- [ ] Add chart text summaries and clearly identify simulated data, time range, and update timestamp.
- [ ] Label Wali, Zakat, purification, Hajj, Sukuk, and AI actions according to demo status and add contextual help.

## Accessibility and bilingual UX

- [x] Associate deposit and withdrawal labels with input IDs and add helper/error text through `aria-describedby` and `aria-invalid`.
- [x] Add accessible names to key icon-only buttons and correct mobile navigation `aria-current`.
- [x] Implement transaction dialog roles, Escape handling, and safe-area backdrop behavior.
- [x] Add live regions for deposit processing/results and alert regions for deposit/withdrawal errors.
- [ ] Test 320px width, 400% zoom, keyboard, screen readers, reduced motion, dark mode, and Urdu RTL.
- [ ] Update document language metadata when the selected language changes and provide text equivalents for charts/status colors.

## Future real-account foundation

- [ ] Define separate demo and real account types and service adapters.
- [ ] Keep real authentication, KYC, wallet ledger, payments, brokerage, market data, Shariah governance, audit, and notifications inactive until implemented and verified.
- [ ] Do not reuse demo credentials, localStorage secrets, simulated provider callbacks, or demo success language in a real-account path.

## Validation

- [ ] Run typecheck and build after each implementation batch.
- [ ] Confirm demo login, seeded balance, buy, sell, deposit, withdrawal, Zakat, Wali, AI, and Reset Demo still work.
- [ ] Verify that every demo transaction visibly says simulated and creates a receipt/history entry.
- [ ] Complete walkthroughs for a first-time investor, an overseas user, an Urdu user, and a presentation judge.
