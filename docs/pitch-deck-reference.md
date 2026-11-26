# AtHand: Pitch Deck Reference

This is a reference for anyone building a pitch deck for AtHand. It covers what the business is, why it matters, what sets it apart, what the product does, how people use it, and what the current prototype can show.

Everything here comes from the project's [requirements document](../requirements.md), the [README](../README.md), and the prototype in [`mobile/`](../mobile/). Each section notes where a claim comes from, so deck authors can check the numbers before putting them on a slide.

> **Before you put a number on a slide:** Section 10 lists which claims are solid, which are assumptions, and which have no source yet. Read it first.

---

## 1. The one-line pitch

**AtHand is an Android app that lets people rent tools and equipment from verified owners nearby, with no credit card and no steep deposit.**

People trust each other on AtHand because of verified IDs, two-way reviews, and timestamped photo checks at pickup and return. Other rental options rely on large deposits or credit cards instead.

Alternative taglines for the title slide:

- *"Borrow what you need. Earn from what you don't use."*
- *"Rent from your neighbours. Safely."*
- *"The things you need, at hand."*

---

## 2. The problem

Customer discovery covered 11 interviews, and 9 of the interviewees were students. They described the same set of problems.

| Who | Pain point | Evidence |
| --- | --- | --- |
| **Borrowers** | Buying is expensive for something they need once: a calculator for an exam, a ring light for a project, a costume for an event, a drill for a repair. | Discovery Plan |
| **Borrowers** | Finding items through social media is slow, the filtering is tedious, and scams are common. | Discovery Plan, insight 2 and "aha moments" |
| **Borrowers** | They fear hidden defects and listings that don't match the real item. | Discovery Plan |
| **Borrowers** | Traditional rentals ask for steep deposits or credit cards, which students and low-to-middle-income households often don't have. | Market Study Whitepaper |
| **Lenders** | Useful items sit idle in storage and earn nothing. | Marketing Mix, Whitepaper |
| **Lenders** | They worry about damage, and about borrowers who deny causing it. | Discovery Plan |

**Suggested framing for the slide:** *A ring light costs ₱2,800 to buy and is used for one school project. Today you either buy it, beg a friend, or risk a stranger on a Facebook group.*

---

## 3. The solution

AtHand is a peer-to-peer rental marketplace built around trust. Each part of the product answers one of the pain points above.

| Pain point | How AtHand solves it |
| --- | --- |
| Buying is expensive for one-off use | Rent by the day from someone nearby, at a price the owner sets |
| Steep deposits and credit cards | A small deposit based on the borrower's trust tier: **20%** of the item's value for new users and **10%** for trusted ones. Pay with **GCash, Maya or a card**, and no credit card is needed |
| Scams on social media | Every user is ID-verified. Payment happens only inside the app, and a **scam guard** warns when someone in chat tries to move the deal outside it |
| Hidden defects, mismatched listings | Listings must have at least 3 photos and list any known defects. Powered items must pass a **safety checklist**, and listings get a **"Matched description"** rating |
| "You broke it." "No, I didn't." | **Photo condition checks** at pickup and return, taken with the in-app camera and stamped with server time. Support uses them as evidence in disputes |
| Lender doesn't get paid | The borrower pays in full at booking. The money is **held by a licensed payment gateway** and released to the lender after a clean return |

---

## 4. Key strengths

These are the strongest points for a deck, in rough order of impact.

### 4.1 Trust without a credit card
The whole product is designed around one idea: **trust comes from verification and evidence, not money held hostage.** Deposits are a fraction of what traditional rentals ask for, and they shrink as a user builds a track record. That makes AtHand usable by the people other rental services leave out: students and low-to-middle-income households.

### 4.2 A trust ladder that rewards good behaviour
- **New** (verified): deposit is 20% of the item's declared value.
- **Trusted** (5 or more completed rentals, a 4.0 or higher average rating, no lost disputes): deposit drops to **10%**.

The app tells users how to reach Trusted, so it gives them a reason to keep coming back and to behave well.

### 4.3 Lenders keep 100% of their price
The borrower pays a **5% service fee** on top of the lender's price. Lenders see that they get their full price, and both sides see the fee before they book.

