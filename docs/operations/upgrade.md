---
lang: en-US
title: Upgrade Guide
description: How to safely upgrade VideoCMS to the latest version.
---

# Upgrade Guide

VideoCMS is designed to be easily upgradable using Docker. We currently recommend tracking the `:beta` tag for the latest features and fixes.

## Migrating from v0.0.9

If you are still running v0.0.9 (Alpha), which used separate `api` and `panel` containers, please follow our [v0.0.9 to v0.1.0 Migration Guide](./migration-alpha-beta.md) before proceeding with standard upgrades.

## Standard Upgrade Process

The upgrade process involves pulling the new image and restarting the containers.

### 1. Check for Updates
You can see if a new version is available directly in your **Admin Dashboard** under the **System Analytics** section. A notification will appear if your current version is outdated.

### 2. Backup
Before performing any update, it is highly recommended to backup your database.

```bash
# Example: simple copy of the database folder
cp -r database database_backup_$(date +%F)
```
See our [Backup & Restore Guide](./backup-restore.md) for more details.

### 3. Pull and Restart
Download the newest version of the software and restart the service.

```bash
docker compose pull
docker compose up -d
```

> **Note:** `docker compose up -d` will automatically recreate the container only if a new image was pulled.

## Database Migrations

**Do I need to run manual migrations?**
**No.**

VideoCMS automatically checks and updates the database schema every time it starts up using GORM's `AutoMigrate` feature.

If a major breaking change ever requires manual intervention, it will be prominently listed in the [Changelog](../development/changelog.md).
