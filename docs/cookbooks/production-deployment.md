---
lang: en-US
title: Production Deployment
description: Deploying VideoCMS in production with Reverse Proxies
---

# Production Deployment

[[toc]]

For production environments, it is highly recommended to run VideoCMS behind a reverse proxy to handle SSL termination, compression, and static file serving.

## Option 1: Caddy (Recommended)

Caddy is the easiest way to get running with automatic HTTPS.

### `docker-compose.yaml`

```yaml
services:
  api:
    image: kirari04/videocms:alpha
    restart: unless-stopped
    networks:
      - videocmsnet
    volumes:
      - ./videos:/app/videos
      - ./database:/app/database

  panel:
    image: kirari04/videocms:panel
    restart: unless-stopped
    networks:
      - videocmsnet
    environment:
      - NUXT_PUBLIC_API_URL=https://api-player.example.com/api
      - NUXT_PUBLIC_BASE_URL=https://api-player.example.com
      - NUXT_PUBLIC_NAME=VideoCMS

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    networks:
      - videocmsnet

networks:
  videocmsnet:
    driver: bridge

volumes:
  caddy_data: {}
```

### `Caddyfile`

Replace `player.example.com` and `api-player.example.com` with your domains.

```caddy
player.example.com {
    reverse_proxy panel:3000
}

api-player.example.com {
    reverse_proxy api:8080
}
```

## Option 2: Nginx

If you prefer Nginx, you can use the following configuration. Note that you will need to manage SSL certificates yourself (e.g., using Certbot) or use a separate container like `nginx-proxy` or `traefik`.

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name player.example.com;

    location / {
        proxy_pass http://localhost:3000; # Points to the Panel container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api-player.example.com;

    client_max_body_size 10G; # Important for large video uploads

    location / {
        proxy_pass http://localhost:8080; # Points to the API container
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
