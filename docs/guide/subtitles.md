---
lang: en-US
title: PGS Subtitle Support
description: PGS Subtitle Support on VideoCMS
---

# PGS Subtitle Support


This guide provides a step-by-step walkthrough for enabling **PGS (Presentation Graphics Stream)** subtitle support in your VideoCMS instance.

## What are PGS Subtitles?

PGS subtitles are an **image-based subtitle format** commonly found on Blu-ray discs. Unlike text-based subtitles (like SRT), each PGS subtitle is a picture. Enabling this feature allows VideoCMS to automatically extract these image-based subtitles, convert them into the text-based SRT format, and display them on your videos.

---

## Prerequisites

Before you start, make sure you have the following:

* **Server Access:** You'll need access to the server where your VideoCMS instance is running.
* **Docker Knowledge:** A basic understanding of how to use Docker and modify a `docker-compose.yaml` file is necessary.

---

## Configuration Steps

Enabling PGS support involves adding a new service to your Docker Compose setup and then configuring it within the VideoCMS admin panel.

### Step 1: Add the PGS Plugin Service

First, you need to add the `pgsplugin` service to your `docker-compose.yaml` file. This service is a dedicated container that handles the subtitle extraction and conversion process.

Open your `docker-compose.yaml` and add the following under the `services:` section:

```yaml
services:
  # ... your other services like api, panel, caddy ...

  pgsplugin:
    image: kirari04/videocms:plugin-pgs
    restart: unless-stopped
    networks:
      - videocmsnet
```

### Step 2: Restart Docker Compose

After saving your changes to the `docker-compose.yaml` file, you must restart your services for the new container to be created and started.

Run the following commands in your terminal:

```bash
# Shut down the existing containers
docker compose down

# Start all services, including the new pgsplugin
docker compose up -d
```

### Step 3: Configure the Plugin in VideoCMS

Now that the service is running, you need to tell VideoCMS how to communicate with it.

1.  Navigate to your VideoCMS settings page (usually at `/my/config`).
2.  Find the **"Plugin Settings"** section.
3.  Enable the **"Plugin PGS Server"** option (this is likely a checkbox).
4.  Set the **"Plugin PGS Server" address** to: `http://pgsplugin:5000`

> ### Experimental Feature Notice
> Please be aware that this is an **experimental feature**. While it enables videos with PGS subtitles to be processed, the resulting SRT conversion may not always be perfectly formatted or styled.

---

## Full `docker-compose.yaml` Example

For clarity, here is a complete `docker-compose.yaml` file that includes the `pgsplugin` service.

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

  # This is the new service for handling PGS subtitles
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

## See Also

- [Configuration Reference](../reference/configuration.md) - For more details on plugin configuration.