---
lang: en-US
title: Backup & Restore
description: How to backup and restore your VideoCMS instance
---

# Backup & Restore

[[toc]]

VideoCMS stores its state in two places:
1.  **Database:** A SQLite file containing users, video metadata, and settings.
2.  **File System:** The actual video files, thumbnails, and subtitles.

To fully backup your instance, you need to preserve both.

## Backup

### 1. Database Backup
The database is located at `./database/database.db` (mapped to `/app/database/database.db` inside the container).

**Option A: Hot Backup (Recommended)**
You can copy the database file while the container is running, but for absolute consistency, it's better to briefly stop the container or use the sqlite3 CLI.

```bash
# Simple copy
cp -r ./database/database.db ./backups/database_$(date +%F).db
```

### 2. Media Backup
The media files are stored in the `./videos` directory. This includes:
-   `uploads/`: Raw uploaded files.
-   `qualitys/`: Transcoded HLS streams, thumbnails, and subtitles.

```bash
# Using rsync to backup to a separate location
rsync -av ./videos/ /path/to/backup/location/videos/
```

### Automated Backup Script
Here is a simple script you can run via `cron` to automate backups.

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%F_%H-%M)

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup Database
cp ./database/database.db "$BACKUP_DIR/$DATE/database.db"

# Backup Config (if you have a .env or customized docker-compose)
cp docker-compose.yaml "$BACKUP_DIR/$DATE/"
# cp .env "$BACKUP_DIR/$DATE/"

# Backup Videos (Optional: if this is huge, you might want to use incremental backups or snapshots)
# rsync -a ./videos "$BACKUP_DIR/$DATE/videos"

# Compress
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

echo "Backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
```

## Restore

To restore your instance from a backup:

1.  **Stop the containers:**
    ```bash
    docker compose down
    ```

2.  **Restore the database:**
    Replace the existing `database/database.db` with your backup file.

3.  **Restore the media:**
    Copy your backed-up `videos` folder back to the project directory.

4.  **Start the containers:**
    ```bash
    docker compose up -d
    ```
