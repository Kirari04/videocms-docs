---
lang: en-US
title: Guides
description: Comprehensive guides and documentation for VideoCMS
---

# Guides & Documentation

Welcome to the VideoCMS documentation hub. Here you can find everything from installation instructions to advanced configuration.

[[toc]]

## Essentials

Start here to get your instance running and configured.

- [Get Started](./guide/get-started.md)
  <br>Learn how to install VideoCMS locally using Docker Compose.
- [Configuration Reference](../configuration.md)
  <br>A complete list of all environment variables to customize your instance (storage, limits, security, etc.).
- [CLI Reference](../cli.md)
  <br>Manage your instance via the command line (create users, manage server).
- [API Reference](../api-reference.md)
  <br>Full documentation of the REST API endpoints.

## User Guides

Learn how to use the features of VideoCMS.

- [User Management](./guide/user-management.md)
  <br>Create users and reset passwords via Web or CLI.
- [Upload Video](./guide/upload-video.md)
  <br>A visual guide on how to upload and manage your video content.
- [Custom Webpage](./guide/custom-webpage.md)
  <br>Create custom static pages (like "About Us" or "Terms") directly from the admin panel.
- [Encoding Quality Settings](./guide/encoding-quality-settings.md)
  <br>Optimize your video streaming by configuring different resolutions and bitrates.
- [PGS Subtitle Support](./guide/pgs-subtitle-support.md)
  <br>Enable support for image-based subtitles (PGS) commonly found on Blu-rays.

## Cookbooks (Advanced)

Recipes for production environments, security hardening, and integrations.

- [Production Deployment](../cookbooks/production-deployment.md)
  <br>Deploy with SSL using Caddy (automatic) or Nginx (manual).
- [Cloudflare Setup](../cookbooks/cloudflare.md)
  <br>Configure VideoCMS to work behind Cloudflare's proxy.
- [Post-Installation Security](../cookbooks/security.md)
  <br>Essential steps to secure your instance (change passwords, rotate keys, rate limiting).
- [Backup & Restore](../cookbooks/backup-restore.md)
  <br>How to backup your database and media files.
- [Webhook Integrations](../cookbooks/webhooks.md)
  <br>Connecting VideoCMS to Discord and other services.

## Support

- [Troubleshooting](../troubleshooting.md)
  <br>Solutions for common issues (Upload failures, FFmpeg crashes, Database locks).
- [Architecture](../architecture.md)
  <br>Deep dive into the transcoding pipeline, storage structure, and database flow.
- [Developer Guide](../developer-guide.md)
  <br>How to run the project locally (Go/Nuxt) and build from source.

## Maintenance

- [Upgrade Guide](../upgrade-guide.md)
  <br>Safe process to update your instance and how migrations work.
- [Changelog & Versioning](../changelog.md)
  <br>Current alpha status, release strategy, and roadmap.