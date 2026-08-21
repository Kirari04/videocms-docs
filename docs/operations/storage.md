---
lang: en-US
title: Storage Pools
description: Add storage mounts, route uploads, and safely migrate existing videos between pools.
---

# Storage Pools

VideoCMS always includes its built-in local storage. Administrators can add multiple S3-compatible or SFTP mounts in **Administration → Storage**, group mounts into upload pools, choose the instance default pool, and optionally assign a different pool to an individual user.

Each file plays from exactly one active mount. Storage migrations can retain a temporary or administrator-selected original copy, but they are not a backup or replication system. Backups and ongoing replication remain the responsibility of your storage infrastructure.

## Upgrade an existing installation

No manual database or media migration is required. On startup, VideoCMS automatically:

- creates the storage mount and pool tables;
- registers the existing media directory as the built-in `local` mount;
- creates a built-in local upload pool and selects it as the default when no other default exists; and
- marks existing file records as available and assigns legacy records without a storage ID to `local`.

Existing files remain at their current paths. Adding remote storage does not move them, and changing the default pool only affects new uploads. Use a storage migration when existing videos should move to another pool.

## Configure credential encryption

Remote storage credentials cannot be saved until `StorageEncryptionKey` is present in the server environment. Generate a 32-byte key:

```bash
openssl rand -base64 32
```

Pass it to the VideoCMS container or process, preferably through an environment file or secret manager:

```yaml
services:
  videocms:
    environment:
      StorageEncryptionKey: "${StorageEncryptionKey}"
```

Restart VideoCMS after adding the key. Keep it with the installation's other secrets and backups: it is needed to read the encrypted credentials saved in the database. It is not required for installations that only use local storage.

If the key is lost or intentionally changed, the stored files remain intact but VideoCMS cannot decrypt the saved credentials. Set a valid new key, restart the service, edit each affected mount to enter its credentials again, then mount and reconnect it.

## Add an S3-compatible mount

Open **Administration → Storage**, select **Add storage mount**, choose **S3-compatible**, and enter:

- a display name;
- bucket and region;
- an optional endpoint and path-style mode for providers such as MinIO;
- an optional object prefix; and
- an access key ID and secret access key, or leave all credential fields empty to use the server's AWS credential provider chain.

The bucket must already exist. VideoCMS checks the connection before saving the mount. A typical storage policy needs permission to list the bucket and to get, put, and delete objects below the configured prefix, including multipart-upload operations.

While a mount is connected, its display name, credentials, and upload tuning can be changed. Detach it before changing the bucket, region, endpoint, prefix, or path-style mode. This prevents files from silently pointing at a different object namespace.

## Add an SFTP mount

SFTP is a good fit when your storage provider gives you an SFTP account and a writable folder instead of an object-storage API. This works with standard SFTP servers and hosted storage boxes without provider-specific setup. Before adding the mount, prepare:

- the SFTP hostname, port, and username;
- an existing remote folder dedicated to VideoCMS;
- either the account password or a private key accepted by the server; and
- if available, the server's SHA256 host key fingerprint from your provider or server administrator.

The SFTP account must be allowed to list the remote folder and create, read, rename, and delete files and subfolders inside it. It does not need access to the rest of the server. A dedicated account and folder make permissions and backups easier to reason about.

### Verify the server identity

The fingerprint identifies the server before VideoCMS sends credentials. After you enter the host and port, select **Fetch host key**. VideoCMS connects only far enough to read the presented key; it does not send the SFTP username, password, or private key. Review the fingerprint and select **Trust this host key** to add it to the mount.

