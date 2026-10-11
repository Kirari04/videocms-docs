---
lang: en-US
title: Post-Installation Security
description: Securing your VideoCMS instance
---

# Post-Installation Security


After installing VideoCMS, it is critical to secure your instance before opening it to the public.

## 1. Change Default Credentials

The default admin account is created with known credentials.

1.  Log in as the default admin (`admin` / `12345678`).
2.  Go to **Users** (or Account Settings).
3.  Change the password for the `admin` user immediately.
4.  Alternatively, create a new admin user with a secure password and delete the default `admin` user.

## 2. Signing Keys and Sessions

VideoCMS generates independent cryptographically random signing keys for authentication and media playback. Keys stay on the server and are not returned by the settings API. Upgrading automatically replaces the two known predictable defaults from older installations; this signs out affected sessions and resets playback cookies. Custom signing keys remain unchanged.

To rotate both keys deliberately, open **Config → Security**, select **Rotate signing keys**, and confirm. The change takes effect immediately, signs everyone out, and resets active playback sessions. Ordinary configuration saves do not rotate keys.

**Log out** revokes that browser's session on the server, including refreshed tokens from the same session. Other sessions and API keys remain valid. Existing seven-day session expiry and automatic refresh behavior are preserved; password or role changes still revoke all of an account's sessions.

Captcha secret fields are write-only: a blank field keeps the saved value, and entering a replacement updates it. Public site keys remain visible.

## Public Video Links

Videos are public by default and shared through unlisted, random UUID links. Anyone who has a player link can watch the video without a VideoCMS account, subject to the instance's player captcha settings. Player, status, download-selection and thumbnail URLs follow this public-link model. Media cookies authorize the renditions, audio, subtitles and downloads belonging to that link; they are playback capabilities, not private account permissions.

Treat the full link as shareable access to the video. Deleting a link removes its public entry point. The library and editing APIs still require account authentication and enforce ownership.

## 3. Disable Debug/Dev Modes

Ensure that development features are disabled in production.

1.  **Trust Local Traffic**: Set to `true` if you are using a reverse proxy (Caddy, Nginx, Cloudflare). This allows VideoCMS to trust the `X-Forwarded-For` headers and see the user's real IP instead of the proxy's internal IP.

## 4. Firewall & Docker Caveats

By default, **Docker bypasses UFW** by manipulating `iptables` directly. If you expose a port in your `docker-compose.yaml` (e.g., `ports: - "3000:3000"`), it will be accessible from the internet even if UFW is active.

-   **Recommendation:** Only expose ports 80 and 443 for your reverse proxy (Caddy/Nginx).
-   **Internal Services:** If you must expose the VideoCMS port to the host machine for an external Nginx setup, bind it to `127.0.0.1` so it is not accessible from the outside:
    ```yaml
    services:
      videocms:
        ports:
          - "127.0.0.1:3000:3000" # Accessible only from the host
    ```

### UFW Setup
Even if Docker bypasses it for exposed ports, a firewall is still essential for protecting other services (like SSH).

```bash
# Allow SSH
ufw allow ssh
# Allow Web Traffic
ufw allow http
ufw allow https
# Enable Firewall
ufw enable
```

## 5. Rate Limiting

Enable rate limiting to protect your API from abuse.

1.  Set **RatelimitEnabled** to `true`.
2.  Review the `RatelimitRate...` and `RatelimitBurst...` settings. The defaults are generally safe, but you may want to tune them based on your expected traffic.

## 5. Captcha

To prevent bot spam on logins and uploads, configure a Captcha service.

1.  Register for **reCAPTCHA**, **hCaptcha**, or **Turnstile**.
2.  Enter your **Site Key** (Public Key) and **Secret Key** (Private Key) in the VideoCMS config.
3.  Enable **CaptchaEnabled** and specifically **CaptchaLoginEnabled**.
