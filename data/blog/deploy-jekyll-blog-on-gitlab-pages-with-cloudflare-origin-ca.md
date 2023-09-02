---
title: Deploy Jekyll blog on GitLab Pages with Cloudflare Origin CA
date: '2019-06-09'
tags: []
---

I was using [GitHub Pages](https://pages.github.com) until Aug 2018.

## Why did I move to GitLab

**TL;DR:** GitHub Pages are limited, not customizable.

### Gem github-page is blocking my way

If you set up a GitHub Page by following the instruction [here](https://jekyllrb.com/docs/github-pages/).

Your Jekyll blog will rely on the gem [github-page](https://github.com/github/pages-gem).

`github-page` has a lot of dependencies are not the latest version. GitHub will use `github-page` to generate your site regardless `github-page` is in your Gemfile or NOT.

One day I found table syntax works in my local environment but NOT in production env. Here's my issue:

[minima 2.1.1 couldn't show tables properly](https://github.com/jekyll/minima/issues/188)

It's a bug in minima 2.1.1, I'm not able to update to minima 2.2.0. Because the  outdated gem `github-page` blocked me.

### GitHub Pages does NOT renew my SSL

On May 1, 2018, GitHub announced [Custom domains on GitHub Pages gain support for HTTPS](https://github.blog/2018-05-01-github-pages-custom-domains-https/)

> We have partnered with the certificate authority Let’s Encrypt on this project. As supporters of Let’s Encrypt’s mission to make the web more secure for everyone, we’ve officially become Silver-level sponsors of the initiative.

This is good news for me. I got HTTPS for free. Which means I can finally enable SSL Full (strict) on Cloudflare CDN.

![SSL-Full-strict.png](/static/images/SSL-Full-strict.png)

But 3 months later. My HTTPS became untrusted. Because SSL issued by Let’s Encrypt expires in 3 months.

GitHub Pages failed to auto-renew my SSL. My friend said Let’s Encrypt failed to check your SSL status because you are using Cloudflare. If I want to make my site works I have to disable HTTPS before another solution is available.

Cloudflare Origin CA and GitLab came across my mind.

## Time to move to GitLab

### Generate Cloudflare Origin Certificate

03 May 2016. Cloudflare announced [Introducing CloudFlare Origin CA](https://blog.cloudflare.com/cloudflare-ca-encryption-origin/).

> Cloudflare Origin Certificates are free SSL certificates issued by Cloudflare that can be installed on your origin server to facilitate end-to-end encryption for your visitors using HTTPS. Once deployed, they can be used with the [Strict SSL mode](https://developers.cloudflare.com/ssl/origin/ssl-modes#strict).

It is totally free. You can issue a CA valid from 7 days to 15 years.

Open Cloudflare -> Your Awesome Site -> Crypto -> Origin Certificates -> Create Certificate

Click Next. Leave everything default is OK.

![Generate-Cloudflare-Origin-Certificates.png](/static/images/Generate-Cloudflare-Origin-Certificates.png)

### Configure custom CA on GitLab Pages

GitHub Pages does NOT support custom CA but GitLab Pages does.

Open GitLab -> Your Awesome Project -> Settings -> Pages.

Copy and paste the Certificate and Key you just generated.

![GitLab-custom-certificate.png](/static/images/GitLab-custom-certificate.png)

I recommend creating multiple Origin Certificates for different servers to strengthen security.

### Deploy Jekyll with GitLab CI

GitLab has a lot of [examples](https://gitlab.com/pages) to help you start a static website. It's much sweeter than GitHub.

Create `.gitlab-ci.yml` file

```yml
image: ruby:2.6

variables:
  JEKYLL_ENV: production
  LC_ALL: C.UTF-8

before_script:
  - bundle install

test:
  stage: test
  script:
  - bundle exec jekyll build -d test
  artifacts:
    paths:
    - test
  except:
  - master

pages:
  stage: deploy
  script:
  - bundle exec jekyll build -d public
  artifacts:
    paths:
    - public
  only:
  - master
```

Push the changes to GitLab. You'll see a CI pipeline running. Once it's done. You're able to view your new site.

