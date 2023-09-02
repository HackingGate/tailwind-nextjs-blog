---
title: Inspect the View Hierarchy of Any iOS Apps in 2019
date: '2019-06-11'
tags: []
type: Blog
license: CC BY-SA 4.0
---

If you're an iOS Developer. You've probably heard of [Reveal](https://revealapp.com).

It's a powerful runtime view debugging tool for iOS developers.

If you have a jailbroken iOS device. You're possible to debug any other's apps without having its source code.

Read [Peter Steinberger](https://twitter.com/steipete)'s post [How to Inspect the View Hierarchy of Third-Party Apps](https://petersteinberger.com/blog/2013/how-to-inspect-the-view-hierarchy-of-3rd-party-apps/).

I'll show you how to inspect with iOS 12.

![Reveal-App-Store.png](/static/images/Reveal-App-Store.png)

## Preparing

Install [Reveal](https://revealapp.com)

```sh
brew cask install reveal
```

Jailbreak an iOS device. My [tutorial](https://hackinggate.com/2019/06/09/resign-ipas-with-fastlane-for-jailbreak.html).

Install [Xcode](https://apps.apple.com/app/xcode/id497799835)

```sh
mas install 497799835
```

## Installing

Checkout my [GitHub fork of Reveal2Loader](https://github.com/HackingGate/Reveal2Loader)

```sh
git clone https://github.com/HackingGate/Reveal2Loader.git
cd Reveal2Loader
```

Build `.deb` package

```sh
make clean
make
make package
```

Upload `.deb` package to jailbroken iOS device

```sh
scp releases/debs/naville.revealloader2_1.0.0-1_iphoneos-arm.deb root@192.168.2.2:~/
```

SSH login in jailbroken iOS device

```sh
ssh root@192.168.2.2
```

Install `.deb`. It will download RevealServer.zip form my [download center](https://hackinggate.github.io/Downloads/). And set everything up.

```sh
dpkg -i naville.revealloader2_1.0.0-1_iphoneos-arm.deb
```

## Inspecting

On your jailbroken device. Open Settings -> Reveal

![Settings-Reveal.png](/static/images/Settings-Reveal.png)

Enable applications you want to inspect

![Reveal-Enable.png](/static/images/Reveal-Enable.png)

Open Reveal.app. You'll see inspectable apps appear.

![Reveal-App.png](/static/images/Reveal-App.png)

Reveal only works on Apple's own UI framework. Frameworks such as Flutter only shows one layer.

![Reveal-FlutterView.png](/static/images/Reveal-FlutterView.png)

[Pinterest](https://itunes.apple.com/us/app/pinterest/id429047995) is using [ASCollectionView](https://github.com/abdullahselek/ASCollectionView) for its waterfall layout.

![Reveal-Pinterest.png](/static/images/Reveal-Pinterest.png)

Pixiv ScrollView for image zoom.

![Reveal-Pixiv.png](/static/images/Reveal-Pixiv.png)

