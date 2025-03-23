---
title: 'Hosting Multiple Web Servers Behind a Single IP Address'
date: '2025-03-23'
lastmod: '2025-03-23'
tags: ['Network', 'web-hosting', 'reverse-proxy', 'SSL', 'self-hosting', 'HAProxy', 'Nginx']
type: Blog
draft: false
summary: "A comprehensive guide to hosting multiple web services on the same port of the same IPv4 address using a reverse proxy, managing SSL certificates, and overcoming common home-hosting challenges."
---
## Introduction and Problem Statement

As my home hosting needs grow, I’ve encountered limitations with cloudflared's reverse proxy. To overcome these, I decided to deploy a full-fledged reverse proxy on my own.

I have a single ISP connection at home, which provides me with a dedicated IPv4 address. This means I have one port (443) available, which is essential for hosting websites over SSL.

> **Disclaimer 1**: Some home ISPs may block port 443 even if you have a dedicated IP address. For example, they might block port 25 to prevent spam emails or restrict ports 80/443 in countries where a license is required to host a website. If using an IPv4 address is inconvenient, consider switching to IPv6 (if available), using Hurricane Electric’s Free IPv6 Tunnel Broker, or utilizing cloudflared's tunnel. However, each option has its limitations.

> **Disclaimer 2**: A dedicated IPv4 address ensures you are not sharing the same IP address with your neighbors, but it does not guarantee a static IP address. While data centers often provide static IPs, home ISPs typically assign dynamic IPs via PPPoE, which can change when your router restarts—unless you pay extra for a static IP. To address this, you can run a DDNS program to automatically update your A DNS record, which is a manageable solution for most users.

So, with a single dedicated IPv4 and port 443 available, how can I run multiple web services on the same port? The solution lies in using a reverse proxy with SNI (Server Name Indication) to distribute traffic.

## The Journey to My Final Setup

### Initial Research

The short answer: Multi-layer Nginx servers. The upper layer of the Nginx server will distribute traffic by SNI (no decryption required for viewing SNI, and SSL termination will be handled by the under-layer Nginx server).

Nginx has a module for extracting SNI:
https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html

### Understanding My Hardware Setup

My setup consists of:
- Netgear Nighthawk X4S R7800 as the router (running on OpenWrt 23.05.5)
- NanoPi R6S as a server (running on Ubuntu 24.04.2)
- Netgear 1Gbps Unmanaged L2 Switch
- Various other machines running SSL web services (e.g., I run Code Server on my PC, but the PC is not always on, so I run other services on other machines)

For the upper Nginx server, I have two options:
- Netgear Nighthawk X4S R7800 (OpenWrt 23.05.5)
- NanoPi R6S (Ubuntu 24.04.2)

### Evaluating Nginx Versions

For Ubuntu 24.04, nginx.org provides official pre-builds, with up-to-date versions often newer than the default Ubuntu apt source. To install the newest stable nginx:

```bash
# Download and install the Nginx signing key using the recommended method
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/nginx.gpg

# Create the repository configuration file
echo "deb https://nginx.org/packages/ubuntu/ noble nginx
deb-src https://nginx.org/packages/ubuntu/ noble nginx" | sudo tee /etc/apt/sources.list.d/nginx.list

# Update package lists
sudo apt update

# Install Nginx
sudo apt install nginx
```

The newest stable version was installed: 1.26.3.

For OpenWrt 23.05.5, the available version was 1.25.0. Upgrading to OpenWrt 24.10.0 would provide 1.26.1, which is still older than 1.26.3.

<a href="https://downloads.openwrt.org/releases/24.10.0/packages/arm_cortex-a15_neon-vfpv4/packages/">
    <img width="1124" alt="Image" src="/static/images/24.10.0_packages_arm_cortex-a15_neon-vfpv4-nginx.webp" />
</a>

### Choosing the Best Server for Nginx

Even though the upper layer isn't terminating SSL, it still needs to parse parts of the TLS handshake (to extract the SNI using the ssl_preread module). This means that even though it isn't doing full SSL termination, it still runs TLS-related code paths. The improvements and security fixes in newer versions can still be beneficial.

Therefore, I decided to use the NanoPi R6S with Ubuntu 24.04.2 to run the newer version of Nginx.

### Network Setup

I set up redundant network paths:
```
Path A: Router's LAN0 → R6S's WAN0
Path B: Router's LAN1 → L2 switch's WAN port → L2 switch's LAN port → R6S's WAN1
```

This provides redundancy and allows load distribution. On my NanoPi R6S, I have a 2.5Gbps WAN and a 2.5Gbps LAN, which I wired to the switch and router respectively. Surprisingly, the LAN port automatically recognized and functioned as a WAN port.

