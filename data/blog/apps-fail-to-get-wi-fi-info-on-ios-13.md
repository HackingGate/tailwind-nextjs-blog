---
title: 'Apps Fail to Get Wi-Fi Info on iOS 13'
date: '2019-06-12'
lastmod: '2019-06-12'
tags: [iOS 13, Wi-Fi, Privacy, Location, iOS]
type: Blog
draft: false
summary: "How iOS 13 changes Wi-Fi information access requiring location permissions, affecting apps like Seven-Eleven Multicopy, and a solution for developers to adapt to these privacy changes."
license: CC BY-SA 4.0
---
I was using [Seven-Eleven Multicopy](https://itunes.apple.com/us/app/seven-eleven-multicopy/id982091927) this morning.

My iPhone (iOS 13 Beta) is connected to Wi-Fi 711_MultiCopy.

![711MultiCopy-WiFi.png](/static/images/711MultiCopy-WiFi.webp)

But I can't send any documents via Wi-Fi to the printer. Because the Wi-Fi indicator shows Wi-Fi is not connected.

![711MultiCopy-Send.png](/static/images/711MultiCopy-Send.webp)

## Why

Because [Seven-Eleven Multicopy](https://itunes.apple.com/us/app/seven-eleven-multicopy/id982091927) needs to check if you are connected to the correct Wi-Fi to send files.

Accessing Wi-Fi information can be used to infer location. Apple always put user's privacy in the first. So Apple fixed this.

Starting from iOS 13. You'll need the location permission to access Wi-Fi information.

The app [Seven-Eleven Multicopy](https://itunes.apple.com/us/app/seven-eleven-multicopy/id982091927) doesn't require Location Services. That's the reason why the Wi-Fi indicator is gray.

## Solution

I have created an iOS project [iOS13-WiFi-Info](https://github.com/HackingGate/iOS13-WiFi-Info) shows how to solve.

The solution does not require Xcode 11.

So if you are the developer of [Seven-Eleven Multicopy](https://itunes.apple.com/us/app/seven-eleven-multicopy/id982091927) or any other iOS apps that need Wi-Fi info. Update your app as soon as possible.