### 4.4 Money is protected for both sides
Payment flows through a **licensed payment gateway**. AtHand never holds customer money in its own bank account. It tracks each payment as **held**, **released** or **frozen**, and releases funds only after the return check passes. Borrowers know the lender can't take the money and vanish. Lenders know the money exists before they hand over the item.

This design is also a regulatory strength. A platform that holds customer money itself would likely need registration with the Bangko Sentral ng Pilipinas (BSP) under the National Payment Systems Act (RA 11127). Using the gateway avoids that.

### 4.5 Evidence built into every rental
Pickup and return checks use the **in-app camera only** (no gallery uploads), follow a checklist, and are **stamped with server time and the booking ID**. If there's a dispute, support sees both sets of photos, the checklists and the chat log in one place.

### 4.6 Safety for powered items and for minors
- Powered and electrical items must pass a safety checklist before they can be listed: powers on, cord and plug intact, no exposed wiring, grounding OK, and last calibration date where relevant.
- Users under 18 join through a **linked guardian account**. The guardian consents, receives the minor's payouts, and approves each booking of a powered item.

### 4.7 Built for the Philippine market
- Prices in pesos (₱), with GCash and Maya as first-class payment methods
- Supports student IDs and PhilSys, driver's licence, passport and UMID
- Designed to comply with the Data Privacy Act of 2012 (RA 10173)
- Built for low- to mid-range Android phones and patchy mobile data, with photos that queue and upload later when there's no signal

### 4.8 Low operating cost
There are no pickup stations, warehouses or delivery fleet. Borrowers and lenders meet at a **public place they agree on**, and the app suggests nearby public spots. That keeps costs close to zero while the service grows across a whole city.

---

## 5. What makes AtHand different

### 5.1 Compared with what people do today

| | Buying new | Asking friends | Social media groups | Traditional rental shops | **AtHand** |
| --- | --- | --- | --- | --- | --- |
| Cost for one-off use | High | Free, if anyone has it | Varies | Medium to high | **Low daily price + 5% fee** |
| Deposit | None (you own it) | None | Often cash, informal | Steep, or a credit card | **10–20% of item value** |
| Credit card needed | No | No | No | Often | **No: GCash, Maya or card** |
| Identity verified | n/a | Known person | No | Yes | **Yes: ID plus live selfie** |
| Scam protection | n/a | n/a | None | n/a | **In-app payment plus scam guard** |
| Proof of condition | n/a | None | None | Shop's word | **Timestamped photo checks** |
| Dispute resolution | Store returns | Awkward | None | Shop decides | **Support with evidence** |
| Range of items | Anything | Limited | Wide but unsorted | Narrow | **Wide, searchable, nearby** |
| Owners earn money | No | No | Sometimes | No | **Yes** |

### 5.2 Design choices that set AtHand apart
- **A small deposit that shrinks with trust, but never reaches zero.** It's low enough to be affordable, and it still gives lenders some protection.
- **The lender sets the price, and the borrower pays a transparent 5% fee.** There are no hidden charges, and the full breakdown appears before booking.
- **Direct meetups instead of stations.** This avoids the station-based model in a related patent (CN107194786A) and keeps costs low.
- **People compare photos, not algorithms.** Damage checks stay human-reviewed in the pilot, which avoids a patented automated image-detection approach (US20030120509A1) and keeps decisions explainable.
- **Privacy by default.** Borrowers see only the lender's general area until a booking is confirmed, and the exact meetup point is shared per booking. ID images are encrypted and deleted after the check. Only the result is kept.
- **Guardian accounts for minors.** Many students are under 18, and GCash requires users to be 18 or older to receive money. Linked guardian accounts let AtHand serve them safely.

---

## 6. Target market and users

### 6.1 Launch segments
- **Students** are the validated segment: 9 of 11 interviewees were students.
- **Low-to-middle-income households** are the target in the market study and patent report, but they are **not yet validated by interviews** (see Section 10).

The plan is **one citywide pilot** serving both groups, with a partner university as one area within the city.

### 6.2 Item categories at launch
Chosen from what interviewees said they need or would list:

