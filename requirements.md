# AtHand — App Requirements Document
## Overview

AtHand is an Android peer-to-peer rental app that lets people rent tools and equipment from nearby owners. Trust comes from verified IDs, two-way reviews and photo-based condition checks at pickup and return, instead of steep deposits or credit cards.

This document turns the group's four course outputs into buildable requirements. Where the sources disagree, the Key decisions section picks one direction and says why.

| Source document | What it contributed |
| --- | --- |
| Customer Discovery Plan (11 interviews) | Validated segment (9 of 11 interviewees were students), pain points, demanded safety features, initial app concept screen |
| Course Requirement 2: Market Study Whitepaper | Original target (low-to-middle-income households), trust-first positioning, four reference patents |
| Assignment 5/6: Marketing Mix (7Ps/7Cs) | Android delivery, lender-set pricing plus platform service fee, in-app chat, reviews, customer support |
| Course Requirement 3: Patent Search Report | 14 related patents and concrete feature ideas: payment hold, pre/post condition checks, PhilSys/student ID verification, risk-based deposits, double-booking prevention |

**How to read the requirements.** Each requirement has an ID (FR-xx functional, NFR-xx non-functional) and a priority:

- **Must**: needed for the first pilot (MVP)
- **Should**: next release, once the pilot shows people use it
- **Could**: later, or only if time allows

## Key decisions

The biggest call is to launch to students and households together, citywide, from the first pilot. Students are the only segment the interviews validated, but the whitepaper and patent report target households, and a citywide pilot tests both at once. Including households is an explicit, unvalidated assumption (see Known risks). The other twelve decisions settle conflicts or gaps between the four sources.

