---
lang: en-US
title: Changelog & Versioning
description: Release notes and versioning strategy for VideoCMS.
---

# Changelog & Versioning

<script setup>
import { ref, onMounted } from 'vue'

const remoteVersion = ref('loading...')
const commits = ref([])
const loadingCommits = ref(true)

onMounted(async () => {
  try {
    const vRes = await fetch('https://raw.githubusercontent.com/Kirari04/videocms/refs/heads/master/VERSION.txt')
    const text = await vRes.text()
    remoteVersion.value = text.trim()
  } catch (e) {
    remoteVersion.value = 'v0.0.9'
  }

  try {
    const [coreRes, frontendRes] = await Promise.all([
      fetch('https://api.github.com/repos/Kirari04/videocms/commits?per_page=5'),
      fetch('https://api.github.com/repos/Kirari04/videocms-frontend/commits?per_page=5')
    ])
    
    let allCommits = []
    
    if (coreRes.ok) {
      const coreCommits = await coreRes.json()
      allCommits.push(...coreCommits.map(c => ({ ...c, repo: 'core' })))
    }
    
    if (frontendRes.ok) {
      const frontendCommits = await frontendRes.json()
      allCommits.push(...frontendCommits.map(c => ({ ...c, repo: 'frontend' })))
    }
    
    // Sort combined commits by date (newest first) and take top 8
    commits.value = allCommits
      .sort((a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date))
      .slice(0, 8)
      
  } catch (e) {
    console.error('Failed to fetch commits:', e)
  } finally {
    loadingCommits.value = false
  }
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

## Current Status: Beta 🚧

VideoCMS is currently in its **Beta** phase.

*   **Current Version:** <span style="background-color: var(--vp-c-brand-1); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.9em; font-weight: bold; font-family: var(--vp-font-family-mono);">{{ remoteVersion }}</span>
*   **Docker Tag:** `kirari04/videocms:beta`
*   **Stability:** Active development. Features are added rapidly.
*   **API & UI:** Subject to change, but we track major milestones with semantic versioning.

## Recent Updates

### Unreleased

No user-facing changes are currently documented after v0.1.12.

### v0.1.12 — 2026-09-03

- Added provider-neutral media storage with a built-in local mount, administrator-managed S3-compatible and SFTP mounts, upload pools, per-account routing, encrypted remote credentials, detach/remount health checks, and safe file reconnection.
- Added resumable whole-pool and account-scoped storage migrations with fixed preflight plans, verified copies, per-video atomic cutover, pause/resume/cancel/retry controls, and guarded source cleanup after a 24-hour retention window.
- Added optional on-demand read caches with origin fallback, verified cache fills, LRU and free-space eviction, background repair visibility, and primary-versus-cache delivery charts in System Stats.
- Replaced separate long-running workers with one durable background-job runtime for uploads, imports, remote downloads, encoding, thumbnails, prepared downloads, deletions, migrations, cache work, auditing, and maintenance.
- Added user job progress and an administrator task center with attempt history, redacted diagnostics, queue controls, schedules, supervised-service health, pause checkpoints, retry classification, and restart recovery.
- Batched delivery accounting away from the SQLite request path and added storage-attributed traffic retention and failure visibility.
- Improved encoder lifecycle reliability, migration diagnostics, storage cleanup safety, and cache behavior for legacy media generations.
- Stopped persisting packaged frontend assets in `/app/public`, preventing stale frontend files from surviving image upgrades.
- Updated Go, frontend, and AWS SDK dependencies.

The database and local-media upgrade is automatic. Configure `StorageEncryptionKey` only when using remote mounts, preserve that key in backups, and ensure `StorageScratchDir` has enough temporary capacity for remote processing. See the [Upgrade Guide](/operations/upgrade) for the release checklist.

### v0.1.11 — 2026-07-30

- Added persistent, deduplicated public download preparation jobs with queue position, FFmpeg progress, best-effort ETA, restart recovery, six-hour artifact retention, and Range delivery.
- Added configurable MP4 or MKV downloads with quality, audio, and subtitle selection without re-encoding.
- Split delivery statistics into player and prepared-file download traffic while preserving combined totals.
- Added admin limits for preparation concurrency, queue size, and artifact retention.
- Replaced the website builder with simpler Markdown or sanitized HTML pages and refreshed the dashboard, library, uploader, and CAPTCHA interface.
- Removed the synchronous attachment endpoint; progressive MP4 playback is unchanged.

The following are the latest changes across the core and frontend repositories:

<div v-if="loadingCommits">
  <p>Loading latest changes from GitHub...</p>
</div>
<div v-else-if="commits.length > 0">
  <ul style="list-style: none; padding-left: 0;">
    <li v-for="commit in commits" :key="commit.sha" style="margin-bottom: 0.8rem; display: flex; align-items: baseline; gap: 8px;">
      <code style="font-size: 0.85em; white-space: nowrap;">{{ formatDate(commit.commit.author.date) }}</code>
      <span :style="{ 
        fontSize: '0.7em', 
        textTransform: 'uppercase', 
        padding: '1px 5px', 
        borderRadius: '4px', 
        border: '1px solid currentColor',
        opacity: 0.8,
        minWidth: '65px',
        textAlign: 'center'
      }">
        {{ commit.repo }}
      </span>
      <a :href="commit.html_url" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        {{ commit.commit.message.split('\n')[0] }}
      </a>
    </li>
  </ul>
</div>
<div v-else>
  <p>Unable to load recent commits. Please check the repositories directly.</p>
</div>

> Check the [Core](https://github.com/Kirari04/videocms/commits/master) and [Frontend](https://github.com/Kirari04/videocms-frontend/commits/main) repositories for full history.

## Release Strategy
