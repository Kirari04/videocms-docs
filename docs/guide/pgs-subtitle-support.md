# PGS Subtitle Support

This guide explains how to add PGS subtitle support to your VideoCMS instance.

## Overview

PGS (Presentation Graphics Stream) subtitles are image-based subtitles commonly found in Blu-ray discs. VideoCMS can be configured to support these subtitles, allowing for a richer viewing experience.

## Prerequisites

Before you begin, ensure you have:

*   Access to your VideoCMS server.
*   Basic understanding of server configuration.

## Configuration Steps

To enable PGS subtitle support, you need to add an additional service to your `docker-compose.yaml` file and configure VideoCMS.

1.  **Step 1: Add the `pgsplugin` service to `docker-compose.yaml`**

    Open your `docker-compose.yaml` file and add the following service definition under the `services:` section:

    ```yaml
    services:
      pgsplugin:
        image: kirari04/videocms:plugin-pgs
        restart: unless-stopped
        networks:
          - videocmsnet
    ```

    This service will handle the extraction and conversion of PGS subtitles.

2.  **Step 2: Restart your Docker Compose services**

    After modifying `docker-compose.yaml`, restart your services to apply the changes:

    ```bash
    docker compose down
    docker compose up -d
    ```

3.  **Step 3: Configure VideoCMS Plugin Settings**

    Navigate to the VideoCMS settings page (`/my/config`). Under "Plugin Settings", you need to:
    *   Enable "Plugin PGS Server".
    *   Set the "Plugin PGS Server" address to `http://pgsplugin:5000`.

    **Note:** This feature is experimental, and the converted subtitles might not always be the prettiest. However, videos with PGS subtitles can now be extracted and converted to simple SRT subtitles.

## Full `docker-compose.yaml` Example

Here's a complete `docker-compose.yaml` file with the `pgsplugin` service integrated.

```yaml
version: "3.8"
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
  pgsplugin:
    image: kirari04/videocms:plugin-pgs
    restart: unless-stopped
    networks:
      - videocmsnet
networks:
  videocmsnet:
    driver: bridge
volumes:
  caddy_data: {}
```
