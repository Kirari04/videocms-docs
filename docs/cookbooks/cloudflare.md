---
lang: en-US
title: Cloudflare Setup
description: Running VideoCMS behind Cloudflare
---

# Cloudflare Setup

[[toc]]

Cloudflare provides excellent protection and performance benefits. Here is how to configure VideoCMS to work correctly behind Cloudflare.

## 1. DNS Configuration

1.  Log in to your Cloudflare dashboard.
2.  Go to **DNS**.
3.  Create two `A` records (or `CNAME` records) for your domains:
    -   `player.example.com` -> Your Server IP
    -   `api-player.example.com` -> Your Server IP
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

Cloudflare's free plan has a limit on upload body sizes (100MB). VideoCMS uses chunked uploads to bypass this limitation for files, but you should ensure:

1.  **Max Upload Chuncksize**: Set this to something smaller than 100MB (e.g., `50000000` for 50MB) in your VideoCMS config.
2.  This ensures that large video files are split into small chunks that Cloudflare accepts.
