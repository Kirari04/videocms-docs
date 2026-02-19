---
lang: en-US
title: Cloudflare Setup
description: Running VideoCMS behind Cloudflare
---

# Cloudflare Setup


Cloudflare provides excellent protection and performance benefits. Here is how to configure VideoCMS to work correctly behind Cloudflare.

## 1. DNS Configuration

1.  Log in to your Cloudflare dashboard.
2.  Go to **DNS**.
3.  Create an `A` record (or `CNAME` record) for your domain:
    -   `video.example.com` -> Your Server IP
4.  Ensure the **Proxy status** is set to **Proxied** (Orange Cloud).

## 2. SSL/TLS Settings

1.  Go to **SSL/TLS** > **Overview**.
2.  Set the encryption mode to **Full** or **Full (strict)**.
    -   **Full:** Encrypts end-to-end, but allows self-signed certificates on your server.
    -   **Full (strict):** Requires a valid trusted certificate on your server (e.g., Let's Encrypt or Cloudflare Origin CA).

## 3. VideoCMS Configuration

You need to tell VideoCMS to trust the headers sent by Cloudflare so that it correctly identifies the client's IP address and protocol (HTTPS).

1.  Navigate to your VideoCMS config page (`/my/config`).
2.  Enable **Cloudflare Enabled**: Set to `true`.
3.  **Trusted Proxies**: If necessary, you can specify Cloudflare's IP ranges, but enabling the specific Cloudflare setting usually handles the standard headers.

## 4. Increase Upload Limits

Cloudflare's plan has limits on upload body sizes (e.g., 100MB on the **Free** plan). 

### PCU Upload (Recommended)
VideoCMS uses **Parallel Chunked Upload (PCU)** to bypass this limitation for most dashboard uploads. 
1. **Max Upload Chuncksize**: Set this to something smaller than 100MB (e.g., `50000000` for 50MB) in your VideoCMS config.
2. This ensures that large video files are split into small chunks that Cloudflare accepts.

### Direct API Upload (/api/file/upload)
If you use the direct single-file upload route (`/api/file/upload`), you **MUST** be aware of Cloudflare's limits:
- **Free Plan**: 100MB max per request.
- **Pro/Business Plan**: Up to 500MB max.
- **Enterprise Plan**: Custom limits.

If your files exceed 100MB and you are on the Free plan, the direct upload via `/api/file/upload` will return a `413 Request Entity Too Large` error from Cloudflare. In this case, either use the chunked upload API or bypass the proxy for a dedicated upload subdomain (e.g., `uploads.example.com` with Gray Cloud/No Proxy).
