---
lang: en-US
title: Production Deployment
description: Deploying VideoCMS in production with Reverse Proxies
---

# Production Deployment


For production environments, it is highly recommended to run VideoCMS behind a reverse proxy to handle SSL termination, compression, and static file serving.

## Option 1: Caddy (Recommended)

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

```caddy
video.example.com {
    reverse_proxy videocms:3000
}
```

## Option 2: Nginx

If you prefer Nginx, you can use the following configuration. Note that you will need to manage SSL certificates yourself (e.g., using Certbot) or use a separate container like `nginx-proxy` or `traefik`.

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name video.example.com;

    client_max_body_size 10M; # Default limit for standard requests

    location / {
        proxy_pass http://localhost:3000; # Points to the VideoCMS container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase limit specifically for chunk uploads
    location /api/pcu/chunck {
        client_max_body_size 100M; # Must be larger than 'MaxUploadChuncksize' (default 20MB)
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificates

If you are not using Caddy (which handles SSL automatically) or Cloudflare, you must secure your instance with SSL.

1.  **Certbot:** Use `certbot` on your host machine to generate certificates for your domains.
2.  **Mount Certificates:** Mount the certificate files into your Nginx container and update the Nginx config to listen on port 443 and use the certificates.
