---
lang: en-US
title: Upgrade Guide
description: How to safely upgrade VideoCMS to the latest version.
---

# Upgrade Guide


VideoCMS is designed to be easily upgradable using Docker.

## Migrating from Alpha to Beta

**Important:** The Beta release introduces a significant architectural simplification. The separate frontend container (`panel`) has been merged into the main backend container (`api`), now simply called `videocms`.

**Changes Required:**

1.  **Update Image:** Change `kirari04/videocms:alpha` to `kirari04/videocms:beta`.
2.  **Remove Panel Service:** Delete the `panel` service block from your `docker-compose.yaml`.
3.  **Update Ports:** The new container listens on port `3000` (previously the API was on `8080`). Update your port mapping to `3000:3000`.
4.  **Single Domain:** You no longer need separate domains for API and Panel. Everything is served from the same origin.

**Example `docker-compose.yaml` (New):**

```yaml
services:
  videocms:
    image: kirari04/videocms:beta
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./videos:/app/videos
      - ./database:/app/database
```

## Versioning Strategy

Currently, we recommend tracking the `:beta` tag for the latest features and fixes.

```yaml
services:
  videocms:
    image: kirari04/videocms:beta
    # ...
```

## How to Upgrade

The upgrade process involves pulling the new image and restarting the containers.

### 0. Check for Updates
You can see if a new version is available directly in your **Admin Dashboard** under the **System Analytics** section. A warning will appear if your current version is outdated.

### 1. Backup (Recommended)
Before performing any update, it is good practice to backup your database.

```bash
# Copy the database file to a backup location
cp database/database.sqlite database/database.sqlite.bak
```

### 2. Pull the latest image
Download the newest version of the software.

```bash
docker compose pull
```

### 3. Restart Containers
This stop and start cycle ensures that the new binary is loaded.

```bash
docker compose down
docker compose up -d
```

## Database Migrations

**Do I need to run manual migrations?**
**No.**

VideoCMS automatically checks and updates the database schema every time it starts up. The system uses GORM's `AutoMigrate` feature to ensure your database structure matches the code.

> **Note:** If a major breaking change ever requires manual intervention, it will be prominently listed in the Release Notes.
