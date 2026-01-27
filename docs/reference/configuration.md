---
lang: en-US
title: Configuration
description: Configuration options for VideoCMS
---

# Configuration

VideoCMS is configured using environment variables. This page lists all available configuration options.


## General Settings

| Variable | Description | Default |
| :--- | :--- | :--- |
| `Host` | The host and port the server listens on. | `:3000` |
| `AppName` | The name of your application instance. | - |
| `BaseUrl` | The base URL of the API (e.g., `https://api.example.com`). | - |
| `Project` | The project name. | - |
| `ProjectDocumentation` | URL to project documentation. | - |
| `ProjectDownload` | URL to project download page. | - |
| `ProjectExampleVideo` | UUID of an example video. | - |

## Security & Authentication

| Variable | Description | Default |
| :--- | :--- | :--- |
| `JwtSecretKey` | Secret key for JWT authentication. **Change this!** | - |
| `JwtUploadSecretKey` | Secret key for upload sessions. **Change this!** | - |
| `TrustedProxies` | Comma-separated list of trusted proxy IPs. | - |
| `TrustLocalTraffic` | Whether to trust local traffic (true/false). | - |
| `CorsAllowOrigins` | Allowed CORS origins. | - |
| `CorsAllowHeaders` | Allowed CORS headers. | - |
| `CorsAllowCredentials` | Allow CORS credentials (true/false). | - |

## Feature Flags

| Variable | Description | Default |
| :--- | :--- | :--- |
| `EncodingEnabled` | Enable video encoding (true/false). | - |
| `UploadEnabled` | Enable video uploads (true/false). | - |
| `DownloadEnabled` | Enable video downloads (true/false). | - |
| `PlayerV2Enabled` | Enable the V2 player (true/false). | - |
| `ContinueWatchingPopupEnabled` | Enable "Continue Watching" popup (true/false). | - |
| `ReloadHtml` | Enable HTML reloading (dev mode) (true/false). | - |

## Limits & Performance

| Variable | Description | Default |
| :--- | :--- | :--- |
| `RatelimitEnabled` | Enable rate limiting (true/false). | - |
| `RatelimitRateGlobal` | Global rate limit rate. | - |
| `RatelimitBurstGlobal` | Global rate limit burst. | - |
| `RatelimitRateAuth` | Auth rate limit rate. | - |
| `RatelimitBurstAuth` | Auth rate limit burst. | - |
| `RatelimitRateApi` | API rate limit rate. | - |
| `RatelimitBurstApi` | API rate limit burst. | - |
| `RatelimitRateUpload` | Upload rate limit rate. | - |
| `RatelimitBurstUpload` | Upload rate limit burst. | - |
| `RatelimitRateWeb` | Web rate limit rate. | - |
| `RatelimitBurstWeb` | Web rate limit burst. | - |
| `MaxItemsMultiDelete` | Max items for bulk deletion. | - |
| `MaxRunningEncodes` | Max concurrent encoding jobs. | - |
| `MaxFramerate` | Max framerate for encoded videos. | - |
| `MaxUploadFilesize` | Max upload file size (bytes). | - |
| `MaxUploadChuncksize` | Max upload chunk size (bytes). | - |
| `MaxUploadSessions` | Max active upload sessions. | - |
| `MaxPostSize` | Max HTTP POST body size. | - |

## Storage Paths

| Variable | Description | Default |
| :--- | :--- | :--- |
| `FolderVideoQualitysPriv` | Private path for encoded videos. | `./videos/qualitys` |
| `FolderVideoQualitysPub` | Public URL path for encoded videos. | `/videos/qualitys` |
| `FolderVideoUploadsPriv` | Private path for uploaded raw files. | `./videos/uploads` |
| `StatsDriveName` | Drive name for disk stats (e.g., `nvme0n1`). | `nvme0n1` |

## CDN Integration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `CloudflareEnabled` | Enable Cloudflare integration (true/false). | - |
| `BunnyCDNEnabled` | Enable BunnyCDN integration (true/false). | - |
| `FastlyEnabled` | Enable Fastly integration (true/false). | - |
| `KeyCDNEnabled` | Enable KeyCDN integration (true/false). | - |

## Captcha

| Variable | Description | Default |
| :--- | :--- | :--- |
| `CaptchaEnabled` | Enable Captcha globally (true/false). | - |
| `CaptchaLoginEnabled` | Enable Captcha on login (true/false). | - |
| `CaptchaPlayerEnabled` | Enable Captcha on player (true/false). | - |
| `CaptchaType` | Type of Captcha (`recaptcha`, `hcaptcha`, `turnstile`). | - |
| `Captcha_Recaptcha_PrivateKey` | ReCaptcha Private Key. | - |
| `Captcha_Recaptcha_PublicKey` | ReCaptcha Public Key. | - |
| `Captcha_Hcaptcha_PrivateKey` | hCaptcha Private Key. | - |
| `Captcha_Hcaptcha_PublicKey` | hCaptcha Public Key. | - |
| `Captcha_Turnstile_PrivateKey` | Cloudflare Turnstile Private Key. | - |
| `Captcha_Turnstile_PublicKey` | Cloudflare Turnstile Public Key. | - |

## Encoding Settings

You can enable/disable specific resolutions and set their bitrate and CRF (Constant Rate Factor).

| Variable | Description |
| :--- | :--- |
| `EncodeHls240p` | Enable 240p encoding (true/false). |
| `Hls240pVideoBitrate` | Bitrate for 240p. |
| `Hls240pCrf` | CRF for 240p. |
| `EncodeHls360p` | Enable 360p encoding (true/false). |
| `Hls360pVideoBitrate` | Bitrate for 360p. |
| `Hls360pCrf` | CRF for 360p. |
| `EncodeHls480p` | Enable 480p encoding (true/false). |
| `Hls480pVideoBitrate` | Bitrate for 480p. |
| `Hls480pCrf` | CRF for 480p. |
| `EncodeHls720p` | Enable 720p encoding (true/false). |
| `Hls720pVideoBitrate` | Bitrate for 720p. |
| `Hls720pCrf` | CRF for 720p. |
| `EncodeHls1080p` | Enable 1080p encoding (true/false). |
| `Hls1080pVideoBitrate` | Bitrate for 1080p. |
| `Hls1080pCrf` | CRF for 1080p. |
| `EncodeHls1440p` | Enable 1440p encoding (true/false). |
| `Hls1440pVideoBitrate` | Bitrate for 1440p. |
| `Hls1440pCrf` | CRF for 1440p. |
| `EncodeHls2160p` | Enable 2160p (4K) encoding (true/false). |
| `Hls2160pVideoBitrate` | Bitrate for 2160p. |
| `Hls2160pCrf` | CRF for 2160p. |

## Plugins

| Variable | Description |
| :--- | :--- |
| `EnablePluginPgsServer` | Enable PGS Subtitle Server plugin (true/false). |
| `PluginPgsServer` | URL for PGS Subtitle Server. |
