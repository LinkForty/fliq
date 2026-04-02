# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* block ACTIVITY_RECOGNITION permission from Android manifest ([561b1c5](https://github.com/linkforty/fliq/commit/561b1c5b00aaf59c5e698c0417efdd067db13751))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use consistent rotating chevron for all collapsible sections ([6fa90fc](https://github.com/linkforty/fliq/commit/6fa90fc5ec7c5a7620c6215fba6f09ae6e417b2a))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))
* use right chevron when collapsed, down chevron when expanded ([5050902](https://github.com/linkforty/fliq/commit/50509022fdc584f9a4fad695958c093dcd02d5f2))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* make empty state tappable to create message, remove header title ([4380407](https://github.com/linkforty/fliq/commit/438040743515082b4a746e8dbbb7b7f90112ffaf))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use consistent rotating chevron for all collapsible sections ([6fa90fc](https://github.com/linkforty/fliq/commit/6fa90fc5ec7c5a7620c6215fba6f09ae6e417b2a))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))
* use right chevron when collapsed, down chevron when expanded ([5050902](https://github.com/linkforty/fliq/commit/50509022fdc584f9a4fad695958c093dcd02d5f2))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* make empty state tappable to create message, remove header title ([4380407](https://github.com/linkforty/fliq/commit/438040743515082b4a746e8dbbb7b7f90112ffaf))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use consistent rotating chevron for all collapsible sections ([6fa90fc](https://github.com/linkforty/fliq/commit/6fa90fc5ec7c5a7620c6215fba6f09ae6e417b2a))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))
* use right chevron when collapsed, down chevron when expanded ([5050902](https://github.com/linkforty/fliq/commit/50509022fdc584f9a4fad695958c093dcd02d5f2))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* make empty state tappable to create message, remove header title ([4380407](https://github.com/linkforty/fliq/commit/438040743515082b4a746e8dbbb7b7f90112ffaf))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use consistent rotating chevron for all collapsible sections ([6fa90fc](https://github.com/linkforty/fliq/commit/6fa90fc5ec7c5a7620c6215fba6f09ae6e417b2a))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))
* use right chevron when collapsed, down chevron when expanded ([5050902](https://github.com/linkforty/fliq/commit/50509022fdc584f9a4fad695958c093dcd02d5f2))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))
* use right chevron when collapsed, down chevron when expanded ([5050902](https://github.com/linkforty/fliq/commit/50509022fdc584f9a4fad695958c093dcd02d5f2))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-02)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse Legal and Data sections behind toggles on settings page ([cdda063](https://github.com/linkforty/fliq/commit/cdda063052b62857482651769c79a7a646c1a8a8))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-01)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* collapse LinkForty SDK settings behind Advanced toggle ([2dfecd0](https://github.com/linkforty/fliq/commit/2dfecd085e97f99c7fa48c96dad938a601c40d76))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-01)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* restore google-services.json and eas.json required for EAS builds ([64fa159](https://github.com/linkforty/fliq/commit/64fa1592ef990445934bc12a63cb6fa20c94f380))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-01)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* set webFallbackUrl on SDK-created links for proper redirect ([fecdcc6](https://github.com/linkforty/fliq/commit/fecdcc666d384f98e843a50b6b1924247c963e0d))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-01)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-04-01)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* integrate OTP verification flow into mobile app ([99a93af](https://github.com/linkforty/fliq/commit/99a93afba23bc8fca040fe1d444b0c59e50dabfc))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* add Twilio OTP verification and JWT authentication ([61d1c9e](https://github.com/linkforty/fliq/commit/61d1c9ee14763250602b34b82c2312ff3457389a))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* throw error if DATABASE_URL is not set in production ([bf992d4](https://github.com/linkforty/fliq/commit/bf992d407795434a3a9c5e18b0ab7bfab6a3e70c))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([d474a80](https://github.com/linkforty/fliq/commit/d474a807600f45f0a5033d17e23d801dd6634c09))
* add dotenv, docker-compose, and update server README ([db90ad6](https://github.com/linkforty/fliq/commit/db90ad6760395f17fd3b79fbe33f3a9388ae05fe))
* handle Universal Link and interstitial deep links in app URL listener ([ea37e47](https://github.com/linkforty/fliq/commit/ea37e47f427f7580f3ed8fccfd2bbaebd74ea366))
* remove hardcoded URLs and add .env to gitignore ([01b7aeb](https://github.com/linkforty/fliq/commit/01b7aeb2ff8339b2a678275f56168985e193a5d3))
* update expo-localization to fix Xcode build error ([3f3e576](https://github.com/linkforty/fliq/commit/3f3e57682442c173e0385adb9c801ff6f912ee6a))
* update Node.js to 22 in release workflow for semantic-release compatibility ([dfcfc2c](https://github.com/linkforty/fliq/commit/dfcfc2c79bde86d2cbe7e9f21875df1c6d5c7fd2))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([3fdbf12](https://github.com/linkforty/fliq/commit/3fdbf1262472c1ba4efbda58dcd37d6fc811a2e6))
* add explicit push notification permission button to onboarding ([956ac9e](https://github.com/linkforty/fliq/commit/956ac9e00c01eb62bfc5d3152dc3f89de98ab301))
* add Firebase FCM for Android push notifications ([a371ac7](https://github.com/linkforty/fliq/commit/a371ac7acc016469ca5198525d3bbebb83fcc366))
* add Fliq landing page for fliq.linkforty.com ([1ee4ba0](https://github.com/linkforty/fliq/commit/1ee4ba067b56419c9d79e687f88e569ea75e38f5))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([5c2427d](https://github.com/linkforty/fliq/commit/5c2427d1ed90f949df64a3a04d269d08c5e3f049))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* E2E encryption release prep, app store configuration, and BIS compliance ([ba6b5ee](https://github.com/linkforty/fliq/commit/ba6b5ee1a68107702a4788964baf6659e4394002))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* push-to-phone delivery, navigation fixes, and updated docs ([8f5c782](https://github.com/linkforty/fliq/commit/8f5c782e8e0dcac35de8dc67cdf3c33732917c25))
* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([a0d688a](https://github.com/linkforty/fliq/commit/a0d688a82f234ff417959563b963d292920377f6))
* rebrand to LinkForty color scheme and update onboarding content ([8cba661](https://github.com/linkforty/fliq/commit/8cba6610503c1ac522494350421df812e778da75)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)
* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([b0cc1d2](https://github.com/linkforty/fliq/commit/b0cc1d20c2cac66ed642127945e82a47442035f8)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))

# [1.5.0](https://github.com/linkforty/fliq/compare/v1.4.0...v1.5.0) (2026-03-28)


### Features

* rebrand to Fliq'd, fix push notifications, and improve Android safe areas ([2fa5ef6](https://github.com/linkforty/fliq/commit/2fa5ef63797397c210d369b7193475ed143b67c2))

# [1.4.0](https://github.com/linkforty/fliq/compare/v1.3.1...v1.4.0) (2026-03-25)


### Features

* add Firebase FCM for Android push notifications ([1caa7dc](https://github.com/linkforty/fliq/commit/1caa7dce636a9bda7a4bd0cd18422188986e76cf))

## [1.3.1](https://github.com/linkforty/fliq/compare/v1.3.0...v1.3.1) (2026-03-24)


### Bug Fixes

* handle Universal Link and interstitial deep links in app URL listener ([28b4d24](https://github.com/linkforty/fliq/commit/28b4d249219a1daa6619106e13d6995d4986b9b3))

# [1.3.0](https://github.com/linkforty/fliq/compare/v1.2.0...v1.3.0) (2026-03-23)


### Features

* E2E encryption release prep, app store configuration, and BIS compliance ([7f5f68b](https://github.com/linkforty/fliq/commit/7f5f68bbab4e13e318bb2beb0c32ffe246f81fc4))

# [1.2.0](https://github.com/linkforty/fliq/compare/v1.1.0...v1.2.0) (2026-03-20)


### Features

* redesign website and mobile app with dark theme, E2E encryption, and theme toggle ([3de8df2](https://github.com/linkforty/fliq/commit/3de8df2960c329a1a05b45a6d8a31e6f298efd18)), closes [#050507](https://github.com/linkforty/fliq/issues/050507) [#39FF14](https://github.com/linkforty/fliq/issues/39FF14)

# [1.1.0](https://github.com/linkforty/fliq/compare/v1.0.1...v1.1.0) (2026-03-19)


### Features

* add Fliq landing page for fliq.linkforty.com ([1c01eae](https://github.com/linkforty/fliq/commit/1c01eaed65be381d4b542d46f44f3eceec9cbb66))
* rebrand to LinkForty color scheme and update onboarding content ([910b5a1](https://github.com/linkforty/fliq/commit/910b5a1bfeae699e5930235e0f2026f0cd32ae87)), closes [#26adae](https://github.com/linkforty/fliq/issues/26adae) [#19192d](https://github.com/linkforty/fliq/issues/19192d)

## [1.0.1](https://github.com/linkforty/fliq/compare/v1.0.0...v1.0.1) (2026-03-19)


### Bug Fixes

* update expo-localization to fix Xcode build error ([5fd323b](https://github.com/linkforty/fliq/commit/5fd323b01a3efb573a04ada290527c4c92a04a93))

# 1.0.0 (2026-03-15)


### Bug Fixes

* add Dockerfile for Fliq server and update production API URL ([6180c75](https://github.com/linkforty/fliq/commit/6180c75890e2a611be00c9de7ab94b71f710d4db))
* add dotenv, docker-compose, and update server README ([448c1d6](https://github.com/linkforty/fliq/commit/448c1d69ec237bd8512b5bd04120556e18738e0c))
* remove hardcoded URLs and add .env to gitignore ([b910b0c](https://github.com/linkforty/fliq/commit/b910b0c9d18a14be15ea6fd6e17db7f8b895629c))
* update Node.js to 22 in release workflow for semantic-release compatibility ([7315339](https://github.com/linkforty/fliq/commit/7315339c262c450df3611f799248403664c4af62))
* use correct backend API URL instead of frontend SPA domain ([16b167a](https://github.com/linkforty/fliq/commit/16b167a91b4a366a125369b21b1c2602ae0c4d70))


### Features

* add event tracking, push notifications, and standalone Fliq server ([165e09e](https://github.com/linkforty/fliq/commit/165e09e75966a6e3f77e4a1730d93370e1375a49))
* add explicit push notification permission button to onboarding ([0a304cb](https://github.com/linkforty/fliq/commit/0a304cbd478c6004f8c12bc2261e32cb9ca52c93))
* add onboarding flow, swipe-to-delete, auto-delete setting, and SDK fixes ([1d5ecfc](https://github.com/linkforty/fliq/commit/1d5ecfc4f2e2ba1fd11bfe2b26cfa83a63e0042c))
* add reveal styles, EAS config, legal links, and store listing ([9bb6535](https://github.com/linkforty/fliq/commit/9bb65356172c3b3b588facf11cd3420b6c438739))
* build Create Secret screen and deeplink generation ([0741aef](https://github.com/linkforty/fliq/commit/0741aef8ea9704d745e996c04ecf08ab6065a264))
* build Home screen with message list, storage layer, and FAB ([170b47f](https://github.com/linkforty/fliq/commit/170b47f1376f698008cea9c66ee8bc0739dc4086))
* build Reveal screen with scratch-off and blur reveal styles ([4708ff6](https://github.com/linkforty/fliq/commit/4708ff607dca48317c3f9c6a239e4bb25b202e5f))
* implement direct deep linking for incoming URLs ([eb84fdb](https://github.com/linkforty/fliq/commit/eb84fdba71c4d76c57f2c3e099e5795b43be17c8))
* integrate LinkForty SDK for optional dashboard tracking ([6b8924d](https://github.com/linkforty/fliq/commit/6b8924d47c5082b4d73e3d73fe980bb312c5c793))
* push-to-phone delivery, navigation fixes, and updated docs ([065b59f](https://github.com/linkforty/fliq/commit/065b59f029b78931d15d2170e3672ac6cf8acbc2))
* scaffold Fliq demo app with Expo Router and NativeWind ([8883b8a](https://github.com/linkforty/fliq/commit/8883b8a8156c2e65c4daf3e69d377f86875be831))
