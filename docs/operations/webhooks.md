---
lang: en-US
title: Player Webhooks
description: Using Player Webhooks to track playback progress.
---

# Player Webhooks


Player webhooks report playback progress to a configured external service. The player's browser sends updates to VideoCMS on the same origin; VideoCMS forwards them to the saved target using its guarded HTTP client. Target URLs are not exposed to viewers.

This is primarily used for **tracking user progress**, **analytics**, or **LMS (Learning Management System) integration**.

## How it Works

1.  **Configuration:** You define a webhook in the admin panel, specifying a `Target URL`, a `Request Field` (from the URL query), and a `Response Field` (to send in the body).
2.  **Initialization:** When a user opens a video player page, the player loads the list of active webhooks.
3.  **Heartbeat:** While the video is playing, the player sends a POST to VideoCMS, which forwards it to your `Target URL` at a defined interval (Requests Per Minute).
4.  **Payload:** The request contains the video UUID, the current playback position, and a custom value extracted from the player's URL parameters.

## Configuration Fields

| Field | Description |
| :--- | :--- |
| **URL** | The public HTTP or HTTPS endpoint where VideoCMS forwards the data (e.g., `https://my-lms.com/api/progress`). |
| **Request Field** | The name of the GET parameter to look for in the player's URL (e.g., `user_id`). |
| **Response Field** | The key name to use when sending that value back in the POST body (e.g., `student_ref`). |
| **RPM** | Requests Per Minute. How often the player should "ping" your URL. |

## Example Scenario

You want to track which student is watching a video on your external LMS.

1.  **Setup:** You configure a webhook in VideoCMS:
    -   **URL:** `https://api.my-school.com/video-tracking`
    -   **Request Field:** `student`
    -   **Response Field:** `student`
    -   **RPM:** `2` (send an update every 30 seconds)

2.  **Usage:** You embed the video or link your students to the player with their ID in the URL:
    `https://player.videocms.com/v/uuid-1234?student=john_doe`

3.  **Execution:** When John Doe watches the video:
    -   The player sees the `student=john_doe` parameter.
    -   Every 30 seconds, VideoCMS forwards its progress to `https://api.my-school.com/video-tracking`.
    -   **Payload (FormData):**
        -   `uuid`: `uuid-1234`
        -   `position`: `15.4` (Current timestamp in seconds)
        -   `student`: `john_doe`

## Handling the Request

Your endpoint will receive a `POST` request with a `FormData` body. Here is a simple Node.js (Express) example of how to handle it.

```javascript
const express = require('express');
const multer = require('multer'); // Required for parsing FormData
const upload = multer();
const app = express();

app.post('/video-tracking', upload.none(), (req, res) => {
    const { uuid, position, student } = req.body;

    console.log(`Student ${student} is at ${position}s in video ${uuid}`);

    // Save to database...

    res.sendStatus(200);
});

app.listen(3000);
```

## Important Notes

*   **Networking:** Requests come from the VideoCMS server. Browser CORS permission is not required. Private, loopback, link-local, CGNAT and blocked reserved addresses are rejected at connection time, including redirected and DNS-resolved targets. Requests have a ten-second deadline.
*   **Security:** Progress and the custom value originate with the viewer. **Do not trust it blindly** for critical logic (like unlocking paid content) without validation, as a user could technically spoof these requests.
*   **Performance:** Be mindful of the RPM setting. Setting it too high (e.g., 60 RPM) with many concurrent viewers could flood your tracking server.