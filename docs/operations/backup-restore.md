---
lang: en-US
title: Backup & Restore
description: Data identification and requirements for VideoCMS backups
---

# Backup & Restore

To maintain a reliable VideoCMS instance, you must ensure that all stateful data is regularly backed up. This page identifies the specific directories and files that contain your unique data and provides recommendations for modern backup tools.

## Data to Backup

A complete backup of a VideoCMS instance must include the database, the processed media, and the environment configuration.

### 1. Database (`./database`)
The database contains all application metadata, including user accounts, video registration, folder structures, and system settings.

*   **SQLite WAL Mode:** VideoCMS uses SQLite in Write-Ahead Logging (WAL) mode. This means that data is frequently written to temporary `-wal` and `-shm` files before being merged into the main `.db` file.
*   **Backup Requirement:** To ensure a consistent and non-corrupt database backup, **the VideoCMS application should be stopped** before the database files are copied. This ensures all pending transactions are flushed to disk.

### 2. Media Assets (`./videos`)
This directory houses all binary data related to your videos.

*   **Processed Content (`qualitys/`):** All transcoded HLS segments, thumbnails, and subtitle files are stored here, organized by video UUID. **This is the most critical media directory to backup**, as it contains the files served to your users.
*   **Temporary Data (`uploads/`):** This directory is used as a temporary staging area for chunked uploads and file assembly. Once a video is fully processed, its source files are removed. **Backing up the `uploads/` directory is not required.**

### 3. Configuration & Infrastructure
The following files define your environment and should be included in your backup:
*   **`docker-compose.yaml`**: Defines your service and volume definitions.
*   **`.env`**: (Optional) If you have a customized setup using an environment file for additional configuration.
*   **`Caddyfile`**: (Optional) Your reverse proxy and SSL configuration if you are using Caddy.

---

## Recommended Backup Tools

Using a dedicated backup solution is preferred over simple file copies, as they provide essential features like deduplication, encryption, and point-in-time recovery.

### [Restic](https://restic.net/)
A fast, efficient, and secure CLI-based backup program. 
*   **Deduplication:** Only stores unique data, which is highly efficient for media libraries.
*   **Security:** Native encryption for all data at rest.
*   **Versatility:** Supports local storage, S3, SFTP, and various cloud providers.

### [Backrest](https://github.com/garethgeorge/backrest)
A modern Web UI and orchestration layer for Restic.
*   **Management:** Provides a clean interface for managing multiple Restic repositories.
*   **Scheduling:** Integrated task runner for automated backups and retention policies.
*   **Monitoring:** Dashboard for verifying backup success and health.

### [Duplicati](https://www.duplicati.com/)
A user-friendly, web-based backup client designed for cloud environments.
*   **Ease of Use:** Fully managed via a web interface.
*   **Efficiency:** Uses block-based incremental backups to minimize bandwidth and storage.
*   **Compatibility:** Supports a vast range of standard protocols and cloud storage backends.