I tested by disconnecting the switch from the router and found I could still ping a machine on the switch from NanoPi R6S using arping on layer 2 if the ARP table remained:

```bash
sudo arping -I eth2 192.168.X.X
```

The hardware setup is complete, offering redundancy if the connection between the router and switch is busy or down.

### Operating System Considerations

I wanted to deploy a Tailscale exit node on NanoPi R6S for better UDP performance, which benefits from a newer Linux kernel. I flashed Armbian with kernel 6.12:

```
OS: Armbian 25.2.2 noble aarch64
Host: FriendlyElec NanoPi R6S
Kernel: Linux 6.12.17-current-rockchip64
```

This is newer than the 6.1 kernel that FriendlyElec builds use (which is stable and has approximately 6 years of longterm support).  
A second tier longterm kernel should have approximately 2-3 years of longterm support, 6.12 and 6.6 are seond tier longterm kernels, 6.1 is a first tier, you can check it from here: https://www.kernel.org/category/releases.html.

### Installing the latest Nginx version

Since I'm using an Ubuntu-based Armbian build, I followed the Ubuntu instructions from nginx.org. With the stable Nginx release channel, I installed Nginx version 1.26.3-1~noble.

### Authentication for Self-Hosted Services

My self-hosted Code Server isn't a public service. Previously, I used Cloudflare Access as part of Cloudflare Zero Trust with Cloudflare tunnel to ensure only authorized users could access it. For the Nginx setup, I needed a replacement for authentication.

Looking at options suggested by Coder, I found OAuth2 Proxy, which has good Nginx integration:
https://oauth2-proxy.github.io/oauth2-proxy/configuration/integration

OAuth2 Proxy needs to see HTTP headers, so installing it on the same server doing SSL termination (the under-layer Nginx server) is easiest.

Since Arm Linux isn't supported by linuxbrew yet, I used `goenv` (a go version manager) to install Go and then installed OAuth2 Proxy.

Login page
![Image](/static/images/oauth2-proxy-github-hackinggate.com.webp)

Try login with email not allowed (non hackinggate.com email)
![Image](/static/images/oauth2-proxy-403.webp)

Try login with email allowed (hackinggate.com email)
![Image](/static/images/coder-server-welcome.webp)

Test cookie expiry
![Image](/static/images/oauth2-proxy-github-hackinggate.com.webp)

### Certificate Management with ACME

ACME (Automatic Certificate Management Environment) is a spec with many open-source implementations. I tried `certbot` and `go-acme/lego` but had difficulties. Eventually, I settled on `acme.sh` as the most mature implementation.

To allow automated certificate renewal, I granted the non-root user permission to reload Nginx:

```bash
sudo visudo -f /etc/sudoers.d/pi
```

Adding:
```
pi ALL=NOPASSWD: /usr/bin/systemctl reload nginx
```

### Choosing a Challenge Type for Certificate Issuance

After reading about the different ACME challenge types from Let's Encrypt (https://letsencrypt.org/docs/challenge-types/):

1. **HTTP-01 challenge**: Won't work with Cloudflare proxying.
2. **DNS-01 challenge**: Works but requires putting DNS API credentials on the server.
3. **TLS-ALPN-01**: A newer option that fixes some issues but requires TLS-terminating reverse proxy support.
4. **TLS-SNI-01**: Removed, no longer available.

I initially chose TLS-ALPN-01.

### Setting Up Nginx for TLS-ALPN-01

First, I verified that the upper layer Nginx server had the necessary stream module:

```bash
nginx -V 2>&1 | grep -- '--with-stream'
```

I set up the stream configuration in `/etc/nginx/stream.conf`:

```nginx
stream {
    # Map the ALPN protocol list to a simple variable
    map $ssl_preread_alpn_protocols $alpn_pass {
        "~\bacme-tls/1\b"   "acme";   # If we see "acme-tls/1" in the list
        default             "http";
    }

    # Map the SNI to a simpler variable
    map $ssl_preread_server_name $sni_pass {
        "code-server-nanopi-r6s.hackinggate.com"  "nanopi";
        "code-server-tuf.hackinggate.com"         "tuf";
        default                                   "other";
    }

    # Combine both variables into a destination
    map "$sni_pass:$alpn_pass" $destination {
        # TUF domain, any ALPN => "tuf_https"
        "tuf:acme"   "tuf_https";
        "tuf:http"   "tuf_https";

        # Nanopi domain + ALPN = acme => "nanopi_alpn_challenge"
        "nanopi:acme"  "nanopi_alpn_challenge";

        # Nanopi domain + normal HTTPS => "nanopi_local_https"
        "nanopi:http"  "nanopi_local_https";

        # Fallback for everything else => also "nanopi_local_https"
        default        "nanopi_local_https";
    }

    # Define the upstreams
    upstream tuf_https {
        # raw TLS passed to TUF machine
        server 192.168.4.51:443;
    }

    upstream nanopi_local_https {
        # normal HTTPS on local machine
        server 127.0.0.1:8443;
    }

    upstream nanopi_alpn_challenge {
        # ephemeral ACME TLS-ALPN server on local machine
        server 127.0.0.1:10443;
    }

    # Stream server that listens on 443
    server {
        listen 443 reuseport;
        ssl_preread on;
        proxy_pass $destination;
    }
}
```

