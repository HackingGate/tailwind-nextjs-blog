---
title: Using Cloudflare Zero Trust to expose services
date: '2023-09-29'
tags: [Cloudflare, Zero Trust Network]
type: Blog
license: CC BY-SA 4.0
---
## Zero Trust Network

Zero Trust Network has been hot these days. It's a new security model for the Internet to replace the old "castle-and-moat" model.

The term "Zero Trust Network" means we don't trust anything by default in a network to have a better security level. So we have to verify everything before we trust it.

I found this part which explains Zero Trust Network very well in the book [Project Zero Trust](https://learning.oreilly.com/library/view/project-zero-trust/9781119884842/)[^1]:

> There are many definitions of Zero Trust. [NIST](https://www.nist.gov/) defines it as follows (https://doi.org/10.6028/NIST.SP.800-207):
>> Zero trust (ZT) provides a collection of concepts and ideas designed to minimize
uncertainty in enforcing accurate, least privilege per-request access decisions in
information systems and services in the face of a network viewed as compromised. Zero
trust architecture (ZTA) is an enterprise’s cybersecurity plan that utilizes zero trust
concepts and encompasses component relationships, workflow planning, and access
policies. Therefore, a zero trust enterprise is the network infrastructure (physical and
virtual) and operational policies that are in place for an enterprise as a product of a zero
trust architecture plan.

I have been using Cloudflare for a long time. Cloudflare has a Zero Trust Network product called [Cloudflare One](https://www.cloudflare.com/one/). It's a great product to protect your network and services.[^2]

In this blog post, I'll show you how I exposed SSH and HTTP services from my home to the public by using Cloudflare's Zero Trust Network. So I can access these services from anywhere without exposing them to the public.

## Cloudflare Zero Trust Authentication

Cloudflare Zero Trust Authentication supports many authentication methods. I use Cloudflare Access to protect my services.

This is a screenshot of my Authentication settings:

![Authentication-settings](/static/images/Authentication-settings.webp)

I have three authentication methods:

- Google
- GitHub
- Email

And only members with the email domain `hackinggate.com` can access my services.

## Cloudflare Tunnel

Follow Cloudflare Zero Trust's guide to set up your Cloudflare account and Zero Trust team.

[https://developers.cloudflare.com/cloudflare-one/setup/](https://developers.cloudflare.com/cloudflare-one/setup/)

After creating a Zero Trust team. You can go to Access Tunnels to create tunnels. Cloudflare Zero Trust will generate copy-pastable scripts to let you run tunnels with `cloudflared` command easily.

After running the tunnel, if you see "HEALTHY" in the status, it means the tunnel is working.

## Exposing my Raspberry Pi

I have a Raspberry Pi at home. I want to access it from anywhere. So I created a tunnel for SSH.

Create a tunnel for Raspberry Pi:

![Create-a-tunnel-for-Raspberry-Pi](/static/images/Create-a-tunnel-for-Raspberry-Pi.webp)

### SSH

Create an SSH hostname for the tunnel:

I will expose `ssh://localhost` to `ssh://efficiency-node-ssh.hackinggate.com`.

![Public-SSH-Hostnames-for-tunnel](/static/images/Public-SSH-Hostnames-for-tunnel.webp)

Create an application for SSH service:

![Create-an-application-for-SSH-service](/static/images/Create-an-application-for-SSH-service.webp)

Chang `.ssh/config` to use the tunnel:

```.ssh/config
Host pi
  Hostname efficiency-node-ssh.hackinggate.com
  User pi
  ProxyCommand /usr/local/bin/cloudflared access ssh --hostname %h
```

Test the tunnel:

```bash
ssh pi
```

Sign in Cloudflare Access:

![Sign-in-Cloudflare-Access](/static/images/Sign-in-Cloudflare-Access.webp)

Approve the SSH connection:

![Approve-SSH-connection](/static/images/Approve-SSH-connection.webp)

It works!

![SSH-connection](/static/images/SSH-connection.webp)

### HTTP

Create a HTTP hostname for the tunnel:

I will expose `http://localhost:8083` to `https://efficiency-node-http.hackinggate.com`.

![Public-HTTP-Hostnames-for-tunnel](/static/images/Public-HTTP-Hostnames-for-tunnel.webp)

Create an application for HTTP service:

![Create-an-application-for-HTTP-service](/static/images/Create-an-application-for-HTTP-service.webp)

## Cloudflare Access

If you enabled app launcher, you can see the application in the app launcher:

![Cloudflare-Access-app-launcher](/static/images/Cloudflare-Access-app-launcher.webp)

## Conclusion

Cloudflare Zero Trust is a great product. It's easy to use and has many features. I hope you can use it to protect your network and services.

## References

[^1]: Project Zero Trust is a book that uses a story-telling way to explain Zero Trust, and it's easy to understand.
[^2]: You can read more about Cloudflare Zero Trust here: https://developers.cloudflare.com/cloudflare-one/.
