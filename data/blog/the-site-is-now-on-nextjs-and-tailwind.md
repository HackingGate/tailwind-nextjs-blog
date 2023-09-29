---
title: The site is now on Next.js and Tailwind
date: '2023-09-28'
tags: [Next.js, Tailwind, Cloudflare Pages, Cloudflare CDN, GitHub, CC BY-SA 4.0, umami, giscus]
type: Blog
---

I have migrated the site from Jekyll to Next.js and Tailwind. The new site is hosted on Cloudflare Pages and can be found at https://hackinggate.com.

## Breaking Changes

- The old site is hosted on GitLab Pages with Cloudflare CDN in front of it. The new site is hosted on Cloudflare Pages.
- The old site is built with Jekyll. The new site is built with Next.js and Tailwind.
- The old site still can be found at https://hackinggate.gitlab.io. The new site is hosted at https://hackinggate.com.
- The old site's source code is hosted on GitLab. The new site's source code is hosted on GitHub.
- The old site is closed source. The new site is open source, can be found at https://github.com/HackingGate/tailwind-nextjs-blog.
- The old site doesn't have a Creative Commons license. The new site has separate license statements for each post and most of them are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- The old site doesn't track analytics. The new site uses a self-hosting [umami](https://umami.is/) instance to collect analytics data.
- The old site uses Disqus for comments. The new site uses [giscus](https://giscus.app/) for comments. Old comments are not migrated but can be found at https://hackinggate.gitlab.io.
- The old site uses the YYYY/MM/DD date format for URL prefixes. The new site omits dates from the URL prefix since posts may be updated in the future, rendering the inclusion of dates unnecessary.
- The new site uses redirects to keep URLs from old site working, and It's configured at https://github.com/HackingGate/tailwind-nextjs-blog/blob/main/_redirects, supported by Cloudflare Pages. 
- The privacy policy is updated. You can find it at https://hackinggate.com/privacy.

## Why

- I use Cloudflare Pages over GitLab Pages with Cloudflare CDN as it is easier to set up and manage.
- I use Next.js as it is the most popular React framework.
- I use Tailwind as it is the most popular utility-first CSS framework.
- I use GitHub over GitLab as it is more popular and easier for open source collaboration.
- I use CC BY-SA 4.0 as it is the most popular Creative Commons license and allows content to be shared and adapted as long as the license is credited and the new work is licensed under the same terms.
- I use Umami to collect analytics data as Umami does not collect any personal information, does not use cookies, does not track users across websites, and is GDPR compliant.
- I use a self-hosting Umami instance over a Umami instance hosted by Umami as I can have full control over the data.
- I use giscus over Disqus as giscus is eaiser to set up and manage, and is open source.
- I use redirects of Cloudflare Pages to keep URLs from old site working as I don't want to break links as well as for search engine indexing purpose.
- I value privacy and transparency as I'm a privacy advocate.

## How

- I use [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) as the starter template as it is the most popular Next.js and Tailwind blogging starter template.
- I use [Cloudflare Pages](https://pages.cloudflare.com/) to host the site as it is the easiest way to host a static website with Cloudflare CDN.
- I use [Cloudflare CDN](https://www.cloudflare.com/cdn/) to serve the site as it is the most popular CDN.

## What's Next

- I will add more posts.
- I will add more projects.
- I will deepen my knowledge of Next.js and Tailwind but it's not a priority.
