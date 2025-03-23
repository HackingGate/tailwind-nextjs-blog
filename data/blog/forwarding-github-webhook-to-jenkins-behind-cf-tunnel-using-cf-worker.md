---
title: 'Forwarding GitHub webhook to Jenkins behind Cloudflare Tunnel using Cloudflare Worker'
date: '2024-02-01'
lastmod: '2024-02-01'
tags: [Cloudflare, Jenkins, GitHub, Webhook, CloudflareTunnel, CloudflareWorker]
type: Blog
draft: false
summary: "How to set up a Cloudflare Worker to forward GitHub webhooks to a Jenkins server behind Cloudflare Tunnel, enabling automatic builds without exposing Jenkins to the internet."
license: CC BY-SA 4.0
---
## Background

In a [previous post](/blog/using-jenkins-to-auto-deploy-on-raspberrypi), I have set up Jenkins on my Raspberry Pi to auto deploy my webservice when I push to GitHub. It uses Git Polling to check for changes every 3 minutes. It's not efficient. I want to use GitHub Webhook to trigger the build.

## Problem

My Jenkins server is behind a Cloudflare Tunnel. It's not accessible from the internet. I need to forward the GitHub Webhook to Jenkins.

## Solution

I deployed a Cloudflare Worker to forward the GitHub Webhook to Jenkins.
Here is a graph to illustrate the flow:

```ASCII
+------------+
| Developer  |
| (Push to   |
| Repo)      |
+-----+------+
      |
      v
+------------+        +-------------------+        +------------------+
| GitHub     | -----> | Cloudflare Worker | -----> | Jenkins Server   |
| (Webhook)  |        |                   |        | behind Cloudflare|
+------------+        +-------------------+        | Tunnel           |
                                                   +---------+--------+
                                                             |
                                                             v
                                                     +-------------+
                                                     | Docker      |
                                                     | (Deployment)|
                                                     +-------------+

```

### Crate a service token

Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)

Go to `Access` -> `Service Tokens` -> `Create Service Token`

In my case, I named it `jenkins-worker-tunnel-token` and set it `Non-Expiring`.

Keep the page open for later use since it will show the token only once.

### Allow the Jenkins application to be accessed by the service token

Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)

Go to `Access` -> `Applications`, configure the Jenkins application, and click `Add a policy`.

I named it `Allow Jenkins token` and set action to `Service Auth`.

In `Create additional rules`, add `Include` and set `Selector` to `Service Token` and `Value` to `jenkins-worker-tunnel-token`.

Save the policy and save the application.

### Setup webhook receiver in Jenkins

Install `Generic Webhook Trigger Plugin` in Jenkins.

https://plugins.jenkins.io/generic-webhook-trigger/

Open Job configuration to enable `Generic Webhook Trigger`, and add a token.`

My job name is `BuildAndDeployVideoManagementServiceJob`, and I added a token `BuildAndDeployVideoManagementServiceJobToken`.

![BuildAndDeployVideoManagementServiceJobToken](/static/images/BuildAndDeployVideoManagementServiceJobToken.webp)

### Create a Cloudflare Worker

Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)

Go to `Workers & Pages` -> `Create application` -> `Create Worker`

Add the following code:

```js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request is for the webhook trigger
    if (url.pathname === '/generic-webhook-trigger/invoke') {
      // Extract token from the query parameter
      const token = url.searchParams.get('token');
      if (!token) {
        return new Response('Token not provided', { status: 400 });
      }

      // Construct the target URL with the token
      const targetUrl = `${env.TUNNEL_HOST}/generic-webhook-trigger/invoke?token=${token}`;

      // Clone the original request to modify headers
      let newRequest = new Request(targetUrl, request);

      // Add or modify headers
      newRequest.headers.set('CF-Access-Client-Id', env.CF_CLIENT_ID);
      newRequest.headers.set('CF-Access-Client-Secret', env.CF_CLIENT_SECRET);

      // Forward the request to the target service
      let response = await fetch(newRequest);

      // Return the original response if not a 302 redirect
      return response;
    } else {
      return new Response('Not Found', { status: 404 });
    }
  },
};
```

Go to `Settings` -> `Variables` -> `Environment Variables` and add the following variables:

- `TUNNEL_HOST`: The hostname of the Cloudflare application behind the tunnel
- `CF_CLIENT_ID`: The client ID of the service token
- `CF_CLIENT_SECRET`: The client secret of the service token

The worker will forward the request to the Jenkins server behind the Cloudflare Tunnel with `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers.[^1]

### Add a webhook in GitHub

Go to the repository in GitHub, and go to `Settings` -> `Webhooks` -> `Add webhook`

Set the `Payload URL` to the Cloudflare Worker URL with path `/jenkins/generic-webhook-trigger/invoke` and the token.

![GitHub-Webhook-BuildAndDeployVideoManagementServiceJobToken](/static/images/GitHub-Webhook-BuildAndDeployVideoManagementServiceJobToken.webp)

Now when I push to the repository, the GitHub Webhook will be forwarded to Jenkins behind the Cloudflare Tunnel using the Cloudflare Worker and the Jenkins job will be triggered.

[^1]: This GitHub repository helped me understand how a Cloudflare Worker can access a service behind a Cloudflare Tunnel: [cloudflare-worker-tunnel-mysql-example](https://github.com/brettscott/cloudflare-worker-tunnel-mysql-example)
