# Roziq Demo-Safe Professional Upgrade Plan

## Product decision

Roziq remains a fully interactive demo for presentations. Demo balances, holdings, market quotes, payments, orders, Zakat actions, Wali actions, and AI context remain simulated. The upgrade must not remove or disable the demo happy paths.

A future real-account path will be structurally separate. It will not share demo credentials, localStorage secrets, simulated provider success, or demo copy. It will require server authentication, user-owned records, KYC, verified payment/broker integrations, auditability, and truthful pending/settled states before activation.

## Implementation approach

1. Establish a first-class demo status contract and shared visual language.
2. Improve GUI foundations: typography floors, touch targets, focus states, reduced motion, status semantics, and modal conventions.
3. Improve the public website: clear Demo versus Real paths, goal-led explanation, accurate claims, product previews, safety disclosure, FAQ, and responsive mobile navigation.
4. Improve the dashboard information hierarchy: Demo status, available cash/invested/total/pending summaries, next action, and progressive disclosure of advanced tools.
5. Standardize transaction flows: amount → method/asset → review → simulated processing → demo receipt/history, without changing the current demo behavior.
6. Improve accessibility and bilingual UX: labels, IDs, live regions, dialog semantics, keyboard focus, RTL language metadata, and reduced motion.
7. Harden demo boundaries: namespace/reset only demo state, remove ambiguous live/verified copy, and keep future production adapters behind explicit account mode.
8. Deliver the same responsive experience to the Capacitor Android app, adding mobile-specific safe-area spacing, Android back behavior, keyboard handling, offline/demo persistence, touch feedback, status-bar theming, and mobile accessibility.
9. Validate with typecheck/build, responsive screenshots where available, Android packaging checks, accessibility checks, and task walkthroughs for a judge, new investor, and Urdu user.

## Design decisions

- **Design movement:** calm mobile fintech with Islamic geometric restraint and a premium dashboard hierarchy.
- **Core principles:** truthfulness of status, readable hierarchy, progressive disclosure, and safe reversible actions.
- **Color philosophy:** emerald is the Roziq brand/action color; amber identifies demo or pending state; red is reserved for failure/destructive actions; color never carries status alone.
- **Layout paradigm:** one primary task at a time, with supporting metrics below and advanced tools grouped under Explore.
- **Signature elements:** persistent Demo Mode status chip, compact wealth summary, and structured transaction receipts.
- **Interaction philosophy:** immediate acknowledgement, explicit review before consequential actions, and durable result/history after every action.
- **Animation:** short feedback transitions only; no decorative motion that hides status; honor reduced-motion preferences.
- **Typography system:** Inter for English UI, Noto Nastaliq Urdu for Urdu content; body text 14–16px, metadata at least 12px, primary values 28–40px.
- **Brand essence:** a clear, trustworthy halal wealth exploration experience for Pakistani and overseas Muslim users; calm, transparent, guided.
- **Brand voice:** confident but bounded. Example: “Explore your halal wealth journey with virtual money.” “See exactly what a simulated action changes before you confirm.”

## Project structure

- `src/components/DemoModeBanner.tsx`: shared demo disclosure/status UI.
- `src/lib/app-mode.ts`: demo/real mode contract and display labels; production mode remains inactive until real infrastructure exists.
- `src/components/`: shared accessible interaction primitives and feature flows.
- `src/app/page.tsx`: public website entry, Demo/Real paths, accurate trust and feature content.
- `src/app/dashboard/page.tsx`: authenticated demo shell, navigation, account status, dashboard hierarchy, and demo controls.
- `src/app/globals.css`: design tokens, touch-target utility, focus-visible treatment, reduced motion, and shared status styles.
- `capacitor.config.ts` and `android/`: Capacitor Android shell, app identity, status-bar/theme behavior, and native build configuration; native code must not create a separate demo data model.
- `src/data/` and `data/`: demo-only fixtures and reset state; no future real account data is stored here.

## Required behavior

The current demo remains runnable without external payment, brokerage, or identity credentials on both the website and Android app. Every simulated balance and result must be visibly marked as demo. The public site must offer a clear interactive-demo route without collecting CNIC/GPS data solely to explore. The app must remain usable with poor connectivity after the demo shell and fixtures are loaded, and Reset Demo must not touch any future real-account namespace. Real-account UI may be prepared, but it must not claim to process real money until verified integrations and server-side controls exist.