| Category | Examples |
| --- | --- |
| Lab gear | Lab gowns, safety goggles, multimeters |
| Calculators | Exam-approved scientific calculators |
| Cameras & lighting | Mirrorless cameras, ring lights |
| Audio | Portable PA speakers, microphones |
| Costumes | Graduation togas, event costumes |
| Kitchenware | Stand mixers, cookware |
| Electronics | Gadgets and devices |
| Tools | Hand tools and power tools (drills and similar) |

The pilot caps declared item value at **₱50,000**.

### 6.3 User roles

| Role | What they want |
| --- | --- |
| **Borrower** | Get an item cheaply for a short, often one-off need |
| **Lender** | Earn extra income from idle items |
| **Guardian** | Let a minor use the app safely |
| **Support agent** | Resolve disputes fairly, with evidence in one place |
| **Admin** | Keep the marketplace safe: ID checks, listing moderation, fees |

One account can both borrow and lend. A toggle on the home screen switches between **"I Want to Borrow"** and **"My Rent Out List"**.

---

## 7. Business model

### 7.1 Revenue
- **5% service fee** on every rental, paid by the borrower on top of the lender's price.
- Lenders receive their full price.

### 7.2 Worked example (from the prototype's demo data)

A borrower rents a **Canon EOS M50 camera** (declared value ₱32,000, listed at ₱650 a day) for **2 days**:

| Line | New borrower (20% deposit) | Trusted borrower (10% deposit) |
| --- | --- | --- |
| Rental (₱650 × 2) | ₱1,300 | ₱1,300 |
| Service fee (5%) | ₱65 | ₱65 |
| Deposit (refundable) | ₱6,400 | ₱3,200 |
| **Total paid at booking** | **₱7,765** | **₱4,565** |
| Lender receives | ₱1,300 | ₱1,300 |
| AtHand earns | ₱65 | ₱65 |

After a clean return, the deposit goes back to the borrower and the rental fee goes to the lender.

### 7.3 Future revenue (not in the pilot)
- **Targeted promotions**, such as exam-week calculator deals or a first-rental discount (planned as a "Could" feature).
- **Partner insurance** in Phase 3, once there's enough damage and dispute data for an insurer to price cover.

### 7.4 Cost structure advantages
- No physical locations, stations or delivery.
- The payment gateway holds the funds and handles compliance.
- Manual ID review is fine at pilot volume.

---

## 8. Product features

Features are grouped as in the requirements document. The **Status** column says what the prototype shows today:

- ✅ **Working**: built in the prototype and usable in a demo.
- 🟡 **Simulated**: works in the demo, but the real thing (payments, ID checks, camera) is faked.
- 🔵 **Planned**: specified, but not built yet.

### A. Accounts and verification

| Feature | What it does | Status |
| --- | --- | --- |
| Sign-up | Mobile number (OTP) or email | 🔵 Planned |
| ID verification | Student ID or government ID plus a live selfie, reviewed by an admin. Earns a "Verified" badge | 🟡 Simulated |
| Payout setup | Lenders link GCash or a bank account at their first listing | 🟡 Simulated |
| Public profile | Photo, name, verified badge, rating, completed rentals, response time, member since | ✅ Working |
| Borrow / Lend switch | One account, two modes | ✅ Working |
| Guardian accounts | Under-18 users link to a verified guardian, who approves powered-item bookings and receives payouts | ✅ Working |

### B. Listings

| Feature | What it does | Status |
| --- | --- | --- |
| Create a listing | At least 3 photos, title, category, description, known defects, declared value (max ₱50,000), daily price, min/max days, general area | ✅ Working |
| Safety checklist | Required for powered items: powers on, cord intact, no exposed wiring, grounding OK, calibration date | ✅ Working |
| Availability | Accepted dates lock the item | ✅ Working (as overlap checks) |
| Suggested price | Based on similar nearby listings | 🔵 Planned |

### C. Discovery

