---
lang: en-US
title: Subtitle Support
description: How VideoCMS handles standard and PGS subtitles
---

# Subtitle Support

VideoCMS provides comprehensive support for various subtitle formats, ensuring your audience can enjoy content in their preferred language.

## Standard Subtitles (Out of the Box)

Most common text-based subtitle formats are supported **automatically** without any additional configuration. When you upload a video, VideoCMS extracts and processes internal subtitle tracks into web-friendly formats:

-   **VTT (WebVTT)**: The standard format for web video players, ensuring broad compatibility across devices.
-   **ASS (Advanced Substation Alpha)**: Supported for more complex styling and positioning.

These subtitles are extracted using FFmpeg during the video processing phase and will be available in the player as soon as the encoding is complete.

---

## PGS Subtitle Support (Optional Plugin)

**PGS (Presentation Graphics Stream)** subtitles are an **image-based format** commonly found on Blu-ray discs. Unlike text-based subtitles, each PGS subtitle is a bitmap image.

To display these on the web, VideoCMS must extract these images and convert them into text using OCR (Optical Character Recognition). This requires an optional plugin.

### Prerequisites

-   **Server Access**: You'll need to modify your `docker-compose.yaml`.
-   **Docker Knowledge**: Familiarity with restarting services.

### Step 1: Add the PGS Plugin Service

Add the `pgsplugin` service to your `docker-compose.yaml` file. This service handles the heavy lifting of image-to-text conversion.

```yaml
services:
  # ... your other services ...

  pgsplugin:
    image: kirari04/videocms:plugin-pgs
    restart: unless-stopped
    networks:
      - videocmsnet
```

### Step 2: Restart Services

Apply the changes by restarting your Docker containers:

```bash
docker compose up -d
```

### Step 3: Enable in Admin Panel

Once the plugin is running, you must enable it in your VideoCMS configuration:

1.  Navigate to **Settings** (`/my/config`) in your dashboard.
2.  Find the **Plugin Settings** section.
3.  Enable **Plugin PGS Server**.
4.  Set the **Plugin PGS Server Address** to: `http://pgsplugin:5000`

::: warning Experimental Feature
The PGS conversion process is resource-intensive and uses OCR. While it enables support for Blu-ray subtitles, the resulting text may occasionally contain minor formatting or recognition errors.
:::

---

## Technical Details

VideoCMS uses FFmpeg to map and transcode subtitle streams. For standard tracks, it maps the stream directly (e.g., `-map 0:s:0`). For PGS tracks, it first routes the data through the PGS plugin to generate a temporary SRT file before final conversion to VTT or ASS.
