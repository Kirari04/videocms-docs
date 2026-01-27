---
lang: en-US
title: Architecture
description: Under the hood of VideoCMS - Encoding pipeline and Storage structure.
---

# Architecture & "Under the Hood"

[[toc]]

Understanding how VideoCMS processes and stores files is crucial for debugging, scaling, and managing storage.

## The Transcoding Pipeline

VideoCMS uses a prioritized queue system to handle video processing. This ensures that essential components (like audio and subtitles) are ready before the heavy video encoding begins.

### 1. Upload & Assembly
1.  **Chunked Upload:** The frontend splits the file into chunks (default 20MB) and uploads them sequentially to `./videos/uploads/{session_id}/`.
2.  **Assembly:** Once all chunks are received, they are concatenated into a single file (`example.mkv`).
3.  **Validation:** `ffprobe` checks the file for valid video streams, resolution (50px - 8000px), and duration.
4.  **Hashing:** A SHA256 hash is generated to detect duplicate files. If a duplicate is found, the new upload acts as a "symlink" to the existing file (Database-level cloning), saving storage space.
5.  **Final Move:** The valid file is renamed to `./videos/uploads/{uuid}.tmp` and registered in the database.

### 2. The Worker Loop
The backend runs a background service (`services/Encoder.go`) that wakes up every 10 seconds to look for pending tasks. It processes them in this specific order:

1.  **Subtitles (Priority 1):**
    *   Extracts embedded subtitles from the source file.
    *   Converts them to `.vtt` (WebVTT) or `.ass` (Advanced Substation Alpha).
    *   *Note:* Image-based subtitles (PGS) are sent to an external plugin for OCR if enabled.

2.  **Audio (Priority 2):**
    *   Extracts audio tracks.
    *   Converts them to HLS Segmented Audio (`.m3u8` + `.ts` segments).
    *   Stereo, 5.1, and 7.1 layouts are supported.

3.  **Video / Qualities (Priority 3):**
    *   Transcodes the video into the resolutions defined in your settings (1080p, 720p, etc.).
    *   Uses **HLS (HTTP Live Streaming)** with `libx264`.
    *   **Settings:** 4-second segments, Closed GOP, YUV420p.

## Storage Structure

VideoCMS uses a flat-folder structure where the **Video UUID** is the root folder for that asset.

### `./videos` Directory
This is the main storage volume. You should **never** manually delete files here unless you know what you are doing, as it will break database references.

```text
./videos/
├── uploads/                  # Temporary staging area for raw uploads
│   ├── {session_uuid}/       # Active upload session chunks
│   └── {file_uuid}.tmp       # The ORIGINAL raw uploaded video (Source)
│
├── {video_uuid}/             # The processed video folder (HLS assets)
│   ├── {quality_name}/       # e.g., "1080p", "720p"
│   │   ├── index.m3u8        # Playlist for this specific quality
│   │   ├── segment0.ts       # Video segment 0
│   │   └── segment1.ts       # Video segment 1...
│   │
│   ├── {audio_uuid}/         # Audio Track 1
│   │   ├── index.m3u8
│   │   └── segment0.ts
│   │
│   └── {subtitle_uuid}/      # Subtitle Track 1
│       └── subtitle.vtt      # The subtitle file
```

### Where is `master.m3u8`?
You won't find a `master.m3u8` file on the disk. VideoCMS generates the Master Playlist **dynamically** on the fly when a user requests it.

This allows the server to:
1.  Instantly enable/disable specific qualities without re-writing files.
2.  Serve different audio tracks based on user language preferences.
3.  Inject authentication tokens (`?jwt=...`) into the stream URLs for security.

## Database Flow

VideoCMS uses **SQLite** in WAL (Write-Ahead Logging) mode.

*   **`files` table:** Stores metadata about the physical file (Hash, Path, Duration).
*   **`links` table:** Represents the "User's View" of a file. Multiple users can have different `links` pointing to the same `file` (Deduplication).
*   **`qualities`, `audios`, `subtitles`:** Store the status (`Ready`, `Encoding`, `Failed`) of each asset.

## Scaling Implications

*   **CPU:** The "Worker Loop" is CPU-intensive. Since it runs inside the API binary, scaling the API horizontally (multiple replicas) requires a shared filesystem (NFS) for `./videos` and a shared database, which SQLite does not support well across networks.
*   **Storage:** Since the structure is flat file-based, you can easily mount `./videos` to a large HDD array or use `rclone` (see Cookbooks) to mount S3 buckets.