| Feature | What it does | Status |
| --- | --- | --- |
| "Available near you" | Listings sorted by distance, with an adjustable radius (1, 3, 5 or 10 km) | ✅ Working (list; map planned) |
| Search and filters | Keyword search, category grid, distance, verified lenders only | ✅ Working |
| Category browsing | Eight colour-coded categories | ✅ Working |
| Location privacy | Only the general area is shown before booking | ✅ Working |
| Request board | Post "looking for X on these dates" | 🔵 Planned |

### D. Booking and payment

| Feature | What it does | Status |
| --- | --- | --- |
| Booking requests | The borrower picks dates. The lender accepts or declines within 24 hours | ✅ Working |
| No double booking | Overlapping requests are rejected automatically | ✅ Working |
| Price breakdown | Rental, 5% fee, deposit and total, shown before confirming | ✅ Working |
| Risk-based deposit | 20% (New) or 10% (Trusted) of declared value | ✅ Working |
| Held payment | Pay in full with GCash, Maya or a card. Funds stay with the gateway until the return passes | 🟡 Simulated |
| Cancellation and late fees | Automatic rules, shown at booking | 🔵 Planned |

### E. Handoff and condition checks

| Feature | What it does | Status |
| --- | --- | --- |
| Pickup check | In-app photos (front, back, defects) plus a checklist. The borrower confirms the item matches the listing | 🟡 Simulated camera |
| Return check | Same photos and checklist. The lender confirms or flags damage within 48 hours, or it auto-confirms | 🟡 Simulated camera |
| Server timestamps | Each photo is stamped with server time and the booking ID | ✅ Shown |
| QR handoff, side-by-side photos | Scan to confirm a handoff, and compare photos side by side | 🔵 Planned |

### F. Communication

| Feature | What it does | Status |
| --- | --- | --- |
| In-app chat | Per booking and for inquiries | ✅ Working |
| Scam guard | Warns when a message contains a phone number, a link, or a request to pay outside the app | ✅ Working |
| Notifications | New request, accepted, paid, pickup reminder, return due, review prompt, guardian approval | ✅ Working (as an in-app inbox) |

### G. Reviews and trust

| Feature | What it does | Status |
| --- | --- | --- |
| Two-way reviews | Only after real, completed rentals | ✅ Working |
| "Matched description" rating | Shows how accurate each listing is | ✅ Shown |
| Trust tiers | New and Trusted, which set the deposit rate | ✅ Working |
| Transaction history | Summary on profiles | 🟡 Partial |

### H. Support and disputes

| Feature | What it does | Status |
| --- | --- | --- |
| Report a problem | Available on every booking | 🟡 Placeholder |
| Dispute flow | Either side opens a dispute within 72 hours of the return. The payout freezes, evidence attaches automatically, and support decides on a full or partial refund | ✅ Working (demo resolution) |
| Damage and safety policy | Plain-language policy shown before payment | ✅ Working |
| Report and block | Report or block users and listings | 🔵 Placeholder |

### I. Admin console

| Feature | What it does | Status |
| --- | --- | --- |
| Web console | ID verification queue, guardian review, moderation, disputes, fee settings | 🔵 Planned (demo buttons stand in) |

---

## 9. How it works

### 9.1 The rental lifecycle

Every rental follows the same six steps. The app shows this as a timeline on each rental.

```
 1. Requested ──► 2. Lender accepts ──► 3. Borrower pays ──► 4. Pickup check
                     (within 24 h)        (held by gateway)     (photos + checklist)
                                                                      │
                                                                      ▼
 6. Payout released ◄── Lender confirms ◄────────────────── 5. Return check
    to lender           (or auto after 48 h)                  (photos + checklist)
                              │
                              └── Flags damage ──► Payment frozen ──► Support decides
                                                                      (full/partial refund)
```

Minors add one step at the start: a booking of a powered item goes to their **guardian for approval** before the lender sees it.

