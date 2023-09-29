---
title: Using Cloudflare tunnel to expose services
date: '2023-09-29'
tags: [Cloudflare, Zero Trust Network]
type: Blog
license: CC BY-SA 4.0
---

Zero Trust Network has been hot these days. It's a new security model for the Internet to replace the old "castle-and-moat" model.

The term "Zero Trust Network" means we don't trust anything by default in a network to have a better security level. So we have to verify everything before we trust it

In this blog post, I'll show you how I exposed HTTP services from my home to the public by using Cloudflare's Zero Trust Network. So I can access these services from anywhere without exposing them to the public.

## Cloudflare Tunnel

Follow Cloudflare Zero Trust's guide to set up your Cloudflare account and Zero Trust team.

[https://developers.cloudflare.com/cloudflare-one/setup/](https://developers.cloudflare.com/cloudflare-one/setup/)

After creating a Zero Trust team. You can go to Access Tunnels to create tunnels. Cloudflare Zero Trust will generate copy-pastable scripts to let you run tunnels with `cloudflared` command easily.

![Cloudflare-Tunnel-creation](/static/images/Cloudflare-Tunnel-creation.webp)

