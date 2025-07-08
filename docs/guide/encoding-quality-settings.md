# Encoding Quality Settings

This guide explains how to adjust the encoding quality settings in VideoCMS.

## Overview

VideoCMS allows you to configure the encoding quality for various HLS (HTTP Live Streaming) resolutions. These settings are directly accessible and modifiable in the admin panel, requiring administrative privileges.

## Accessing Settings

To change the encoding quality settings, log in to your VideoCMS instance with an administrator account and navigate to the configuration page, found at `/my/config`.

## Important Considerations

*   **Admin Rights:** Modifying these settings requires administrator privileges.
*   **Impact on Storage and Bandwidth:** Higher bitrates result in larger file sizes, consuming more storage space and requiring more bandwidth for streaming.
*   **Processing Time:** Encoding at higher resolutions and bitrates will increase the time it takes to process videos.
*   **Restart Required:** After changing these settings, you may need to restart your VideoCMS instance or related services for the changes to take effect.

## Available Settings

Within the configuration page, you will find the following settings related to HLS encoding quality:

| Setting | Description | Default |
|---|---|---|
| **Encode HLS 240p** | Enable or disable encoding for the 240p HLS stream. | Enabled |
| **HLS 240p Video Bitrate** | The video bitrate for the 240p HLS stream. This value is passed directly to `ffmpeg`. For example, `400k` would set the bitrate to 400 kbps. A higher bitrate generally results in better quality but larger file sizes. | |
| **Encode HLS 360p** | Enable or disable encoding for the 360p HLS stream. | Enabled |
| **HLS 360p Video Bitrate** | The video bitrate for the 360p HLS stream. For example, `800k`. | |
| **Encode HLS 480p** | Enable or disable encoding for the 480p HLS stream. | Enabled |
| **HLS 480p Video Bitrate** | The video bitrate for the 480p HLS stream. For example, `1200k`. | |
| **Encode HLS 720p** | Enable or disable encoding for the 720p HLS stream. | Enabled |
| **HLS 720p Video Bitrate** | The video bitrate for the 720p HLS stream. For example, `2500k`. | |
| **Encode HLS 1080p** | Enable or disable encoding for the 1080p HLS stream. | Enabled |
| **HLS 1080p Video Bitrate** | The video bitrate for the 1080p HLS stream. For example, `4500k`. | |
| **Encode HLS 1440p** | Enable or disable encoding for the 1440p HLS stream. | Enabled |
| **HLS 1440p Video Bitrate** | The video bitrate for the 1440p HLS stream. For example, `8000k`. | |
| **Encode HLS 2160p** | Enable or disable encoding for the 2160p HLS stream. | Enabled |
| **HLS 2160p Video Bitrate** | The video bitrate for the 2160p HLS stream. For example, `12000k`. | |

By carefully adjusting these settings, you can optimize the balance between video quality and resource usage for your VideoCMS deployment.