### 9.2 How a borrower uses AtHand
1. **Verify once.** Photograph a student or government ID and take a live selfie. An admin approves it, usually within a day.
2. **Find an item.** On **Home**, browse categories or search ("calculators, ring lights, drills…"). Filter by distance or verified lenders only.
3. **Check the listing.** See the photos, known defects, safety checklist, the lender's rating and response time, and the "Matched description" score.
4. **Request dates.** Choose a start date and number of days, then review the full price breakdown and send the request.
5. **Pay.** Once the lender accepts, pay with GCash, Maya or a card. The money is held by the gateway.
6. **Pick up.** Meet at a public spot. Do the **pickup check**: three photos, the checklist, and confirming the item matches the listing.
7. **Return.** Do the **return check** at handoff. The deposit comes back once the lender confirms.
8. **Review.** Rate the lender. Your rating and rental count build toward **Trusted** and its lower 10% deposit.

### 9.3 How a lender uses AtHand
1. **Switch to "My Rent Out List"**, or tap the **Rent Out** button in the middle of the tab bar.
2. **Verify and link payouts** (GCash or bank) at the first listing.
3. **Create a listing.** Add at least 3 photos, a description, known defects, declared value, daily price and min/max days. Powered items must pass the safety checklist.
4. **Accept or decline requests** within 24 hours from **"Needs your action"**.
5. **Hand over** at the agreed public spot. The borrower does the pickup check.
6. **Confirm the return** or **flag damage** within 48 hours. Flagging freezes the payment, and support reviews the photos.
7. **Get paid.** Receive the full listed price, and track earnings in **"Earned so far"**.

### 9.4 How a guardian uses AtHand
1. Create a verified account and link it to the minor.
2. Approve or decline the minor's bookings of powered or electrical items. The requests appear in the Inbox and Rentals.
3. Receive the minor's payouts if they lend.

### 9.5 App layout (for screenshots)

| Tab | What's there |
| --- | --- |
| **Home** | Location ("Renting near…"), the Borrow/Lend switch, search, trust tier card, category grid, highlights carousel, "Available near you" |
| **Rentals** | Active and past rentals with status badges |
| **Rent Out** (centre button) | Create a new listing, or verify first if not yet verified |
| **Inbox** | Chats and notifications |
| **Account** | Profile, trust tier, guardian info, damage policy, help |

---

## 10. Claims to handle carefully

Use this to keep the deck honest. Investors and judges will ask about these.

### Solid (backed by sources or the product itself)
- 11 customer discovery interviews, 9 of them with students.
- The fee, deposit, trust-tier and value-cap rules (these are built into the prototype).
- The payment-hold design and why it avoids BSP registration (based on payment research; still needs legal confirmation).
- 41 functional requirements, 29 of which are needed for the pilot.

### Assumptions (say so on the slide)
- **Households will use AtHand.** No household interviews exist yet. If households don't list or borrow, the pilot mostly tests students.
- **Lenders will accept the damage risk.** On a ₱50,000 item, a Trusted borrower's deposit is ₱5,000, so the lender could absorb up to ₱45,000 of damage until insurance arrives in Phase 3. This may put off lenders of expensive items.
- **The payment gateway supports the held-funds flow.** A real launch needs written confirmation from the gateway and a fintech lawyer's review.

### Don't use without a source
- The **$21.74 billion P2P rental market figure for 2026** in the Market Study Whitepaper has **no source** in its references. Find a citable source or leave it out.
- The early concept screen showed **"0% Deposit"**, **$ prices** and **tokens**. None of these are part of the product: deposits are never zero, and prices are in pesos.
- The early concept was drawn on an **iPhone**, but AtHand is **Android only**.

### Patent awareness (for an IP or risk slide)
The group's patent report reviewed 14 related patents. Most AtHand features are common marketplace patterns. Three designs need care, and the product already avoids or defers them:

| Risky design | AtHand's approach |
| --- | --- |
| Automated, ranked outreach to likely lenders (US12450649B2) | A simple public request board instead |
| Automated image-based damage detection (US20030120509A1) | People compare the photos |
| Before/after photo comparison to compute deductions (US20110040692A1) | Check legal status before building it |

This is a course-level read, not legal advice. A real launch needs a freedom-to-operate check by a patent attorney.

---

## 11. Roadmap

