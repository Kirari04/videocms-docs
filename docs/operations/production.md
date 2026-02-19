---
lang: en-US
title: Production Deployment
description: Deploying VideoCMS in production with Reverse Proxies
---

# Production Deployment


For production environments, it is highly recommended to run VideoCMS behind a reverse proxy to handle SSL termination, compression, and static file serving.

## Reverse Proxy Options

::: tabs
== Caddy (Recommended)
<div id="caddyfile"></div>

Caddy is the easiest way to get running with automatic HTTPS.

### `docker-compose.yaml`

```yaml
services:
  videocms:
    image: kirari04/videocms:beta
    restart: unless-stopped
    volumes:
      - ./videos:/app/videos
      - ./database:/app/database

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

volumes:
  caddy_data: {}
```

### `Caddyfile`

Replace `video.example.com` with your domain.

```caddyfile
video.example.com {
    # Higher body limit for direct uploads (e.g., 5GB)
    request_body {
        max_size 5G
    }
    reverse_proxy videocms:3000
}
```

== Nginx
<div id="option-2-nginx"></div>

If you prefer Nginx, you can use the following configuration. Note that you will need to manage SSL certificates yourself.

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name video.example.com;

    # Global limit (can be small)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Parallel Chunked Uploads (chunks are usually small)
    location /api/pcu/chunck {
        client_max_body_size 100M;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Direct Single-File Uploads (matches MaxUploadFilesize)
    location /api/file/upload {
        client_max_body_size 5G;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
:::

## SSL Certificates

If you are not using Caddy (which handles SSL automatically) or Cloudflare, you must secure your instance with SSL.

1.  **Certbot:** Use `certbot` on your host machine to generate certificates for your domains.
2.  **Mount Certificates:** Mount the certificate files into your Nginx container and update the Nginx config to listen on port 443 and use the certificates.

---

## Mandatory Post-Deployment Security

Deploying the containers is only the first step. You **must** perform these actions immediately after your first login to ensure your server is not compromised.

### 1. Change Secret Keys
By default, the application might use insecure or placeholder keys for signing session tokens.
- Navigate to **Settings** (`/my/config`).
- Change `JwtSecretKey` and `JwtUploadSecretKey` to long, random strings.
- **Restart the containers** after saving.

### 2. Trust Reverse Proxy (IP Identification)
To ensure VideoCMS correctly identifies the visitor's IP address (important for logs and rate-limiting), you must enable **TrustLocalTraffic** in the settings.
- Navigate to **Settings** (`/my/config`).
- Set `TrustLocalTraffic` to `true`.
- Without this, all users will appear to have the internal IP of your Caddy/Nginx container.

### 3. Change Admin Password
The default admin credentials (`admin` / `12345678`) are public knowledge. Change them immediately upon your first login.

---

For a comprehensive list of security measures, including firewall configuration and secret key management, please refer to the [Post-Installation Security](./security.md) guide.

