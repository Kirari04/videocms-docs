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

## 2. Update Secret Keys

The application uses JWT tokens for session management. You **must** change the secret keys to prevent attackers from forging sessions.

1.  Go to the **Config** page (`/my/config`).
2.  Find **JwtSecretKey**. Generate a long, random string and paste it here.
3.  Find **JwtUploadSecretKey**. Generate another long, random string and paste it here.
4.  **Save** the configuration.
5.  **Restart** the application containers for the changes to take effect.

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
