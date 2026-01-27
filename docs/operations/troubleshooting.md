---
lang: en-US
title: Troubleshooting
description: Common issues and solutions for VideoCMS.
---

# Troubleshooting


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

When users experience buffering, it is rarely the CPU's fault. VideoCMS runs FFmpeg with a high `niceness` level, meaning the system prioritizes the API and web traffic over background encoding tasks. If the web server is responsive but video segments load slowly, you need to investigate other bottlenecks.

#### 1. Network Bandwidth
The most common cause is insufficient uplink from your server to the internet or a specific region.

*   **Test Raw Bandwidth:** Run a speed test to a known high-bandwidth node.
    ```bash
    # Using iperf3 to test raw throughput (multi-threaded)
    iperf3 -c ping.online.net -p 5201 -P 30
    ```
*   **Check Real-time Usage:** Use `nload` or `iftop` to see if your server's network interface is hitting its limit during peak hours.

#### 2. Network Routing (Peering)
Sometimes the "raw" speed is fine, but the route between your server and the user is unoptimal or congested.

*   **Investigation:** Ask the user for their IP and run a traceroute or `mtr` from the server to them.
    ```bash
    # Check for packet loss and latency at each hop
    mtr -rw [USER_IP]
    ```
*   **Solution:** Using a CDN like **Cloudflare** can drastically improve this by serving segments from a PoP (Point of Presence) closer to the user.

#### 3. Storage I/O (Disk Speed)
If you are using slow HDDs or a congested network share (NFS/CIFS), the disk might not be able to read the video segments fast enough for multiple concurrent viewers.

*   **Check I/O Wait:** Run `top` or `htop` and look at the `%wa` (IO Wait) percentage. If this is consistently above 10-15%, your disks are struggling to keep up.
*   **Monitor Disk Activity:** Use `iotop` to see which process is saturated.
    ```bash
    # See real-time disk read/write speeds per process
    iotop -o
    ```
*   **Solution:** Move the `videos` directory to an SSD or NVMe drive.

#### 4. Memory and Swapping
If the server runs out of RAM, it will start "swapping" to the disk, which is extremely slow and causes the entire system to lag.

*   **Check Swap Usage:** Run `free -m`. If `Swap` is heavily used, your server needs more RAM.
    ```bash
    free -m
    ```

