---
lang: en-US
title: Storage Pools
description: Add S3-compatible storage, route uploads, and reconnect moved media.
---

# Storage Pools

VideoCMS always includes its built-in local storage. Administrators can add multiple S3-compatible mounts in **Administration → Storage**, group mounts into upload pools, choose the instance default pool, and optionally assign a different pool to an individual user.

Each file lives on exactly one mount. VideoCMS does not replicate objects between mounts; backups and replication remain the responsibility of your storage infrastructure.

## Upgrade an existing installation

No manual database or media migration is required. On startup, VideoCMS automatically:

- creates the storage mount and pool tables;
- registers the existing media directory as the built-in `local` mount;
- creates a built-in local upload pool and selects it as the default when no other default exists; and
- marks existing file records as available and assigns legacy records without a storage ID to `local`.

Existing files remain at their current paths. Adding remote storage does not move them, and changing the default pool only affects new uploads.

## Configure credential encryption

Remote-adapter credentials cannot be saved until `StorageEncryptionKey` is present in the server environment. Generate a 32-byte key:

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

Restart VideoCMS after adding the key. The key encrypts adapter credentials in the database using AES-256-GCM. Keep it with the installation's other secrets and backups. It is not required for installations that only use local storage.

If the key is lost or intentionally changed, the objects remain intact but VideoCMS cannot decrypt the saved credentials. Set a valid new key, restart the service, edit each affected mount to enter its credentials again, then mount and reconnect it.

## Add an S3-compatible mount

Open **Administration → Storage**, select **Add S3 mount**, and enter:

- a display name;
- bucket and region;
- an optional endpoint and path-style mode for providers such as MinIO;
- an optional object prefix; and
- an access key ID and secret access key, or leave all credential fields empty to use the server's AWS credential provider chain.

The bucket must already exist. VideoCMS checks the connection before saving the mount. A typical storage policy needs permission to list the bucket and to get, put, and delete objects below the configured prefix, including multipart-upload operations.

While a mount is connected, its display name, credentials, and upload tuning can be changed. Detach it before changing the bucket, region, endpoint, prefix, or path-style mode. This prevents files from silently pointing at a different object namespace.

## Route new uploads

Create a pool with one or more mounts and make it the instance default, or choose a pool on an individual user's admin form. For each new file, VideoCMS orders the available members by the number of bytes currently tracked on the mount and writes to the least-used member. Ties are deterministic. If a write fails, it tries the next available member.

Pool changes never move existing files. The selected mount ID is stored on the file record and is used for later reads, encoding outputs, and deletion.

## Detach and reconnect a mount

Any additional mount can be detached even when it owns files. Detaching:

- removes the mount from new upload placement and runtime reads;
- marks its active files as unavailable;
- keeps the mount identity, encrypted configuration, pool membership, and file records; and
- does not delete or move objects in the bucket.

Unavailable files remain visible in the library, but playback and export are disabled until their storage is reconnected.

To reconnect the same bucket, select **Mount**. To move to a replacement bucket or endpoint, detach the mount, preserve the same per-file object paths below the configured prefix, update the mount, and connect it again. VideoCMS validates persisted source and completed output-manifest objects before relinking a file record. It does not treat an empty UUID-shaped directory as a match.

The **Scan and reconnect files** action can preview matches before applying them. Scans use bounded concurrency and apply results in batches, so retrying after an interruption safely resumes the remaining work. Connecting a brand-new mount also scans for records whose previous mount is unavailable.

Relinking updates database records only. It never copies, modifies, or deletes objects.
