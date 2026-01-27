---
lang: en-US
title: API Reference
description: API Endpoints for VideoCMS
---

# API Reference

This document lists the available API endpoints for VideoCMS.

[[toc]]

## Public Web & Player

These routes are primarily used by the video player and public interfaces.

### Captcha

- `GET /captcha/challenge`: Get a captcha challenge.
- `POST /captcha/verify`: Verify a captcha response.

### Player & Streaming

- `GET /v/:UUID`: Player page for a video.
- `GET /:UUID/stream/muted/master.m3u8`: Get muted master playlist.
- `GET /:UUID/stream/multi/master.m3u8`: Get multi-quality master playlist.
- `GET /:UUID/image/thumb/:FILE`: Get video thumbnail.
- `GET /:UUID/:SUBUUID/subtitle/:FILE`: Get subtitle file.
- `GET /:UUID/:AUDIOUUID/stream/master.m3u8`: Get audio stream.
- `GET /:UUID/:QUALITY/download/video.mkv`: Download video.
- `GET /:UUID/:QUALITY/:JWT/:STREAM/stream/video.mp4`: Stream video file directly.
- `GET /:UUID/:QUALITY/:FILE`: Get video segment/file.
- `GET /:UUID/:AUDIOUUID/audio/:FILE`: Get audio segment/file.

## Authentication API

Base URL: `/api/auth`

- `POST /login`: Login to the system.
- `GET /check`: Check current authentication status.
- `GET /refresh`: Refresh authentication token.
- `POST /apikey`: Authenticate using an API key.

## Public API

Base URL: `/api`

- `GET /config`: Get public configuration.
- `GET /file/example`: Get an example file.
- `GET /p/pages`: List public web pages.
- `GET /p/page`: Get a specific public web page.

## Private API (Authenticated)

These routes require a valid JWT token.

Base URL: `/api`

### Folders

- `GET /folders`: List folders.
- `POST /folder`: Create a new folder.
- `PUT /folder`: Update a folder.
- `DELETE /folder`: Delete a folder.
- `DELETE /folders`: Bulk delete folders.

### Files

- `GET /files`: List files.
- `GET /file`: Get file details.
- `POST /file`: Create a file entry.
- `POST /file/clone`: Clone a file.
- `PUT /file`: Update file details.
- `DELETE /file`: Delete a file.
- `DELETE /files`: Bulk delete files.
- `GET /files/search`: Search for files.

### Tags

- `POST /file/tag`: Add a tag to a file.
- `DELETE /file/tag`: Remove a tag from a file.

### Uploads (PCU)

- `GET /pcu/sessions`: List upload sessions.
- `POST /pcu/session`: Create an upload session.
- `DELETE /pcu/session`: Delete an upload session.
- `POST /pcu/chunck`: Upload a file chunk.
- `POST /pcu/file`: Finalize an upload.

### Account Stats

- `GET /account`: Get account details.
- `GET /account/settings`: Get user settings.
- `PUT /account/settings`: Update user settings.
- `GET /account/traffic`: Get traffic statistics.
- `GET /account/traffic/top`: Get top traffic statistics.
- `GET /account/upload`: Get upload statistics.
- `GET /account/upload/top`: Get top upload statistics.
- `GET /account/encoding`: Get encoding statistics.
- `GET /account/encoding/top`: Get top encoding statistics.
- `GET /account/storage/top`: Get top storage statistics.

### Webhooks

- `GET /webhooks`: List webhooks.
- `POST /webhook`: Create a webhook.
- `PUT /webhook`: Update a webhook.
- `DELETE /webhook`: Delete a webhook.

### Encodings

- `GET /encodings`: List encoding jobs.

## Admin API (Authenticated & Admin)

Base URL: `/api`

### System Stats

- `GET /stats`: Get system statistics.
- `GET /stats/traffic`: Get global traffic stats.
- `GET /stats/traffic/top`: Get global top traffic stats.
- `GET /stats/upload`: Get global upload stats.
- `GET /stats/upload/top`: Get global top upload stats.
- `GET /stats/encoding`: Get global encoding stats.
- `GET /stats/encoding/top`: Get global top encoding stats.
- `GET /stats/storage/top`: Get global top storage stats.

### User Management

- `GET /users`: List all users.
- `POST /users`: Create a new user.
- `GET /users/:id`: Get a specific user.
- `PUT /users/:id`: Update a user.
- `DELETE /users/:id`: Delete a user.
- `POST /users/:id/password`: Reset user password.

### Settings & Pages

- `GET /settings`: Get system settings.
- `PUT /settings`: Update system settings.
- `GET /pages`: List all web pages.
- `POST /page`: Create a web page.
- `PUT /page`: Update a web page.
- `DELETE /page`: Delete a web page.

### Admin Encodings

- `GET /admin/encodings`: List all encoding jobs (admin view).

### Other

- `GET /move`: Move items (Controller: `MoveItemsController`).
- `GET /versioncheck`: Check for updates.