| # | Decision | Choice | Why | Source |
| --- | --- | --- | --- | --- |
| D1 | Launch audience | One citywide pilot for both students and low-to-middle-income households, with the pilot university as one area within the city | Students are validated (9 of 11 interviewees); households are the whitepaper and patent report target. Households are included as a stated assumption because no household interviews exist yet | Discovery Plan vs Whitepaper |
| D2 | Item scope | "Tools and equipment", including power tools: lab gear, calculators, cameras and ring lights, audio, costumes, kitchenware, electronics, hand and power tools. Powered and electrical items must pass the safety checklist (FR-06) | Interviewees named these as items they need or would list; households bring power tools | Discovery Plan (insights, aha moments, concept categories) |
| D3 | Platform | Android only. No iOS version is planned, so there is no cross-platform requirement | Marketing mix commits to Android; the iOS gap it names as a weakness is accepted | Marketing Mix (Place) |
| D4 | Deposits | Risk-based deposit as a percentage of the item's declared value: 20% for new verified borrowers, 10% for trusted borrowers. The deposit is never zero | Keeps deposits far below the steep deposits AtHand exists to remove, while lenders, who absorb damage beyond the deposit (D12), keep some protection | Patent report (US20230169604A1 notes), Whitepaper |
| D5 | Payment flow | Borrower pays in full at booking. The funds stay inside the licensed payment gateway's accounts, never in an AtHand bank account. AtHand tracks each payment as held, released or disputed, and releases it to the lender's gateway sub-account or e-wallet after the return check passes. A dispute freezes release, and support settles it with a full or partial refund to the borrower | Card authorizations expire after about 7 days, so a true card hold can't cover a rental. A platform that holds customer money itself and later pays third parties likely needs BSP registration under the National Payment Systems Act (RA 11127), so the licensed gateway holds the funds | Patent report (KR100821637B1, EP3866082A1); payment research |
| D6 | Payment methods and currency | Philippine pesos; e-wallets (GCash, Maya) and cards via a licensed payment gateway; no credit card required. No gateway is named. It must support marketplace sub-accounts for individual lenders, delayed transfers to those sub-accounts, payouts to GCash and bank accounts, and full or partial refunds | Target users lack credit cards; concept mockup's $ and "tokens" don't fit a PH launch | Whitepaper, Patent report summary |
| D7 | Revenue | Lender sets the rental price; the borrower pays a 5% service fee on top, shown to both sides before booking. Lenders receive their full price | As stated in the marketing mix; a low fee keeps rentals affordable for students | Marketing Mix (Price) |
| D8 | Identity verification | Required before a first rental, for both roles: student ID or any government ID (PhilSys, driver's license, passport, UMID and similar), plus a live selfie. Admins check them by hand in the pilot. A lender also completes the gateway's payout verification at their first listing | Interviewees asked for real-name ID verification; household members don't have student IDs; pilot volume is low enough for manual checks | Discovery Plan insight 3, Patent report |
| D9 | Handoff model | Direct meetups at any public place the two people agree on; the app suggests nearby public spots. No pickup stations or delivery | Keeps costs near zero across a whole city and differs from CN107194786A's station model | Patent report, concept screen |
| D10 | Items nobody has listed | Public "request board" where users post what they need; do not build ranked, automated outreach to likely lenders | That outreach method is the notable claim of US12450649B2, granted in 2025 | Patent report |
| D11 | Minimum age | Minors may use the app with a linked guardian account. The guardian consents, receives the minor's payouts, and approves each booking of a powered or electrical item | Many students are under 18; GCash requires users to be 18 or older to receive money | Discovery Plan; payment research |
| D12 | Damage and injury | Item value capped at ₱50,000 declared value. The lender absorbs damage beyond the deposit until partner insurance arrives in Phase 3. The borrower uses items at their own risk for injuries | Keeps the pilot's exposure bounded without a protection fund; insurance needs volume first | Patent report (US20230169604A1 mentions P2P insurance) |

## Users and roles

One account can both borrow and lend, switched by a mode toggle (the concept's "I Want to Borrow" / "My Rent Out List"). Support staff and admins use a separate web console.

| Role | Goal | Pain points from the sources |
| --- | --- | --- |
| Borrower | Get an item cheaply for a short, often one-off need (course requirement, event, repair) | Buying is expensive for one-time use; social media sourcing is slow and scam-prone; fear of hidden defects and listings that don't match |
| Lender | Earn extra income from idle items | Items sit unused in storage; worry about damage and borrowers who deny causing it |
| Guardian | Let a minor use the app safely | Needs to consent, receive the minor's payouts, and approve bookings of risky items |
| Support agent | Resolve problems and disputes fairly and quickly | Needs evidence (photos, checklists, chat log) in one place |
| Admin | Keep the marketplace safe | Reviews ID verifications, moderates listings, sets fees and promotions |

## Functional requirements

The app has 41 requirements across ten modules; 29 are Must for the pilot. The core of the product is the rental lifecycle (booking, held payment, pickup check, return check, payout), drawn after the tables.

### A. Accounts and verification

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-01 | Sign up with mobile number (OTP) or email | Must | — |
| FR-02 | Verify identity with a student ID or any government ID plus a live selfie, reviewed by an admin; show a "Verified" badge. Before their first listing, a lender also completes the gateway's payout verification in the same flow | Must | Discovery insight 3; Patent report; D8 |
| FR-03 | Public profile: photo, name, verified badge, average rating, completed rentals, response time, member since | Must | 7Ps Physical evidence |
| FR-04 | One account with a Borrow / Lend mode switch | Must | Concept screen |
| FR-41 | Guardian-linked accounts for users under 18: the guardian creates their own verified account, links it to the minor and consents; the minor's payouts go to the guardian; the guardian approves each booking of a powered or electrical item | Must | Decision D11 |

### B. Listings

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-05 | Create a listing: at least 3 photos, title, category, description, known defects, declared item value (₱50,000 maximum), daily price, min/max rental days, general area | Must | 7Ps Product, Price; D12 |
| FR-06 | Mandatory safety checklist for powered or electrical items, including power tools: powers on, cord and plug intact, no exposed wiring, grounding OK, last calibration date if relevant | Must | Discovery aha moment (hidden defects, calibration, grounding) |
| FR-07 | Availability calendar the lender can block out | Must | US20170083854A1 |
| FR-08 | Suggested price based on similar nearby listings, shown while pricing | Should | 7Cs Connection (price comparisons) |
| FR-09 | Optional automatic price drop as an item ages or is rented more | Could | US20150170261A1 (check status first) |

### C. Discovery

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-10 | "Available near you" list and map within an adjustable radius | Must | Concept screen; 7Ps Place |
| FR-11 | Search with filters: category, price, distance, available dates, verified lenders only, minimum rating | Must | Discovery insight 2 (tedious filtering) |
| FR-12 | Categories matching interview demand (see D2) | Must | Discovery Plan |
| FR-13 | Request board: post "looking for X on these dates"; nearby users can respond with a listing | Should | Decision D10 |
| FR-14 | Show only the lender's general area before booking; the two parties agree on the exact public meetup spot after the booking is confirmed, with nearby public spots suggested by the app | Must | Privacy (NFR-01); D9 |

### D. Booking and payment

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-15 | Borrower requests dates; lender accepts or declines within 24 hours, otherwise the request expires | Must | 7Ps Process |
| FR-16 | Accepted dates lock the item; overlapping requests are rejected automatically (no double booking) | Must | US20130197959A1; US20150170261A1 |
| FR-17 | Full price breakdown before confirming: rental fee, 5% service fee, deposit, total | Must | 7Ps Price |
| FR-18 | Pay in full at booking via e-wallet or card through a licensed gateway; the funds stay in the gateway and are released to the lender only after the return check passes | Must | Decisions D5, D6 |
| FR-19 | Risk-based deposit as a percentage of declared item value, set by the borrower's trust tier (FR-32): 20% for New, 10% for Trusted | Must | Decision D4 |
| FR-20 | Cancellation and late-return rules with automatic fees, shown at booking: free cancellation 24 hours or more before pickup, 50% of the rental fee after that; a late return costs the daily rate for each late day plus a small fixed penalty | Should | — |
| FR-21 | Lender can require a minimum rental period or minimum borrower trust tier | Should | US20150170261A1 |

### E. Handoff and condition checks

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-22 | Pickup check: photos taken in the in-app camera (no gallery uploads) plus the item's checklist; borrower confirms the item matches the listing before the rental starts | Must | EP3866082A1; US20110040692A1 |
| FR-23 | Return check: same photos and checklist; lender confirms or flags damage within 48 hours, otherwise it auto-confirms | Must | EP3866082A1 |
| FR-24 | Handoff confirmation by scanning the other party's QR code at the meetup | Should | Suggestion |
| FR-25 | Pickup and return photos shown side by side for both parties and for support | Should | US20110040692A1 (check status first) |
| FR-26 | Chained handoff: when an item goes straight to the next borrower, one check counts as the previous return and the next pickup | Could | Patent report suggestion |

### F. Communication and notifications

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-27 | In-app chat for inquiries and per booking, with photo sharing | Must | 7Cs Communication |
| FR-28 | Scam guard: warn when a chat message contains a phone number, payment link or request to pay outside the app | Should | Discovery aha moment (scams) |
| FR-29 | Push notifications: new request, accepted, paid, pickup reminder, return due, review prompt, guardian approval needed | Must | — |

### G. Reviews and trust

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-30 | Two-way reviews after each completed rental, only from real bookings | Must | 7Ps Physical evidence |
| FR-31 | "Matched description" rating on each listing | Should | Discovery aha moment (mismatched items) |
| FR-32 | Trust tier from verification, ratings, completed rentals and dispute history; sets the deposit tier. Pilot tiers: **New** (verified) and **Trusted** (5 or more completed rentals, average rating 4.0 or higher, no lost disputes) | Must | Patent report (risk-based deposits); D4 |
| FR-33 | Transaction history summary on profiles | Must | 7Cs Credibility |

### H. Support and disputes

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-34 | Help centre and "Report a problem" on every booking | Must | 7Ps People |
| FR-35 | Dispute flow: either party opens a dispute within 72 hours of the return; payout freezes; check photos and chat attach automatically; support decides on a full or partial refund or a deposit deduction | Must | KR100821637B1; Patent report |
| FR-36 | Plain-language damage and safety policy shown before payment: the lender absorbs damage beyond the deposit, and the borrower uses items at their own risk | Must | Discovery insight 3; D12 |
| FR-37 | Report and block users or listings | Must | — |

### I. Promotions and earnings

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-38 | Targeted promotions (e.g. exam-week calculator deals, first-rental discount) | Could | 7Ps Promotion; concept "Midterms Deal" |
| FR-39 | Lender earnings dashboard: earnings, upcoming rentals, payouts | Should | Concept "Earn" tab |

### J. Admin console

| ID | Requirement | Priority | Source |
| --- | --- | --- | --- |
| FR-40 | Web console: ID verification queue, guardian link review, listing moderation, dispute handling, fee and promotion settings | Must | 7Ps People |

### Rental lifecycle

&#91;embedded content: rental lifecycle · 8 steps, 2 decisions\]

A lender who doesn't respond within 48 hours of the return counts as a yes (FR-23); flagged damage freezes the payout until support decides (FR-35).

## Non-functional requirements

Privacy and evidence integrity matter most, because the app stores government IDs, data about minors, and photos its dispute process depends on.

| ID | Area | Requirement | Priority |
| --- | --- | --- | --- |
| NFR-01 | Privacy | Comply with the Philippine Data Privacy Act of 2012 (RA 10173): consent at sign-up (guardian consent for users under 18), a privacy notice, and a way to download or delete account data | Must |
| NFR-02 | ID data | Encrypt ID and selfie images; keep only the verification result and delete the images after a set retention period | Must |
| NFR-03 | Location | Store and show approximate location only; exact meetup point shared per booking | Must |
| NFR-04 | Payments | No card or e-wallet credentials stored by AtHand; all payment data and held funds handled by the gateway | Must |
| NFR-05 | Evidence integrity | Check photos captured in-app only, stamped with server time and booking ID when they reach the server, and kept unedited until the dispute window closes | Must |
| NFR-06 | Weak signal | If the meetup spot has poor signal, check photos queue and upload later, and the rental starts anyway. A queued photo's timestamp is the time it reaches the server (see Known risks) | Must |
| NFR-07 | Device range | Runs smoothly on low- to mid-range Android phones; images compressed before upload to save mobile data | Must |
| NFR-08 | Speed | Nearby search results appear within about 2 seconds on a typical mobile connection | Should |
| NFR-09 | Language and currency | English and Filipino UI; prices in Philippine pesos (₱) | Should |
| NFR-10 | Accessibility | Readable text sizes, sufficient colour contrast, screen-reader labels on main actions | Should |
| NFR-11 | Account security | OTP re-check before changing payout details or phone number | Must |

## Release plan

Ship the 29 Must requirements as a citywide pilot for students and households, then add Should features once people rent repeatedly. Partner insurance follows once there is enough volume. The app stays Android only throughout.

| Phase | Scope | Gate to the next phase |
| --- | --- | --- |
| 1. Pilot | The 29 Must requirements, one city, students and households, ₱50,000 item-value cap | People rent repeatedly, and household listings and bookings show the household assumption holds |
| 2. Next release | Should requirements (request board, scam guard, cancellation and late fees, side-by-side photos, earnings dashboard and others) | Dispute and damage data is good enough for an insurer to price cover |
| 3. Protection | Partner insurance replaces "lender absorbs" for damage beyond the deposit; the ₱50,000 cap stays | — |

The gates are suggested checkpoints, not dates; the team should set numeric targets once the pilot city is chosen.

## Known risks

These follow from the decisions above. The document accepts them for now; each needs watching in the pilot.

- **Households are unvalidated.** No household interviews exist. If households don't list or borrow, the pilot mostly tests the student segment.
- **Lenders carry most of the damage risk.** On a ₱50,000 item, a Trusted borrower's deposit is ₱5,000, so the lender could absorb up to ₱45,000 of damage until insurance arrives in Phase 3. Meanwhile the platform earns only 5%. This may put off lenders of expensive items.
- **Offline photo timestamps.** A photo taken without signal is stamped when it uploads, so support can't tell exactly when it was taken, or rule out that it was taken after the item was used.
- **Minors' data and safety.** Collecting data about minors needs extra care under RA 10173. Minors can borrow power tools with guardian approval, and the borrower bears the injury risk.
- **Payment setup and BSP rules.** The held-funds design depends on the gateway holding the money and on BSP registration rules. A real launch needs written confirmation from the gateway and a fintech lawyer's review.

## Patent and IP considerations

Most of AtHand's features are common marketplace patterns, but three designs need care: automated ranked outreach to likely lenders, automated image damage detection, and the exact before/after photo deduction workflow. This is a course-level read of the group's patent report, not legal advice; a real launch needs a freedom-to-operate check by a patent attorney.

| Patent | Overlapping feature | Recommendation |
| --- | --- | --- |
| US12450649B2 (granted 2025) | Ranked, automated messaging to users likely to lend an unlisted item | Avoid; use the simple request board (FR-13) |
| US20030120509A1 | Automated image-based damage detection at return | Keep MVP checks human: people compare photos (FR-22, FR-23, FR-25) |
| US20110040692A1 | Before/after photo or video comparison to compute deposit deductions | Check legal status before building FR-25 and the deduction step of FR-35 |
| US20150170261A1 | Double-booking rejection, age/usage-based price drops | Check status before FR-09; double-booking prevention (FR-16) is a generic pattern |
| US20250166055A1 (2025 application) | Equipment borrowing with availability, double bookings and before/after condition | Monitor; it may still be pending |
| KR100821637B1 | Payment held until delivery is confirmed, deposit minus damage | Report says expired and free to use; confirm on Google Patents before relying on it |
| US10671961B2 | Eligibility vetting, geofenced alerts | Low risk: AtHand uses ID and ratings, not credit checks or GPS tracking hardware |
| EP3866082A1 | Blockchain-recorded device condition and held deposit | Low risk: AtHand uses timestamped photos and checklists, no blockchain |
| US20230169604A1 | P2P rental insurance | Review before adding partner insurance in Phase 3 |

## Open questions and source fixes

Three questions are still open, and five details in the source documents should be corrected.

**Questions for the team**

- [ ] Which city for the pilot, and which university within it?
- [ ] The amount of the fixed late-return penalty (FR-20)
- [ ] Household interviews to test the household assumption (D1), ideally before or early in the pilot

**Fixes in the source documents**

- Patent Search Report: "Date of Search: 6 February 2020" and "Search conducted by: Peter Immanuel Tenido" look like template leftovers; the report is dated 20/11/2026 and authored by Group 5.
- Marketing Mix: the file is named Assignment 5 but the heading says Assignment 6.
- Market Study Whitepaper: the $21.74 billion P2P rental market figure for 2026 has no source in the references list.
- Concept screen: shows $ prices and a token wallet, and is drawn on an iPhone while the app is Android-only (see D3, D6).
- Concept screen: shows a "0% Deposit" badge, but deposits are never zero (see D4).
