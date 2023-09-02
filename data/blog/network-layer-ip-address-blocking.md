---
title: Network Layer IP Address Blocking
date: '2021-08-15'
tags: []
type: Blog
---

## Introduction

For many reasons (privacy, security, political etc). You might have been using a few ways to avoid get (or being sent) some information on the Internet.  
Such as using [Enhanced Tracking Protection in Firefox](https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop) to avoid being tracked by websites. An ad blocker on your computer or phone. Avoid using some websites or apps. A VPN to avoid being monitored by your [Internet service provider](https://en.wikipedia.org/wiki/Internet_service_provider).

In this blog post. I'm going to show you how to block [IP](https://en.wikipedia.org/wiki/Internet_Protocol) addresses.  
Two majority ways are:

- [DNS blocking](https://en.wikipedia.org/wiki/DNS_blocking)
- [IP address blocking](https://en.wikipedia.org/wiki/IP_address_blocking)

## NextDNS

**The Eaiser Way**

#### DNS blocking on NextDNS

Almost all websites and apps need DNS for locating and identifying. A customizable DNS server will satisfy most of your needs. And a free service are already available on today's Internet.

- NextDNS ([Link](https://nextdns.io), [Link With My Referral Code](https://nextdns.io/?from=w7bgbust))

It supports many protocols and platforms. Comes with a clean web managemnt page. Many blocklists, TLDs block, custom list are available.

![NextDNS-Default-Configuration-Privacy.png](/static/images/NextDNS-Default-Configuration-Privacy.png)

## OpenWrt

**Home Router Way**

#### DNS blocking on OpenWrt

On my OpenWrt router I use two DNS related packages.

OpenWrt Documentation [DoH with Dnsmasq and https-dns-proxy](https://openwrt.org/docs/guide-user/services/dns/doh_dnsmasq_https-dns-proxy)

```
opkg install https-dns-proxy luci-app-https-dns-proxy
```

OpenWrt Package [DNS based ad/abuse domain blocking](https://github.com/openwrt/packages/blob/master/net/adblock/files/README.md)

```
opkg install adblock luci-app-adblock
```

If you enabled **Force Router DNS** in `https-dns-proxy` and installed `adblock`. DNS query ([tcp/udp on 53 or 853 port by default](https://github.com/openwrt/packages/blob/062e8f4fb3c721e3d802b46b5d6252ab2ce4c82f/net/https-dns-proxy/files/https-dns-proxy.init#L107)) will be hijacked and filtered by `adblock`.

Large source requires large RAM. And some features NextDNS do but `adblock` don't support such as blocking TLDs.

If `adblock` don't satisfy your needs. A workaround is change upstream DNS server to NextDNS in `/etc/config/https-dns-proxy`.

That will be a double DNS filtering.

#### IP address blocking on OpenWrt

GitHub repo: [kravietz/blacklist-scripts](https://github.com/kravietz/blacklist-scripts)

> These scripts use `iptables` with highly efficient `ipset` module to check incoming traffic against blacklists populated from publicly available sources.

I modified the script to fix a issue and supported [HackingGate/Country-IP-Blocks](https://github.com/HackingGate/Country-IP-Blocks).

View my modification note on [GitHub Gist Comment](https://gist.github.com/HackingGate/b75ac856397075756ea878380c5b848c#gistcomment-3844321).

## Pi-Hole

**Home Raspberry Pi Way**

#### DNS blocking on Pi-Hole

More powerful than OpenWrt's `adblock`.

[Pi-hole® Network-wide Ad Blocking](https://pi-hole.net)

For [homebridge-raspbian-image](https://github.com/homebridge/homebridge-raspbian-image) uesrs. Read the Wiki (https://github.com/homebridge/homebridge-raspbian-image/wiki/How-To-Install-Pi-Hole).

Pi-hole don't support DoH. You'll need additional tools. Or you can keep using `https-dns-proxy` (Force Router DNS enabled).

You can keep using NextDNS or `adblock` or both (that'll be a triple DNS filtering) on OpenWrt router depend on you.

## WireGuard

**Home VPN to allow you benifit away home**

#### Setup WireGuard server on OpenWrt

Visit OpenWrt Documentation [WireGuard server](https://openwrt.org/docs/guide-user/services/vpn/wireguard/server) or my [GitHub Gist Comment](https://gist.github.com/HackingGate/b75ac856397075756ea878380c5b848c#gistcomment-3698253).

#### Setup WireGuard server Raspberry Pi

Go to [Pi-hole documentation](https://docs.pi-hole.net/guides/vpn/wireguard/overview/) and follow the guide.

## FAQ

- Should I stop using ad blocker extension on my web broswer?

No

- Can I use both my home VPN and a third-party VPN service in the same time?

No (Because normally a third-party VPN will bypass your home protections). Ask what features are avaliable on your VPN provider, such as custom DNS, custom route, etc. Or consider setup a VPN on a VPS.
