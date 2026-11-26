# AtHand

AtHand is a peer-to-peer rental app for Android: people rent tools and equipment from verified owners nearby.

- [`requirements.md`](requirements.md): the requirements document, with the key decisions, FR/NFR tables, release plan and known risks.
- [`mobile/`](mobile/): a clickable prototype of the app, built with Expo (React Native).

## Run the prototype

You need Node.js and the **Expo Go** app on an Android phone (from the Play Store).

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same Wi-Fi network. If they aren't, run `npx expo start --tunnel`.

## Install the APK (no computer needed)

Copy `AtHand-prototype.apk` to an Android phone (Android 7 or newer) and open it. The phone will ask you to allow installs from that source (Files, Drive or Messenger), so allow it. Android may show a Play Protect warning because this test build isn't from the Play Store. Choose **Install anyway**.

## Get the latest APK on your phone

GitHub builds a fresh APK every time app changes are pushed to `main`. On your phone, sign in to GitHub in the browser or the GitHub app and open the repo's **Releases**, then **Latest prototype APK**, then `AtHand-prototype.apk`. You can also start a build by hand under **Actions → Build Android APK → Run workflow**. A build takes about 10 minutes.

## Build the APK yourself

You need JDK 17 and the Android SDK, with platform 37.0, build-tools 37.0.0, NDK 27.1.12297006 and CMake 3.22.1. Set `JAVA_HOME` and `ANDROID_HOME` to point at them.

```bash
cd mobile
npm install
npm run apk:prepare   # generates android/ (gitignored)
npm run apk:build     # about 7 minutes the first time
```

The output is `mobile/android/app/build/outputs/apk/release/app-release.apk`. It's signed with the Android debug key, which is fine for testing but can't be published to the Play Store.

## What the prototype is

It runs on fake data held in memory. Nothing is saved, and every reload starts fresh. Payment, ID checks, camera photos and notifications are simulated. One phone plays every role. To switch between borrower, lender, guardian and an unverified new user, go to **Profile → Demo: switch user**.

### A demo walkthrough

1. Start as **Bea** (Trusted tier, 10% deposit). On **Home**, open the camera listing and request 2 days. The breakdown shows the 5% fee and the deposit.
2. Open the rental and accept it as the lender. Pay with GCash. Do the pickup check, then the return check.
3. As the lender, choose **Flag damage**. The payment freezes. Support then resolves the dispute.
4. Switch to **Jun**, a minor, and request the drill. It goes to his guardian **Liza** for approval first.
5. On Bea's **Inbox**, open the chat with Ana. Her message trips the scam guard.
6. Switch to **Carlo**, who is unverified, and try to book. The app asks for ID verification.
7. As Bea, go to **My Rent Out List → New listing**. Try a declared value over ₱50,000, or a powered item that fails the safety checklist.

### Requirements covered

The prototype covers these: FR-02 (simulated), 03, 04, 05, 06, 07 (as date overlap checks), 10 (a list, no map), 11, 12, 14, 15, 16, 17, 18 (simulated), 19, 22, 23, 27, 28, 29 (as an in-app inbox), 30, 31 (shown), 32, 33 (in part), 34 (in part), 35, 36, 37 (placeholder) and 41.

These are not built: the admin web console (FR-40, partly replaced by demo buttons), maps, the request board, promotions, Filipino translation, a real backend, and real payments.