### Setting Up Code Server's Proxy on NanoPi R6S

I created a configuration for my Code Server in `/etc/nginx/sites-enabled/code-server-nanopi-r6s.hackinggate.com`:

```nginx
server {
    # Redirect HTTP → HTTPS for the nanopi domain
    listen 80;
    listen [::]:80;
    server_name code-server-nanopi-r6s.hackinggate.com;
    return 301 https://$host$request_uri;
}

server {
    listen 8443 ssl;
    listen [::]:8443 ssl;
    listen 8443 quic reuseport;
    listen [::]:8443 quic reuseport;

    server_name code-server-nanopi-r6s.hackinggate.com;

    ssl_certificate     /home/pi/.acme.sh/code-server-nanopi-r6s.hackinggate.com_ecc/code-server-nanopi-r6s.hackinggate.com.cer;
    ssl_certificate_key /home/pi/.acme.sh/code-server-nanopi-r6s.hackinggate.com_ecc/code-server-nanopi-r6s.hackinggate.com.key;

    # Basic SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;                                                                                                                                                       

    # Enable HTTP/2 and HTTP/3 support
    http2 on;
    http3 on;
    add_header Alt-Svc 'h3=":8443"; ma=86400' always;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```

### Updating the upper layer Nginx server configuration

I updated `/etc/nginx/nginx.conf` to include the stream configuration:

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

# top-level stream include
include /etc/nginx/stream.conf;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Certificate Issuance

I switched the default ACME CA to Let's Encrypt:

```bash
acme.sh --set-default-ca --server letsencrypt
```

And issued the certificate using TLS-ALPN-01:

```bash
acme.sh --issue -d code-server-nanopi-r6s.hackinggate.com --alpn --tlsport 10443 --nginx
```

### Switching from TLS-ALPN-01 to DNS-01

I later found that TLS-ALPN-01 can't issue certificates for wildcard domains, and configuring Nginx became overwhelming. I decided to switch to DNS-01 challenge.

```bash
CF_Token='' acme.sh --issue -d nanopi-r6s.hackinggate.com -d '*.nanopi-r6s.hackinggate.com' --dns dns_cf
```

To reload Nginx on cert renewal (in a previous step I already removed sudo password requirement for reloading Nginx).

```bash
acme.sh  --install-cert -d code-server-nanopi-r6s.hackinggate.com --reloadcmd "sudo systemctl reload nginx"
```

### Switching from Nginx to HAProxy

Maintaining the `stream` block in Nginx was becoming too complex, so I decided to use HAProxy instead, which has more straightforward configuration for this networking purpose. I set up HAProxy on my Netgear Nighthawk X4S R7800 OpenWrt router.

After upgrading to OpenWrt 24.10.0, I installed HAProxy 3.0.8-1.

<a href="https://downloads.openwrt.org/releases/24.10.0/packages/arm_cortex-a15_neon-vfpv4/packages/">
    <img width="1110" alt="Image" src="/static/images/24.10.0_packages_arm_cortex-a15_neon-vfpv4-haproxy.webp" />
</a>

### Final HAProxy Configuration

The final HAProxy configuration (`haproxy-sni.cfg`) distributes traffic based on SNI:

```
global
    log /dev/log local0
    log /dev/log local1 notice

defaults
    log     global
    option  tcplog
    option  dontlognull
    timeout connect 5s
    timeout client 50s
    timeout client-fin 50s
    timeout server 50s
    timeout tunnel 1h
    default-server inter 15s fastinter 2s downinter 5s rise 3 fall 3

frontend http_front
    bind *:80
    mode http
    # Redirect all HTTP traffic to HTTPS
    http-request redirect scheme https code 301

frontend https_front
    bind *:443
    mode    tcp
    tcp-request inspect-delay 5s
    tcp-request content accept if { req_ssl_hello_type 1 }

    ## exact matches
    use_backend nanopi_back if { req.ssl_sni -m end nanopi-r6s.hackinggate.com }
    use_backend tuf_back if { req.ssl_sni -m end tuf.hackinggate.com }
    use_backend raspberrypi_back if { req.ssl_sni -i swcdn.apple.com }
    use_backend raspberrypi_back if { req.ssl_sni -i xray.hackinggate.com }

    # set default backend
    default_backend tuf_back

# Backend for nanopi-r6s
backend nanopi_back
    mode tcp
    server nanopi 192.168.4.67:443 weight 100 check

# Backend for TUF
backend tuf_back
    mode tcp
    server tuf 192.168.4.51:443 weight 100 check

# Backend for Xray Reality on Raspberry Pi
backend raspberrypi_back
    mode tcp
    server raspberrypi 192.168.4.45:443 weight 100 check
```

