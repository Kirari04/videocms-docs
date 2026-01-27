---
lang: en-US
title: CLI Reference
description: Command Line Interface for VideoCMS
---

# CLI Reference

VideoCMS includes a Command Line Interface (CLI) to manage the application and perform administrative tasks.

If you are running VideoCMS with Docker, you can execute these commands inside the container:

```sh
docker compose exec videocms /app/videocms [command]
```


## Commands

### `serve:main`

Starts the main server, including the API, Web server, and background services (Encoding, Cleanup, Deletion, System Stats).

**Usage:**

```sh
videocms serve:main
```

### `config`

Prints the current configuration of the application. Useful for verifying environment variable settings.

**Usage:**

```sh
videocms config
```

### `create:user`

Creates a new administrative user. You will likely need to provide arguments or follow interactive prompts (depending on implementation details not fully visible in the summary).

**Usage:**

```sh
videocms create:user
```

### `delete:user`

Deletes an existing user.

**Usage:**

```sh
videocms delete:user
```

### `help`

Displays help information about available commands.

**Usage:**

```sh
videocms help
```