| Phase | Scope | Gate to the next phase |
| --- | --- | --- |
| **0. Prototype** (now) | Clickable Android prototype with simulated payments, IDs and camera. All roles can be demoed on one phone | — |
| **1. Pilot** | The 29 must-have features in one city, for students and households, with a ₱50,000 item cap | People rent repeatedly, and households actually list and book |
| **2. Next release** | Request board, cancellation and late fees, side-by-side photo comparison, earnings dashboard, suggested pricing, QR handoff, Filipino language | Enough dispute and damage data for an insurer to price cover |
| **3. Protection** | Partner insurance replaces "the lender absorbs" for damage beyond the deposit | — |

The gates are checkpoints, not dates. Numeric targets will be set once the pilot city is chosen.

**Open questions the team is still deciding:** the pilot city and university, the late-return penalty amount, and household interviews to validate that segment.

---

## 12. What the prototype can show (live demo script)

The prototype is an installable Android app (APK) built with Expo / React Native. It runs on fake data held in memory, so every reload starts fresh. One phone plays every role. To switch roles, go to **Account → Demo: switch user**.

**Get it:** download `AtHand-prototype.apk` from the repo's GitHub **Releases → Latest prototype APK**, or run it with Expo Go (see the [README](../README.md)).

### Demo cast

| User | Role in the demo |
| --- | --- |
| **Bea Santos** | Student, Trusted tier (7 rentals, ★ 4.8), so a 10% deposit |
| **Marco Reyes** | Household lender, PhilSys ID, Trusted |
| **Ana Lim** | Student lender (calculator, ring light) |
| **Jun dela Cruz** | Student under 18, linked to guardian Liza |
| **Liza dela Cruz** | Jun's guardian |
| **Carlo Mendoza** | New user, not verified |

### A 5-minute demo path

1. **Trust-based pricing.** As **Bea**, open the camera listing and request 2 days. Point out the 5% fee and the 10% Trusted deposit in the breakdown.
2. **The full lifecycle.** Accept as the lender, pay with GCash, do the pickup check, then the return check.
3. **Dispute protection.** As the lender, tap **Flag damage**. The payment freezes, and support resolves the dispute.
4. **Guardian safety.** Switch to **Jun** and request the drill. It goes to **Liza** for approval first.
5. **Scam guard.** In Bea's **Inbox**, open the chat with Ana. Her message triggers the scam warning.
6. **Verification gate.** Switch to **Carlo** and try to book. The app asks for ID verification first.
7. **Listing safety.** As Bea, create a new listing. Try a value over ₱50,000, or a powered item that fails the safety checklist. Both are blocked.

---

## 13. Suggested deck outline

| # | Slide | Main content | Source section |
| --- | --- | --- | --- |
| 1 | Title | AtHand logo, one-line pitch, tagline | §1 |
| 2 | Problem | Buying is expensive for one-off use, and borrowing from strangers is risky | §2 |
| 3 | Who we talked to | 11 interviews, 9 students; quotes or insights | §2, §6 |
| 4 | Solution | Peer-to-peer rental built on trust, not deposits | §3 |
| 5 | How it works | The six-step lifecycle diagram | §9.1 |
| 6 | Product demo | Screenshots: Home, listing, price breakdown, pickup check | §9.5, §12 |
| 7 | Trust and safety | Verification, trust tiers, photo checks, scam guard, guardian accounts | §4 |
| 8 | Why we're different | The comparison table | §5.1 |
| 9 | Business model | 5% fee, worked example, low cost base | §7 |
| 10 | Market and launch | Students and households, citywide pilot, categories | §6 |
| 11 | Roadmap | Prototype → pilot → next release → insurance | §11 |
| 12 | Risks and how we handle them | Household assumption, lender risk, payments compliance, IP | §10 |
| 13 | Ask / next steps | What the team needs: pilot city, gateway partner, funding, insurance partner | §11 |

### Visual and tone notes
- The app uses a bright blue primary colour with pastel category tiles. Each category has its own colour: teal for lab gear, green for calculators, sky blue for cameras, purple for audio, rose for costumes, orange for kitchenware, indigo for electronics, and amber for tools.
- Show prices in **₱**, never **$**.
- Show **Android** device frames, not iPhones.
- Use the real demo names and items (Bea, the Casio calculator, the Canon camera, the Bosch drill) so the slides match the live demo.
