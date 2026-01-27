---
lang: en-US
title: Documentation
description: Comprehensive guides and documentation for VideoCMS
---

# Documentation

Welcome to the VideoCMS documentation hub. Here you can find everything from installation instructions to advanced configuration.

## Essentials

Start here to get your instance running and configured.

- [Getting Started](./getting-started.md)
  <br>Learn how to install VideoCMS locally using Docker Compose.
- [Configuration Reference](../reference/configuration.md)
  <br>A complete list of all environment variables to customize your instance (storage, limits, security, etc.).
- [CLI Reference](../reference/cli.md)
  <br>Manage your instance via the command line (create users, manage server).
- [API Reference](../reference/api.md)
  <br>Full documentation of the REST API endpoints.

## User Guides

Learn how to use the features of VideoCMS.

- [User Management](./user-management.md)
  <br>Create users and reset passwords via Web or CLI.
- [Upload Video](./upload-video.md)
  <br>A visual guide on how to upload and manage your video content.
- [Customization](./customization.md)
  <br>Create custom static pages (like "About Us" or "Terms") directly from the admin panel.
- [Encoding Settings](./encoding.md)
  <br>Optimize your video streaming by configuring different resolutions and bitrates.
- [Subtitle Support](./subtitles.md)
  <br>Enable support for image-based subtitles (PGS) commonly found on Blu-rays.

## Operations

Recipes for production environments, security hardening, and integrations.

- [Production Deployment](../operations/production.md)
  <br>Deploy with SSL using Caddy (automatic) or Nginx (manual).
- [Cloudflare Setup](../operations/cloudflare.md)
  <br>Configure VideoCMS to work behind Cloudflare's proxy.
- [Security Hardening](../operations/security.md)
  <br>Essential steps to secure your instance (change passwords, rotate keys, rate limiting).
- [Backup & Restore](../operations/backup-restore.md)
  <br>How to backup your database and media files.
- [Webhooks](../operations/webhooks.md)
  <br>Connecting VideoCMS to Discord and other services.

## Support & Maintenance

- [Troubleshooting](../operations/troubleshooting.md)
  <br>Solutions for common issues (Upload failures, FFmpeg crashes, Database locks).
- [Upgrade Guide](../operations/upgrade.md)
  <br>Safe process to update your instance and how migrations work.
- [Architecture](../reference/architecture.md)
  <br>Deep dive into the transcoding pipeline, storage structure, and database flow.
- [Developer Guide](../development/guide.md)
  <br>How to run the project locally (Go/Nuxt) and build from source.
- [Changelog](../development/changelog.md)
  <br>Current alpha status, release strategy, and roadmap.
