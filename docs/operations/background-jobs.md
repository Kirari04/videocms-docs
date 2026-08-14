---
lang: en-US
title: Background Jobs
description: Monitor and troubleshoot uploads, downloads, encoding, and maintenance work.
---

# Background Jobs

VideoCMS handles uploads, remote downloads, encoding, deletions, and routine maintenance in the background. This keeps the application responsive while longer operations continue safely.

Background work is durable. Queued and running jobs are preserved when VideoCMS restarts, and interrupted work is recovered automatically where it is safe to do so.

## View your jobs

Every user can open **Jobs** from the account panel. This page shows uploads, remote downloads, deletions, and media processing owned by the signed-in account.

Select a job to view:

- its current step and overall progress;
- the tasks that make up the operation;
- previous attempts and readable error messages; and
- a timeline of important state changes.

Recent jobs load first. Use **Load older jobs** to inspect additional history.

## Use the administrator task center

Administrators can open **Background jobs** to inspect work across the entire installation. The task center provides:

- filtering by status, queue, owner, or search text;
- detailed task attempts and redacted diagnostics;
- controls to cancel or retry eligible jobs and tasks;
- queue capacity and pause controls;
- maintenance schedules that can be run manually; and
- health information for supervised background services.

Pausing a queue prevents new work in that queue from starting. It does not interrupt work that is already running. Resume the queue when you are ready for waiting jobs to continue.

## Understand job states

| State | Meaning |
| --- | --- |
| **Queued** | The job is waiting for capacity. |
| **Running** | At least one task is currently active. |
| **Retry scheduled** | A temporary problem occurred and VideoCMS will try again automatically. |
| **Canceling** | Cancellation was requested and active work is stopping at a safe point. |
| **Completed** | All required and optional work completed successfully. |
| **Completed with warnings** | The main result is usable, but optional processing such as a thumbnail or encoding failed. |
| **Failed** | Required work could not be completed. Open the job for its error and attempt history. |
| **Canceled** | The job stopped before completion. |

A running job can briefly report that it is finalizing and hide the cancel action. At this point VideoCMS is publishing a result or completing another step that must not be interrupted. Allow it to finish rather than restarting the service.

## Cancel or retry work

Use **Cancel** when an operation is no longer needed. Queued work stops immediately. Running work stops at the next safe point, so cancellation may not appear instantaneous.

VideoCMS hides the cancel action after a job enters a final step that cannot be interrupted safely. This prevents a successful file operation from being reported as canceled or left partially recorded.

Use **Retry** after correcting the cause of a failed or canceled job. A retry keeps the previous attempt history, making it possible to compare the new run with the original failure.

Some temporary failures retry automatically before user action is required. Wait for the scheduled retry unless the underlying problem needs immediate attention.

## Configure capacity

VideoCMS limits concurrent work so background processing does not overwhelm the host.

| Queue | Work | Capacity |
| --- | --- | --- |
| `ffmpeg` | Encoding, thumbnails, and prepared downloads | `MaxParallelFFmpegTasks` |
| `network` | Remote downloads | `MaxParallelDownloads` |
| `storage` | Imports and deletions | 2 |
| `maintenance` | Cleanup and reconciliation | 1 |
| `audit` | API-key audit records | 1 |

If interactive use becomes slow during encoding, lower `MaxParallelFFmpegTasks`. Increase it only when the server has enough CPU, memory, and disk throughput. The queue view shows active and waiting counts so you can confirm whether capacity is the bottleneck.

## Troubleshoot common problems

### A job stays queued

Open the administrator task center and check:

1. whether its queue is paused;
2. whether all available capacity is occupied by other jobs;
3. whether the background runtime and supervised services report healthy; and
4. whether the feature required by the job is enabled.

Queued jobs continue automatically when capacity becomes available or the queue is resumed.

### A job is retrying repeatedly

Open its details and compare the attempt errors. Common causes include:

- a remote server that is unavailable or rate-limiting downloads;
- insufficient local disk space;
- an unavailable storage mount;
- invalid media that FFmpeg cannot process; or
- filesystem permissions that prevent VideoCMS from reading or writing media.

Fix the underlying problem before using a manual retry.

### A job failed after a restart

Most interrupted tasks return to the queue automatically. A task that had already started finalizing may instead fail for review because repeating it could create a duplicate or inconsistent result.

Inspect the job timeline and confirm whether its output already exists before retrying. If the failure involves unavailable storage, reconnect the mount first. See [Storage Pools](/operations/storage).

### A job says completed with warnings

The primary operation succeeded, so the uploaded or downloaded video should be available. Open the job to identify the optional task that failed, correct the cause, and retry the job or task if the missing output is needed.

### Cancellation takes a while

Cancellation waits for a safe stopping point. Large file transfers and FFmpeg processes may take a short time to shut down and clean up temporary files. Avoid repeatedly restarting VideoCMS while the job is canceling.

## Maintenance and history

VideoCMS schedules cleanup, reconciliation, expiry, and retention work automatically. Administrators can inspect recent outcomes and run a schedule immediately from **Queues & schedules**.

Job history is retained for 30 days. Successful API-audit background jobs are retained for 24 hours because their audit records have a separate retention policy.

## Upgrade from an older release

Before upgrading to a release that introduces the unified background-job system:

1. stop the old VideoCMS process;
2. back up the SQLite database;
3. deploy the new release; and
4. allow VideoCMS to complete its startup migration before starting additional instances.

The migration imports active uploads, remote downloads, prepared downloads, and encoding work, along with recent history. Work that was active when the old process stopped is recovered and queued again when safe. If startup is interrupted, the migration can resume on the next start.

After the upgrade, open **Background jobs** and confirm that the runtime is healthy, queues are not unexpectedly paused, and existing active work appears in the list.
