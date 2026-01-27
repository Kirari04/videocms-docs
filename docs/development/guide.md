---
lang: en-US
title: Developer Guide
description: How to run VideoCMS locally for development and contributing.
---

# Developer Guide


This guide is for developers who want to contribute to VideoCMS or run it from source without Docker.

## Prerequisites

Ensure you have the following installed:

*   **Go** (v1.25 or higher)
*   **Node.js** (v18+) or **Bun**
*   **FFmpeg** (v4+, must be in your system `PATH`)
*   **GCC** (Required for CGO/SQLite)
*   **Git**

## Backend Setup (Go)

The backend is written in Go using the Echo framework and GORM (SQLite).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kirari04/videocms.git
    cd videocms
    ```

2.  **Install Dependencies:**
    ```bash
    go mod download
    ```

3.  **Run with Hot-Reload (Recommended):**
    We use [Air](https://github.com/air-verse/air) for live reloading.
    ```bash
    # Install Air if you haven't
    go install github.com/air-verse/air@latest

    # Run the server
    make dev
    ```
    The API will start at `http://localhost:3000`.

    > **Note:** If you are running the frontend development server simultaneously (which also defaults to port 3000), you should run the backend on a different port:
    > ```bash
    > Host=:8080 make dev
    > ```

4.  **Run Manually:**
    ```bash
    go run main.go serve
    ```

### Environment Variables
The backend looks for a `.env` file or system environment variables. See `config/config.go` for defaults.

## Frontend Setup (Nuxt 4)

The frontend is a Nuxt 4 application. If you don't have it locally, you can clone it from the dedicated repository.

1.  **Clone or Navigate:**
    ```bash
    # If not present in the main project:
    git clone https://github.com/Kirari04/videocms-frontend.git
    cd videocms-frontend
    
    # Or navigate to the existing folder:
    cd videocms-frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will start at `http://localhost:3000`.

    > **Note:** You may need to adjust `nuxt.config.ts` or environment variables to point to your local Go backend port (usually `8080` if running raw Go, or mapped differently).

## Testing

Currently, the project relies on **manual verification**. There are no automated unit tests (`*_test.go`).

*   **Before Submitting a PR:**
    1.  Verify the application builds (`go build`).
    2.  Manually test the feature you changed (e.g., upload a video, change a setting).
    3.  Ensure `go fmt` has been run.

## Building for Production

To build the static binary and frontend assets:

### Backend
```bash
# Build the binary
go build -o videocms main.go
```

### Frontend
```bash
cd videocms-frontend
npm run build
# Output will be in .output/
```

### Docker
The standard way to build the full image:
```bash
docker build -t videocms:local .
```
