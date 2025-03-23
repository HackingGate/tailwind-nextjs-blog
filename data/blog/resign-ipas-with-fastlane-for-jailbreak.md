---
title: 'Resign IPAs with Fastlane for Jailbreak'
date: '2019-06-10'
lastmod: '2019-06-10'
tags: [IPA, Jailbreak, iOS, fastlane, Xcode, Apple, Developer, Certificate, Provisioning Profile, App ID, Apple Configurator 2, Undecimus, Electra]
type: Blog
draft: false
summary: "Using Fastlane to resign iOS IPA files for jailbroken devices, with a step-by-step workflow for app modification and distribution outside the App Store while maintaining app functionality."
license: CC BY-SA 4.0
---
## Jailbreak tools

[Undecimus](https://github.com/pwn20wndstuff/Undecimus): unc0ver jailbreak for iOS 11.0 - 12.1.2

[Electra](https://coolstar.org/electra/): iOS 11.0 – 11.4.1 and tvOS 11.0 - 11.4.1

You are NOT able to install these apps directly. Because IPA files are not signed with a certificate.

In this tutorial. I will show you how to resign IPAs with [fastlane](https://fastlane.tools).

## What you need to resign an IPA

- Mac
- iOS or tvOS device you want to jailbreak
- $99 Apple Developer account

## Add Devices

Install [Xcode](https://itunes.apple.com/jp/app/xcode/id497799835) from Mac App Store.

Open Xcode -> Window -> Devices and Simulators (Shift + Command + 2)

Add devices you want to jailbreak.

![Add-Devices.png](/static/images/Add-Devices.webp)

## Create Certificate

Log in your [Apple Developer account](https://developer.apple.com/).

We are going to create a Certificate, an Identifier, and a Profile.

![Certificates-Identifiers-Profiles.png](/static/images/Certificates-Identifiers-Profiles.webp)

Create a New Certificate. Select Apple Distribution.

![Create-Apple-Distribution-Certificate.png](/static/images/Create-Apple-Distribution-Certificate.webp)

## Register App ID

Register a new App ID.

![Register-App-ID.png](/static/images/Register-App-ID.webp)

Fill description with Undecimus. Fill Bundle ID with a reverse-domain name style string (i.e., com.example.undecimus).

![Regieter-App-ID-Fill.png](/static/images/Regieter-App-ID-Fill.webp)

## Create Provisioning Profile

Create a new Provisioning Profile.

![Create-Provisioning-Profile.png](/static/images/Create-Provisioning-Profile.webp)

On the next page. Select the App ID you just created.

![Provisioning-Profile-Select.png](/static/images/Provisioning-Profile-Select.webp)

Select the certificate you created before.

![Select-Certificate.png](/static/images/Select-Certificate.webp)

Select devices you wish to include. (Ad Hoc apps can only be installed on a limited number of registered devices)

![Select-Devices.png](/static/images/Select-Devices.webp)

Enter a Provisioning Profile Name and click Generate.

![Name-Provisioning-Profile.png](/static/images/Name-Provisioning-Profile.webp)

Download the Provisioning Profile (Undecimus_Ad_Hoc.mobileprovision). We'll use it later.

## Download IPA

Open Undecimus releases page. Download the latest .ipa file.

![Undecimus-Download-IPA.png](/static/images/Undecimus-Download-IPA.webp)

## Resign IPA

Install fastlane (see [setup doc](https://docs.fastlane.tools/getting-started/ios/setup/))

```sh
sudo gem install fastlane -NV
```

Resign IPA with command

```sh
fastlane run resign ipa:"Undecimus-v3.2.1.ipa" provisioning_profile:"Undecimus_Ad_Hoc.mobileprovision"
```

You can also use Fastfile. See [my gist](https://gist.github.com/HackingGate/88535a1a9ceba076539ccb3c9340108b) to learn more about Fastfile.

## Install IPA

Install [Apple Configurator 2](https://itunes.apple.com/jp/app/apple-configurator-2/id1037126344)

Select device. Drag & drop IPA.

![Undecimus-Screenshot.png](/static/images/Undecimus-Screenshot.webp)

The app expiry date is the same as your certificate. Which is up to one year.

