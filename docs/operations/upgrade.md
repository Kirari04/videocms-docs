---
lang: en-US
title: Upgrade Guide
description: How to safely upgrade VideoCMS to the latest version.
---

# Upgrade Guide

VideoCMS is designed to be easily upgradable using Docker. We currently recommend tracking the `:beta` tag for the latest features and fixes.

## Migrating from v0.0.9

If you are still running v0.0.9 (Alpha), which used separate `api` and `panel` containers, please follow our [v0.0.9 to v0.1.0 Migration Guide](./migration-alpha-beta.md) before proceeding with standard upgrades.

## Upgrading from v0.1.11 to v0.1.12

v0.1.12 introduces provider-neutral storage, S3-compatible and SFTP mounts, upload pools, resumable storage migrations, optional read-through caches, and the unified background-job runtime. The database upgrade is automatic and existing local media stays in place.

Before upgrading:

1. Stop VideoCMS and back up the database, local media, deployment files, and any configured remote media. See [Backup & Restore](./backup-restore.md).
2. If remote storage is already configured in a pre-release installation, preserve `StorageEncryptionKey` with the backup. The database cannot decrypt saved mount credentials without the same key.
3. Confirm that `StorageScratchDir` has enough temporary space for the largest source or rendition that FFmpeg may materialize from remote storage. Its default is `./videos/scratch` inside the existing videos volume.
4. Remove any explicit Docker volume mapping for `/app/public`. Packaged frontend assets belong to the image and persisting that directory can serve files from an older release after an upgrade.

On the first start, run only one VideoCMS instance until startup completes. VideoCMS creates and backfills the storage and background-job tables, registers the existing media directory as the built-in `local` mount, creates the local default pool, and imports active or recent legacy work into the durable job history. The migration can resume safely if startup is interrupted.

After startup:

- open **Administration → Background jobs** and confirm that the runtime and queues are healthy;
- open **Administration → Storage** and confirm that the built-in local mount and pool are healthy;
- play an existing video and verify a representative upload or encode before adding remote storage; and
- configure `StorageEncryptionKey` before saving the first S3-compatible or SFTP mount. Local-only installations do not need this variable.

## Standard Upgrade Process

The upgrade process involves pulling the new image and restarting the containers.

### 1. Check for Updates
You can see if a new version is available directly in your **Admin Dashboard** under the **System Analytics** section. A notification will appear if your current version is outdated.

### 2. Backup
Before performing any update, stop VideoCMS and back up your database. SQLite uses WAL mode, so copying only the main database file while the application is running can produce an inconsistent backup.

```bash
docker compose stop videocms
cp -a database "database_backup_$(date +%F)"
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

The v0.1.11 persistent download-jobs release automatically creates `download_jobs` and adds a traffic source column. Existing traffic is classified as player traffic because historical attachment downloads cannot be separated retroactively.

The old synchronous `/:UUID/:QUALITY/download/:FILE` attachment endpoint has been removed. Integrations must use the create/status/file download-job flow documented in the [API reference](../reference/api.md). The progressive MP4 player endpoint is unchanged.

### Storage mounts and pools

The storage-pools release is also automatic. On first start, VideoCMS creates the new storage tables, registers the existing media directory as the built-in `local` mount, creates a local upload pool, and assigns legacy file records to local storage. Existing media stays in place and does not need to be moved or re-uploaded.

The only operator setup is for optional remote storage: configure `StorageEncryptionKey` before saving an S3-compatible or SFTP mount. Instances that continue using only local storage need no new environment variable. See [Storage Pools](./storage.md) for setup and migration details.

If a major breaking change ever requires manual intervention, it will be prominently listed in the [Changelog](../development/changelog.md).
