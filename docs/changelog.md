---
lang: en-US
title: Changelog & Versioning
description: Release notes and versioning strategy for VideoCMS.
---

# Changelog & Versioning

[[toc]]

## Current Status: Alpha 🚧

VideoCMS is currently in an **Experimental Alpha** state.

*   **Current Version:** v0.0.9 (See `VERSION.txt` in the repository root)
*   **Docker Tag:** `kirari04/videocms:alpha`
*   **Stability:** Active development. Features are added rapidly.
*   **API & UI:** Subject to change, but we track major milestones with semantic versioning.

## Release Strategy

VideoCMS uses **Semantic Versioning** (vX.Y.Z) to track milestones even during the alpha stage.

### Version Check
The admin panel includes a built-in version check feature. On the **System Analytics** page, administrators will see:
*   The current version of the backend.
*   An alert if a new version is available on GitHub.

### What to expect

1.  **Breaking Changes:** While we use semantic versions, the `alpha` tag still receives frequent updates. If a major breaking change occurs, we may transition from the `alpha` tag to `beta` as the project approaches stability.
2.  **Continuous Updates:** The `alpha` Docker image is rebuilt frequently. Use the [Upgrade Guide](./upgrade-guide.md) to stay up to date.

## Future Roadmap

As the application stabilizes, we will introduce new release channels:

*   **Beta:** Feature complete but needs testing. API structure will be frozen.
*   **Stable (v1.0):** Production-ready. Strict Semantic Versioning will be enforced.

## Recent Updates

> Check the [GitHub Commits](https://github.com/Kirari04/videocms/commits/master) for a live feed of changes.
