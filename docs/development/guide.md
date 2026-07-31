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
*   **Bun** (v1.2 or higher)
*   **FFmpeg** (v4+, must be in your system `PATH`)
*   **GCC** (Required for CGO/SQLite)
*   **Git**

## Full-Stack Development

The recommended workflow starts the Nuxt frontend and hot-reloading Go backend together.

1.  **Clone the repository:**
    ```bash
    git clone --recurse-submodules https://github.com/kirari04/videocms.git
    cd videocms
    ```

    For an existing clone, initialize the submodules with:
    ```bash
    git submodule update --init --recursive
    ```

2.  **Download Go dependencies:**
    ```bash
    go mod download
    ```

3.  **Start VideoCMS:**
    ```bash
    make dev
    ```

    This command:

    - installs the locked frontend dependencies with Bun;
    - starts Nuxt at `http://127.0.0.1:3000`;
    - starts Go with [Air](https://github.com/air-verse/air) at `http://127.0.0.1:3001`;
    - injects a stable development-only storage encryption key so S3-compatible mounts can be configured locally;
    - proxies `/api`, player, captcha, icons, and media requests through Nuxt;
    - stops both processes cleanly when either one exits or you press `Ctrl+C`.

    The browser therefore uses one origin, matching the production request shape without requiring development CORS configuration.

To use different ports:

```bash
make dev DEV_FRONTEND_PORT=4000 DEV_BACKEND_PORT=4001
```

For focused debugging, the processes can also be started separately:

```bash
make dev-backend
make dev-frontend
```

### Environment Variables

The backend reads its existing environment variables as usual. The development launcher also supports:

- `DEV_FRONTEND_HOST`
- `DEV_FRONTEND_PORT`
- `DEV_BACKEND_HOST`
- `DEV_BACKEND_PORT`
- `DEV_BACKEND_URL`
- `DEV_PUBLIC_ORIGIN`
- `DEV_MEDIA_PATH`
- `DEV_STORAGE_ENCRYPTION_KEY` (override with another base64-encoded 32-byte key; never reuse the default in production)

## Frontend Setup (Nuxt 4)

The frontend can still be run directly when needed:

```bash
cd videocms-frontend
bun install --frozen-lockfile
bun run dev
```

Its development proxy targets `http://127.0.0.1:3001` by default. Set `NUXT_DEV_BACKEND_URL` to point it at another backend.

## Testing

Before submitting a PR:

```bash
go test ./...
go vet ./...
cd videocms-frontend && bun run build
```

Also manually test the workflow you changed and ensure modified Go files have been formatted.

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
bun run build
# Output will be in .output/
```

### Docker
The standard way to build the full image:
```bash
docker build -t videocms:local .
```
