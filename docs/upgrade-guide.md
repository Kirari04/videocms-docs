---
lang: en-US
title: Upgrade Guide
description: How to safely upgrade VideoCMS to the latest version.
---

# Upgrade Guide

[[toc]]

VideoCMS is designed to be easily upgradable using Docker.

## Versioning Strategy

Currently, we recommend tracking the `:alpha` tag for the latest features and fixes.

```yaml
services:
  api:
    image: kirari04/videocms:alpha
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
