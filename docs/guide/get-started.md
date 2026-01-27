---
lang: en-US
title: Get Started
description: Getting started with VideoCMS locally
---

# Get Started

[[toc]]

This guide will help you set up VideoCMS on your local machine for testing and development.

> **Production Setup:** If you are deploying to a public server with a domain name and SSL, please check our [Production Deployment Cookbook](../cookbooks/production-deployment.md).

## System Requirements

VideoCMS is designed to be lightweight, but video encoding is resource-intensive.

-   **RAM:**
    -   **Panel (Frontend):** Uses ~128MB RAM (Bun runtime).
    -   **API (Backend):** Uses minimal RAM (<50MB) when idle.
    -   **Encoding:** This is the main consumer. Each concurrent ffmpeg process can use significant RAM depending on the video resolution.
    -   **Minimum Recommendation:** 2GB RAM (for 1 concurrent encode).
    -   **Recommended:** 4GB+ RAM (for multiple concurrent encodes).

-   **CPU:**
    -   Encoding is CPU-bound. More cores = faster processing.
    -   **Minimum:** 2 vCPUs.
    -   **Recommended:** 4+ vCPUs for a smooth experience.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Setup

1.  **Create a directory for your VideoCMS installation:**

    ```sh
    mkdir videocms
    cd videocms
    ```

2.  **Create a `docker-compose.yaml` file:**

    Create a file named `docker-compose.yaml` with the following content.

    ```yaml
    services:
      api:
        image: kirari04/videocms:alpha
        restart: unless-stopped
        ports:
          - "8080:8080"
        networks:
          - videocmsnet
        volumes:
          - ./videos:/app/videos
          - ./database:/app/database

      panel:
        image: kirari04/videocms:panel
        restart: unless-stopped
        ports:
          - "3000:3000"
        networks:
          - videocmsnet
        environment:
          - NUXT_PUBLIC_API_URL=http://localhost:8080/api
          - NUXT_PUBLIC_BASE_URL=http://localhost:8080
          - NUXT_PUBLIC_NAME=VideoCMS

    networks:
      videocmsnet:
        driver: bridge
    ```

3.  **Start the application:**

    Run the following command to start all services.

    ```sh
    docker compose up -d
    ```

## Initial Configuration

On the first startup, a default user with the username `admin` and the password `12345678` is created.

1.  Open your browser and navigate to `http://localhost:3000/login`.
2.  Login with the default credentials:
    -   Username: `admin`
    -   Password: `12345678`

3.  Navigate to the Config Page at `http://localhost:3000/my/config`.

4.  **Important:** Replace the Value of `BaseUrl` with `http://localhost:8080`.

5.  Make sure to save the changes using the **save button** at the bottom of the page.

6.  Restart the containers to apply the configuration changes:

    ```sh
    docker compose down
    docker compose up -d
    ```

## Next Steps

-   **Upload a Video:** Go to `http://localhost:3000/my/videos` to upload your first video.
-   **Secure your Instance:** Read the [Security Cookbook](../cookbooks/security.md) to change default passwords and keys.
-   **Deploy to Production:** Ready to go live? See [Production Deployment](../cookbooks/production-deployment.md).