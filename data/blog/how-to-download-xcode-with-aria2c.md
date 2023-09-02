---
title: How to download Xcode with aria2c
date: '2015-10-01'
tags: [Xcode]
type: Blog
---

## 2019 Update

If you use [fastlane](https://docs.fastlane.tools), you can download and manage Xcode versions by using [xcode-install](https://github.com/xcpretty/xcode-install).

## Why did I wrote this

Download Xcode from unofficial site may contains malware, like [XcodeGhost](http://researchcenter.paloaltonetworks.com/2015/09/novel-malware-xcodeghost-modifies-xcode-infects-apple-ios-apps-and-hits-app-store/).

So, we must download Xcode from Apple, there's two ways to download Xcode, one way is download latest stable version from [Mac App Store](https://itunes.apple.com/en/app/xcode/id497799835), and another way is download any version from [Downloads for Apple Developers](https://developer.apple.com/download/more/).

## Export Cookie

Install [Cookie Exporter](https://chrome.google.com/webstore/detail/cookiestxt/njabckikapfpffapmjgojcnbfjonfjfg) for Chrome

Open [Downloads for Apple Developers](https://developer.apple.com/downloads/)

After sign in with your Apple ID, export cookie as cookies.txt
(You don't have to enroll any program, a free account is okay too).

Copy that text, and save as cookies.txt:

![cookies](/static/images/cookies.png)

To download Xcode 7.0 with aria2c, use this command:

```sh
aria2c --load-cookies=cookies.txt https://developer.apple.com/services-account/
```

## Install Xcode

Check shasum for [Xcode_7.dmg](http://adcdownload.apple.com/Developer_Tools/Xcode_7/Xcode_7.dmg
)

```sh
shasum Xcode_7.dmg
4afc067e5fc9266413c157167a123c8cdfdfb15e  Xcode_7.dmg
```

To install Xcode:

Open Xcode_7.dmg and drag Xcode to `/Applications`.

![install](/static/images/install.png)

## Fix permissions

If you installed a version from [Mac App Store](https://itunes.apple.com/en/app/xcode/id497799835), and a version download from [Downloads for Apple Developers](https://developer.apple.com/download/more/), you may found these two versions are different owner and group.

```sh
ls -al /Applications/Xcode*/*
```

![permissions](/static/images/permissions.png)

To change owner to `root`, group to `wheel`:

```sh
sudo chown -R root:wheel /Applications/Xcode*
```

## To verify the identity

To verify the identity of your copy of Xcode run the following command in Terminal on a system with Gatekeeper enabled:

```sh
spctl --assess --verbose /Applications/Xcode*
```

The tool should return the following result for a version of Xcode downloaded from the Mac App Store:

/Applications/Xcode.app: accepted  
source=Mac App Store

and for a version downloaded from Downloads for Apple Developers, the result should be either

/Applications/Xcode.app: accepted  
source=Apple

or

/Applications/Xcode.app: accepted  
source=Apple System


