# Lock-In (APK)

Web app in `www/`, wrapped with Capacitor. Alarms use @capacitor/local-notifications (exact alarms, 14-day rolling window refreshed on every app open).

## Get the APK (no Android Studio needed)
1. Create a free GitHub account and a new repository.
2. Upload every file in this folder (including the hidden `.github` folder) to it.
3. Open the repo's Actions tab, run "Build APK", wait ~5 minutes.
4. Download the `lock-in-apk` artifact, unzip, copy `app-debug.apk` to your phone and install it (allow "install unknown apps").

## Or build locally
Install Node 20, JDK 17, Android Studio, then:
npm install && npx cap add android && npx cap sync android && cd android && ./gradlew assembleDebug
(Add the permissions listed in .github/workflows/build-apk.yml to AndroidManifest.xml first.)
