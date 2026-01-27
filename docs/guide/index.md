---
lang: en-US
title: Documentation Overview
description: Comprehensive guides and documentation for VideoCMS Beta
---

# Documentation

Welcome to the **VideoCMS Beta** documentation. VideoCMS is a high-performance, self-hosted video management system designed for hardware efficiency and ease of use.

::: info STATUS: BETA (v0.1.0+)
VideoCMS has transitioned from Alpha to Beta. The architecture is now unified, serving both the API and Frontend from a single service on port `3000`.
:::

## 🚀 Essentials

Everything you need to get your instance up and running.

- **[Getting Started](./getting-started.md)**
  Install VideoCMS in under 5 minutes using Docker Compose.
- **[v0.0.9 to v0.1.0 Migration](../operations/migration-alpha-beta.md)** 
  Moving from the old multi-container Alpha setup to the unified Beta service.
- **[Upgrade Guide](../operations/upgrade.md)**
  How to keep your instance up to date with the latest Beta releases.
- **[Configuration Reference](../reference/configuration.md)**
  Complete list of environment variables for storage, security, and limits.

## 🛠️ User Guides

Learn how to manage your content and users effectively.

- **[Upload & Video Management](./upload-video.md)**
  Visual guide to uploading, folders, and content management.
- **[Encoding & Transcoding](./encoding.md)**
  Configure resolutions, bitrates, and hardware acceleration settings.
- **[User Management](./user-management.md)**
  Manage roles, permissions, and registration settings.
- **[Customization](./customization.md)**
  Create static webpages and themes directly from the dashboard.
- **[Subtitles (PGS Support)](./subtitles.md)**
  Enabling high-quality image-based subtitle rendering.

## 🛡️ Operations & Security

Hardening and maintaining your production instance.

- **[Production Deployment](../operations/production.md)**
  Setting up Reverse Proxies (Caddy/Nginx) with SSL termination.
- **[Backup & Restore](../operations/backup-restore.md)**
  Ensuring data safety with SQLite WAL-mode consistency.
- **[Security Best Practices](../operations/security.md)**
  JWT secret rotation, IP identification, and firewall rules.
- **[Cloudflare Setup](../operations/cloudflare.md)**
  Proxying traffic and handling large uploads through the Cloudflare WAF.
- **[Webhooks](../operations/webhooks.md)**
  Automate notifications to Discord or custom endpoints.

## 🔍 Reference & Development

Deep dives for power users and contributors.

- **[Architecture Overview](../reference/architecture.md)**
  Understanding the internal transcode pipeline and storage structure.
- **[API Reference](../reference/api.md)**
  REST API documentation for custom integrations.
- **[CLI Reference](../reference/cli.md)**
  Administrative tools for database and server management.
- **[Developer Guide](../development/guide.md)**
  Setting up the Go and Nuxt development environment.
- **[Changelog](../development/changelog.md)**
  Live version tracking and recent commit history.

---

### Need Help?
If you can't find what you're looking for, check the **[Troubleshooting](../operations/troubleshooting.md)** page or join our **[Discord](https://discord.gg/pHcstaPThK)** community.