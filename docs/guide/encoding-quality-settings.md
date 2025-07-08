---
lang: en-US
title: Encoding Quality Settings
description: Encoding Quality Settings on VideoCMS
---

# Encoding Quality Settings

[[toc]]

This guide explains how to adjust the encoding quality settings in VideoCMS to balance video quality, storage, and bandwidth.

## Overview

VideoCMS allows you to fine-tune the encoding quality for various HLS (HTTP Live Streaming) resolutions. For each resolution, you can enable or disable the stream and set a specific video bitrate. These settings are directly accessible in the admin panel.

## Accessing Settings

To change the encoding quality settings, you need administrator privileges. Log in to your VideoCMS instance and navigate to the configuration page at `/my/config`.

> ### Important Considerations
>
> * **Admin Rights:** Modifying these settings requires an administrator account.
> * **Impact on Resources:** Higher bitrates result in better video quality but also larger file sizes. This will increase storage consumption, bandwidth requirements, and video processing time.
> * **Restart May Be Required:** After changing these settings, you might need to restart your VideoCMS instance for the changes to take full effect.

## Available Settings

On the configuration page, you will find settings to enable/disable each HLS stream and to define its video bitrate. The bitrate values are passed directly as a string to `ffmpeg` (e.g., `2500k`).

| Resolution | Enable Setting (Checkbox) | Bitrate Setting (Text Input) | Default Bitrate |
| :--------- | :------------------------ | :--------------------------- | :-------------- |
| **240p** | `Encode HLS 240p` | `HLS 240p Video Bitrate` | `400k` |
| **360p** | `Encode HLS 360p` | `HLS 360p Video Bitrate` | `800k` |
| **480p** | `Encode HLS 480p` | `HLS 480p Video Bitrate` | `1200k` |
| **720p** | `Encode HLS 720p` | `HLS 720p Video Bitrate` | `2500k` |
| **1080p** | `Encode HLS 1080p` | `HLS 1080p Video Bitrate`| `4500k` |
| **1440p** | `Encode HLS 1440p` | `HLS 1440p Video Bitrate`| `8000k` |
| **2160p** | `Encode HLS 2160p` | `HLS 2160p Video Bitrate`| `12000k` |

## Use Case Scenarios

Here are a couple of examples of how you might configure these settings:

### Scenario 1: Optimizing for Storage and Bandwidth

If you need to save on storage space and your users have limited bandwidth, you might disable higher resolutions and lower the bitrates for the streams you do support.

* **Disable:** Uncheck `Encode HLS 1440p` and `Encode HLS 2160p`.
* **Lower bitrates:** Reduce the bitrate values for the 720p and 1080p streams.

### Scenario 2: High-Quality Streaming

For a premium video service where visual quality is the top priority, you would ensure all resolutions are enabled with high bitrates.

* **Enable:** Ensure all `Encode HLS` checkboxes are checked.
* **Increase bitrates:** You could increase the default bitrate values for a crisper image, especially for 1080p and higher resolutions.

By carefully adjusting these settings, you can tailor the video streaming experience to the specific needs of your platform and audience.