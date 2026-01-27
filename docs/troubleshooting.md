---
lang: en-US
title: Troubleshooting
description: Common issues and solutions for VideoCMS.
---

# Troubleshooting

[[toc]]

This guide lists common problems you might encounter while running VideoCMS and how to solve them.

## Where are the logs?

First, always check the logs. They provide the exact error message coming from the backend or ffmpeg.

```bash
# View logs for the main service
docker compose logs -f videocms
```

## Upload Issues

### Upload stuck at 0% or "Network Error"
*   **Cause:** Your reverse proxy (Nginx/Cloudflare) might be blocking the request body.
*   **Solution:**
    *   **Nginx:** Ensure `client_max_body_size` is larger than your **Chunk Size** (default 20MB). We recommend setting it to `50M` or higher.
    *   **Cloudflare:** Free accounts limit upload bodies to 100MB. Ensure your `MaxUploadChuncksize` in the VideoCMS config is set to `50000000` (50MB) or less.
*   **Cause:** CORS issues if `BaseUrl` is not set correctly.
*   **Solution:** Check your browser's dev tools (Console/Network tab). If you see CORS errors, ensure the admin panel `BaseUrl` matches your public domain.

### "Exceeded max upload sessions"
*   **Cause:** Too many users are uploading at once, or you have "ghost" sessions from failed uploads.
*   **Solution:**
    1.  Increase `MaxUploadSessions` in the Admin Config.
    2.  Wait for the automatic cleanup (sessions expire after 2 hours).

## Encoding / FFmpeg Issues

### Video stays in "Processing" forever
*   **Cause:** FFmpeg crashed or was killed by the system (OOM - Out of Memory).
*   **Solution:**
    1.  Check the logs: `docker compose logs videocms | grep ffmpeg`.
    2.  If you see "Killed", your server ran out of RAM. Increase your server's RAM or add swap space.
    3.  If you see "Permission denied", check if the `./videos` folder is writable by the container user.

### "Audio/Video encoding type didn't match"
*   **Cause:** The uploaded file uses a codec that your installed version of FFmpeg doesn't support or can't decode.
*   **Solution:** Try re-encoding the video to a standard format (H.264/AAC) on your computer using Handbrake before uploading.

## Database Issues

### "Database is locked"
*   **Cause:** SQLite can only handle one write operation at a time. High traffic or a slow disk can cause this.
*   **Solution:**
    *   VideoCMS uses WAL mode to mitigate this, but extremely high concurrency might still trigger it.
    *   Ensure your database is on a fast local disk (SSD/NVMe), not a network share (NFS/CIFS).

## Permission Issues

### "mkdir: cannot create directory ... Permission denied"
*   **Cause:** The Docker container does not have ownership of the mapped volumes.
*   **Solution:**
    Run the following command to fix ownership (assuming standard docker user):
    ```bash
    chown -R 1000:1000 ./videos ./database
    ```

## Performance

### Video playback buffers frequently
*   **Cause:** The server CPU cannot keep up with transcoding (if using dynamic download) or the bandwidth is saturated.
*   **Solution:**
    *   **Pre-transcoding:** Ensure HLS master playlists are generated (Processing status is "Ready").
    *   **CDN:** Use Cloudflare to cache the video segments (`.ts` files).
    *   **CPU:** Upgrade to a server with more CPU cores if you have many concurrent viewers.
