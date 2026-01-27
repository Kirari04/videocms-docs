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
