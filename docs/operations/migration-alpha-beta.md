---
lang: en-US
title: v0.0.9 to v0.1.0 Migration
description: Detailed steps for transitioning from VideoCMS v0.0.9 (Alpha) to v0.1.0 (Beta).
---

# v0.0.9 to v0.1.0 Migration

VideoCMS has officially transitioned to its **Beta** phase with the release of **v0.1.0**. This update introduces a significant architectural simplification: the separate frontend container (`panel`) has been merged into the main backend container (`api`), which is now unified as `videocms`.

## Major Changes

1.  **Unified Container:** Everything (Frontend + Backend) is served from a single image: `kirari04/videocms:beta` (starting from v0.1.0).
2.  **Simplified Ports:** The unified service listens on port `3000` by default.
3.  **Single Origin:** You no longer need separate domains/URLs for the API and the Panel. Everything is served from the same `BaseUrl`.

## Migration Steps

Follow these steps to update your `docker-compose.yaml` from the v0.0.9 setup to the v0.1.0 setup.

### 1. Update the Service Definition
Change the image tag from `:alpha` (v0.0.9) to `:beta` (v0.1.0).

### 2. Consolidate Port Mappings
Ensure your unified service is accessible. If you previously had the API and Panel on different ports, you now only need one mapping (default `3000:3000`).

### 3. Remove the Panel Service
Delete the entire `panel` service block from your `docker-compose.yaml`. It is no longer needed in v0.1.0.

### 4. Migration Diff

Below is a visualization of the essential changes required in your `docker-compose.yaml`.

```diff
 services:
-  api:
-    image: kirari04/videocms:alpha
+  videocms:
+    image: kirari04/videocms:beta
     restart: unless-stopped
     ports:
       - 3000:3000
     volumes:
       - ./videos:/app/videos
       - ./database:/app/database
 
-  panel:
-    image: kirari04/videocms:panel
-    restart: unless-stopped
-    ports:
-      - 3001:3000
-    environment:
-      - NUXT_PUBLIC_API_URL=${API_URL}
-      - NUXT_PUBLIC_BASE_URL=${BASE_URL}
```

### 5. Apply Changes
Restart your environment to pull the new image and apply the configuration.

```bash
docker compose down
docker compose up -d
```

### 6. Update Configuration
Once the system is running, log in to your dashboard and navigate to the **Config** page.
*   Ensure the `BaseUrl` is correct (it should point to the domain/IP where port 3000 is exposed).
*   Save changes and restart the container if necessary.

## Troubleshooting

*   **Port Conflicts:** Ensure no other service is using port `3000`.
*   **Reverse Proxy:** If you use Caddy or Nginx, update your proxy rules to point all traffic (API and UI) to the single `videocms` container on port `3000`. Updated Reverse Proxy examples can be found in the Production guide:
    *   [Caddyfile Configuration](./production.md#caddyfile)
    *   [Nginx Configuration](./production.md#option-2-nginx)