### Final Nginx Configuration

Since I don't need to handle TLS-ALPN-01 challenge, nether distrubute traffic by SNI on Nginx. The Nginx configuration became much more eaiser. Just put symbolic links (ln -s) to the path `/etc/nginx/sites-enabled/` and make sure `/etc/nginx/nginx.conf` has the `/etc/nginx/sites-enabled/*` path included.

## End Result and Limitations

The final setup provides:

✅ Multiple web services on a single IP address  
✅ Independent SSL certificate management on each backend  
✅ HTTP/2 support on the load balancer and each backend  
✅ Secure authentication for private services  

However, there are some limitations:

❌ **QUIC (HTTP/3) traffic can't be routed by SNI in the same way** - As explained earlier, QUIC's integrated encryption model means SNI isn't exposed in the same way as with TCP+TLS. To fully support QUIC at the routing level, I would need to terminate SSL at the router.  
❌ **Certificate management is distributed** - Each backend needs to manage its own certificates, which can be more complex to maintain compared to a centralized approach.  

## Understanding QUIC and Its Limitations in This Setup

QUIC (Quick UDP Internet Connections) is a transport‑layer protocol originally developed by Google and later standardized by the IETF as the foundation for HTTP/3. It provides several advantages over TCP‑based TLS for HTTP traffic:

1. **Lower latency**: QUIC can establish connections with fewer round trips.  
2. **Connection migration**: QUIC connections can survive certain network changes (e.g., switching from WiFi to cellular).  
3. **Improved congestion control**: It responds quickly to changes in network conditions.  
4. **No head-of-line blocking**: Multiple streams of data within the same QUIC connection do not block each other.

### Why QUIC Requires SSL/TLS Termination at the Entry Point

Unlike traditional TLS over TCP, QUIC encapsulates the TLS 1.3 handshake within its UDP‑based transport. This leads to a few important differences:

1. **Integrated encryption**: QUIC runs TLS inside its protocol, rather than layering TLS over TCP.  
2. **SNI visibility**:  
   - In traditional TLS over TCP, the Server Name Indication (SNI) is sent as part of the ClientHello and is visible in cleartext—unless Encrypted ClientHello (ECH) is deployed.  
   - In QUIC, even though the SNI is transmitted in the ClientHello (and remains visible if ECH is not used), the protocol’s UDP‑based nature and different handshake structure mean that HAProxy, operating in SSL passthrough mode, cannot simply capture or inspect that SNI information.
3. **Routing constraints**: HAProxy’s typical method for SNI‑based routing in TCP relies on delaying the connection (using directives like `tcp-request inspect-delay`) to capture the cleartext SNI from the TLS ClientHello. Since QUIC’s handshake occurs over UDP and is managed internally by the QUIC protocol, HAProxy is not “QUIC‑aware.” Without terminating the QUIC/TLS session (i.e. acting as a QUIC endpoint), HAProxy cannot parse and extract the SNI to make routing decisions.

### Why QUIC Isn’t Supported in This Final Setup

In this HAProxy configuration, the technique known as “SSL passthrough” (or “TLS passthrough”) is used: HAProxy never terminates TLS; it only inspects the unencrypted SNI in a traditional TCP/TLS handshake to route traffic, while the actual TLS decryption happens on the backend servers.

Because QUIC’s handshake is conducted over UDP and its structure is different from TCP/TLS, HAProxy in passthrough mode cannot extract the SNI without performing full QUIC termination. In other words, even though the SNI is visible in QUIC’s ClientHello when ECH is not used, HAProxy isn’t capable of reading it in its current configuration since it isn’t handling QUIC traffic directly.

This means that without terminating the QUIC/TLS session (i.e. acting as a QUIC endpoint and performing decryption), HAProxy cannot route QUIC connections based on SNI. As a result, the current setup supports only HTTP/2 and TLS 1.3 over TCP—where HAProxy can reliably extract the cleartext SNI (again, assuming ECH is not used) and make routing decisions accordingly. To support QUIC (HTTP/3), HAProxy would need to terminate QUIC/TLS at the edge, manage the decryption, and then forward traffic to the backend servers, which adds significant complexity.
