---
lang: en-US
title: Upload Video
description: How to upload a video on VideoCMS
---

# Uploading Videos

VideoCMS provides a robust Upload Manager designed to handle multiple large video files efficiently. You can access the Upload Manager by navigating to the **Videos** section in your dashboard and clicking on the upload action.

## Adding Files to the Queue

There are two primary ways to add video files to your upload queue:

1.  **Drag and Drop**: Simply drag video files (MP4, MKV, AVI, etc.) from your computer and drop them directly onto the dashed dropzone area.
2.  **File Picker**: Click anywhere within the dropzone to open your browser's file selection dialog. You can select multiple files at once.

Before uploading, ensure you are in the correct **Target Folder**. The breadcrumbs above the dropzone show exactly where your videos will be stored.

## Upload Configuration

The Upload Manager allows you to fine-tune how files are sent to the server:

-   **Concurrent Chunks**: VideoCMS uploads files in small parts (chunks). This setting controls how many chunks are uploaded simultaneously.
    -   **1 Chunk (Stable)**: Best for slow or unstable internet connections.
    -   **4 Chunks (Recommended)**: The default balance between speed and reliability.
    -   **10-15 Chunks (Fast/Ultra)**: Use this if you have a high-speed connection and want to maximize throughput.

## Managing the Upload Queue

Once files are added to the queue, they will appear in the **Upload List** on the right side of the screen.

1.  **Start Upload**: Click the **Start Upload** button in the top right to begin processing the queue.
2.  **Monitor Progress**: Each file in the list will show its individual progress, upload speed, and status.
3.  **Queue Actions**:
    -   **Clear Done**: Removes all successfully uploaded items from the list to declutter your view.
    -   **Retry Errors**: Quickly restarts any uploads that failed due to network interruptions.

## Automated Uploads (API)

For developers and third-party integrations, VideoCMS offers a simplified direct upload endpoint that works perfectly with **API Keys**. Unlike the dashboard's chunked uploader, this allows you to send a file in a single multipart request.

### Basic Integration Example

To upload a video using `curl` and an API Key:

```bash
curl -X POST https://video.example.com/api/file/upload \
  -H "Authorization: Bearer ak_your_api_key" \
  -F "file=@/path/to/your/video.mp4" \
  -F "Name=My Awesome Video" \
  -F "ParentFolderID=0"
```

### Key Considerations
- **Body Limits**: Ensure your reverse proxy (Nginx/Caddy) is configured to handle the file size (see [Production Deployment](../operations/production.md)).
- **Reliability**: For extremely large files (several GBs) or unstable connections, the dashboard's **Parallel Chunked Upload (PCU)** is still recommended as it supports resuming.
- **API Keys**: Manage your keys in **Settings > API Management**.

::: tip More Info
For full details on the upload payloads, check the [API Reference](../reference/api.md).
:::