A first connection cannot prove that the presented key belongs to the intended server. When possible, compare it with the fingerprint in your provider's control panel or documentation, or ask the server administrator. On a server you control, an administrator can print the Ed25519 host key fingerprint with:

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub -E sha256
```

Compare the value beginning with `SHA256:`. If it matches, trust the key shown in VideoCMS. You can also expand **Add a verified fingerprint manually** and paste a value supplied by your provider.

VideoCMS can trust multiple fingerprints. This makes host-key rotation possible without downtime: add the new fingerprint while the old key is still active, rotate the server key, verify the mount, then remove the old fingerprint.

### Choose authentication

Use **Password** when the storage account is password-based. Use **Private key** when the provider accepts SSH keys; paste the complete private key and, if applicable, its passphrase. The private key and passphrase are encrypted with `StorageEncryptionKey` before they are saved and are never returned by the API.

If you need a dedicated key pair, generate one on a trusted machine and install only its `.pub` file on the SFTP account:

```bash
ssh-keygen -t ed25519 -f ./videocms-sftp -C "videocms storage"
```

Keep the private `videocms-sftp` file secret. The server or provider receives `videocms-sftp.pub`; the VideoCMS form receives the private key.

### Connect the mount

Open **Administration → Storage**, select **Add storage mount**, choose **SFTP**, and enter:

- a display name;
- the host and port, usually port `22`;
- the SFTP username;
- the remote folder, such as `videocms` or `/home/media/videocms`;
- the selected password or private-key credentials.

Select **Fetch host key**, compare the fingerprint when possible, and explicitly trust it. Then select **Test connection**. VideoCMS checks that the remote folder exists and that a small test file can be created, safely replaced, read, and removed. This also verifies the server's rename behavior before real uploads can be retried or replaced. The test does not save the mount, so you can correct settings and repeat it safely.

When the test succeeds, select **Add mount**. VideoCMS repeats the connection check while saving so an untested or changed configuration cannot be mounted accidentally. The mount is not saved if that final check fails.

While an SFTP mount is connected, you can change its display name, credentials, authentication method, or trusted fingerprints. Detach it before changing the host, port, username, or remote folder. Changing those fields points at a different file namespace, even if the new server contains a copy of the same data.

### Troubleshoot an SFTP connection

Common errors usually point to one of these setup problems:

- **Host key mismatch:** compare the received fingerprint in the error with the trusted value from your provider or server. Update the saved value only after independently confirming an intentional key rotation.
- **Authentication failed:** confirm the username and password, or verify that the matching public key is installed for the account. For encrypted private keys, also check the passphrase.
- **Folder not found:** use the path as the SFTP account sees it. A restricted account may start in its own home folder and may not see the server's full filesystem path.
- **Permission or storage check failed:** confirm the account can create folders and can create, rename, read, and delete files below the selected folder. Also check free space and quota.
- **Safe replacement is not supported:** the SFTP server must support atomic replacement through the OpenSSH `posix-rename@openssh.com` extension or equivalent overwrite behavior. VideoCMS refuses to delete the old file first because a failed follow-up rename could otherwise lose known-good media.
- **Timeout or connection refused:** confirm the host and port are reachable from the VideoCMS container or server and that outbound SSH traffic is allowed by your firewall.

After correcting the server or network, use **Check connection** on a connected mount. For a detached mount, update its settings if needed and select **Mount**.

## Route new uploads

Create a pool with one or more mounts and make it the instance default, or choose a pool on an individual user's admin form. For each new file, VideoCMS orders the available members by the number of bytes currently tracked on the mount and writes to the least-used member. Ties are deterministic. If a write fails, it tries the next available member.

Pool changes never move existing files. The selected mount ID is stored on the file record and is used for later reads, encoding outputs, and deletion.

## Add a read cache to a pool

A read cache can reduce repeated reads and provider egress from remote primary storage. This is especially useful when S3-compatible storage is authoritative but the VideoCMS host has inexpensive local disk available.

Edit a storage pool, select one or more mounts under **Read cache**, and set a maximum cache size for each. The built-in local storage mount can be selected as a cache for another pool even though it remains the primary storage of the built-in local pool.

Read caches are intentionally disposable:

- the cache starts empty and fills only when media is played;
- the first uncached playback still reads from the primary mount;
- repeated playback can use the cached copy;
- VideoCMS removes least-recently-used copies as the configured limit approaches; and
- when a mount reports its capacity, VideoCMS also tries to preserve at least 10% free space for the host and other applications.

Only media requested by a viewer is considered for caching; VideoCMS does not scan or prefill the library. When a player uses a range request, seeks, or disconnects after beginning an uncached object, VideoCMS finishes that requested object independently and adds the verified copy to the read cache. This makes later playback reliable without turning the cache into a full-library backfill.

The file's primary mount remains authoritative at all times. A full, detached, or unavailable cache falls back to primary storage and does not make the video unavailable. Removing a read cache from a pool also does not delete or move the primary copy.

Set the cache limit below the amount of disk you can safely dedicate to playback. The 10% free-space protection is an additional safeguard, not a substitute for reserving enough space for the operating system, temporary uploads, encoding, logs, and backups.

If a cache transfer fails, VideoCMS retries it as an administrator-visible background job. Open **Background jobs** to see its attempts and error details. Successful on-demand cache fills stay out of the job list to avoid routine playback noise. Scheduled cache maintenance appears under **Queues & schedules**.

### Check whether the cache is helping

The **Delivery traffic** section on **Administration → Storage** shows the last 30 days of playback bytes and requests served from primary storage versus read cache. Each pool shows its cache share, and the mount table shows the traffic that actually reached each backend. A cache hit is counted against the cache mount; a miss is counted against the primary mount.

These counters can lag playback by a few seconds because VideoCMS saves delivery activity in small batches to keep the database responsive during busy playback. If a batch cannot be saved, the Storage page shows a warning while VideoCMS keeps the activity in memory and retries it; video delivery itself is unaffected. Delivery history older than 90 days is removed automatically.

For a single media request, browser developer tools can inspect the `X-VideoCMS-Cache` response header. `FILLING` means the response came from primary storage and an on-demand cache fill is in progress; `HIT` means the response came from a read cache. `MISS` means no usable cached copy was available, while `BYPASS` means the requested file is not routed through a pool with a read cache.

Storage attribution begins after upgrading to a version that provides these figures. Older traffic is left unassigned instead of being estimated, and VideoCMS does not scan or prefill existing media to produce the statistics.

## Migrate existing videos between pools

Open **Administration → Storage → Migrations** when existing videos need to move from one pool to another. A migration takes a fixed snapshot of the currently available videos on the source pool and assigns each one to a healthy destination mount.

The migration is designed to keep videos available throughout the move:

1. the video continues playing from its source mount while VideoCMS copies it;
2. VideoCMS performs a final sync and verifies the complete destination copy;
3. the database switches that video to the destination in one operation; and
4. only after every video has switched does a 24-hour original-retention period begin.

Partially copied data is never selected for playback. Videos switch one at a time, so a large migration does not wait for every copy before using completed destinations.

### Prepare for a migration

Before starting, make sure:

- the source and destination are different pools and do not share any mounts;
- every mount in both pools is connected and healthy;
- the destination has enough free space for the amount shown in the preview;
- provider quotas and object or file-count limits will not be exceeded; and
- the VideoCMS host can reach both sides for the entire migration.

VideoCMS reports the number of videos, tracked bytes, planned destination placement, and important routing warnings before it starts. It cannot reliably detect every provider quota, so compare the preview with the capacity reported by your storage provider.

Start the migration from the preview you just reviewed. If videos, mounts, sizes, or destination placement change before confirmation, VideoCMS refuses the stale plan and asks you to preview again. Retrying the Start button after a lost or timed-out response is safe: the same request returns the migration that was already created instead of creating a duplicate.

Copies travel through the VideoCMS server. When moving between two remote providers, plan for inbound and outbound bandwidth on the host as well as any provider egress charges. Keep both mounts connected until the migration and its original cleanup have finished.

Starting a migration does not change the default upload pool or any per-user pool assignment. New uploads and videos created after the snapshot are not added to the running migration.

### Monitor and control the migration

The migration detail page shows overall progress and the copy, verification, active mount, and original-cleanup state of every video. The same work also appears in **Background jobs**, with its event and attempt history.

- **Pause** stops at a safe checkpoint. Already-switched videos continue playing from the destination, while the others continue playing from the source. **Resume** reuses destination objects that were already copied and verified.
- **Cancel** leaves already-switched videos on the destination and unfinished videos on the source. VideoCMS removes unreferenced partial destination data in a separate cleanup job and retains the source originals of switched videos.
- **Retry** after reconnecting a mount or correcting capacity, permission, or network problems. The migration keeps its previous history and resumes its fixed placement rather than creating a second migration.
- **Cancel migration** is also available after the main job fails, so you can release its reservations instead of retrying. The same safe cancellation cleanup applies.

Avoid manually moving, renaming, or deleting files on either storage system while a migration is active. VideoCMS blocks mount and pool changes that would invalidate the migration, but it cannot protect against changes made directly through a provider's control panel or filesystem.

### Original cleanup

After every video has switched successfully, VideoCMS waits 24 hours before deleting originals from the source. Playback already uses the destination during this period. The delay gives you time to inspect the result and choose **Keep originals** if you want to retain the remaining source copies.

After checking playback, an administrator can choose **Start cleanup now** to skip the remaining retention time. The same safety checks still apply; only the wait is skipped.

Original cleanup is a separate background job. It can be paused or canceled, and it only deletes a source copy when the matching video still points to the expected destination. Cleanup finishes the current video before stopping, so one video's original is never intentionally left half-deleted by a pause or cancel. If cleanup has already started, **Keep originals** preserves what remains but cannot restore originals already removed.

If the storage provider itself fails partway through deleting a video's objects, the detail page marks that original as **Original may be incomplete**. Inspect that source folder in the provider before treating it as a usable retained copy.

A migration is complete only after original cleanup finishes, or when an administrator chooses to keep the remaining originals. Retained originals are unmanaged duplicate data: include them in capacity planning and remove them manually only after confirming that playback and backups use the intended destination.

### Troubleshoot a migration

- **Preflight refuses to start:** connect every pool member, remove any mount overlap, and finish or cancel another migration that includes the same videos.
- **A copy repeatedly fails:** check destination capacity and quota, credentials, SFTP permissions or S3 policy, and network reachability from the VideoCMS host.
- **The job is paused:** reconnect any unavailable mount before resuming. A service restart does not discard the checkpoint.
- **Cleanup is waiting:** the 24-hour retention period may still be active. Check the scheduled time on the migration page.
- **A mount cannot be detached, edited, or deleted:** finish the active migration and its cleanup first. After cancellation or a decision to retain originals, VideoCMS keeps the mount protected until the original retention time has elapsed.

## Detach and reconnect a mount

Any additional mount can be detached even when it owns files. Detaching:

- removes the mount from new upload placement and runtime reads;
- marks its active files as unavailable;
- keeps the mount identity, encrypted configuration, pool membership, and file records; and
- does not delete or move files in the connected storage.

Unavailable files remain visible in the library, but playback and export are disabled until their storage is reconnected.

### Permanently remove a mount

After detaching a mount, you can select **Delete mount** to remove it from VideoCMS. This permanently deletes the saved mount configuration, encrypted credentials, and upload-pool memberships. It does not delete or change any files in the connected storage.

File records that belonged to the deleted mount remain unavailable in VideoCMS. To recover them later, add a mount that points to the matching storage location and run **Scan and reconnect files**. Before deleting a mount, check the confirmation for upload pools that will be left without a member and update those pools before routing new uploads to them.

To reconnect the same storage, select **Mount**. To move to replacement storage, detach the mount, preserve the same per-file paths below the configured prefix or remote folder, update the mount, and connect it again. VideoCMS validates the expected files before relinking a file record; an empty directory is not enough to count as a match.

The **Scan and reconnect files** action can preview matches before applying them. Scans use bounded concurrency and apply results in batches, so retrying after an interruption safely resumes the remaining work. Connecting a brand-new mount also scans for records whose previous mount is unavailable.

Relinking updates database records only. It never copies, modifies, or deletes stored files.
