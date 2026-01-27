---
lang: en-US
title: User Management
description: Managing users, creating accounts, and resetting passwords.
---

# User Management

[[toc]]

This guide covers how to manage users in VideoCMS, including creating new accounts and resetting passwords.

## Creating a User

### Method 1: Via Admin Panel (Web)

1.  Log in to your VideoCMS instance.
2.  Navigate to **Dashboard** > **Users**.
3.  Click the **Create User** button.
4.  Fill in the **Username** and **Password**.
5.  Toggle **Is Admin** if you want to grant administrative privileges.
6.  Click **Create**.

### Method 2: Via CLI

If you cannot access the web interface (e.g., you locked yourself out), you can create a user via the command line inside the docker container.

1.  Access the container:
    ```bash
    docker compose exec api /app/videocms create:user
    ```
2.  Follow the interactive prompts:
    -   **Enter Username:** Type the desired username.
    -   **Enter Password:** Type the password (it will be hidden).
    -   **Enter IsAdmin[yes|no]:** Type `yes` for an admin, `no` for a regular user.

## Resetting a Password

### Method 1: Via Admin Panel (Web)

1.  Log in as an Admin.
2.  Navigate to **Dashboard** > **Users**.
3.  Find the user in the list and click the **Edit** (pencil) icon.
4.  Enter a new password in the password field.
5.  Click **Save**.

### Method 2: Via CLI

Currently, there is no direct "reset password" command in the CLI. To reset a password via CLI, you must delete the user and recreate them.

> **Warning:** Deleting a user will NOT delete their uploaded videos, but the link between the user and their files might be lost or require manual database adjustment. Use this method only for emergency admin access recovery.

1.  **Delete the User:**
    ```bash
    docker compose exec api /app/videocms delete:user
    ```
    Enter the username when prompted.

2.  **Recreate the User:**
    ```bash
    docker compose exec api /app/videocms create:user
    ```
    Enter the same username and the new password.
