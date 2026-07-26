# Firebase backup prerequisite evidence

**Project alias found in source:** `tourvir-fd341`

**Audit date:** 2026-07-26

**Result:** backup not performed; Phase 1 exit gate blocked

## Tool/credential audit

| Prerequisite | Available in audit environment |
|---|---|
| Firebase CLI | No |
| Google Cloud CLI | No |
| Node runtime | No |
| `GOOGLE_APPLICATION_CREDENTIALS` | No |
| `FIREBASE_TOKEN` | No |
| Committed Firestore rules | No |
| Committed Storage rules | No |
| Committed Firestore indexes | No |

`.firebase/hosting..cache` exists but is only a Hosting deployment cache. It does not contain a verified Firestore/Storage export.

## Safety decision

The browser Firebase API key is public configuration and was not used to enumerate contacts, inquiries or feedback. Attempting to read personal data through possibly permissive public rules would be a security test/data extraction, not an authorized backup. No private Firebase data was downloaded into the Git workspace.

## Required authorized completion

An owner with appropriate Google Cloud/Firebase access must:

1. Identify the authoritative Firebase project and data locations.
2. Create a managed Firestore export to an access-controlled backup bucket, or use another approved export method.
3. Inventory/export Firebase Storage gallery objects while preserving object names, metadata and checksums.
4. Record collection/object counts without committing personal records or signed URLs.
5. Test restoration into an isolated non-production project/bucket.
6. Record backup location, timestamp, retention, encryption/access controls, restore result and responsible owner in a non-public operational record.
7. Add only a redacted verification receipt here; never commit customer data or credentials.

## Redacted completion receipt

```text
Status: pending
Authorized owner:
Source project verified:
Firestore export timestamp/location reference:
Storage export timestamp/location reference:
Counts/checksums verified:
Isolated restore test:
Retention/access reviewed:
```

Until this receipt is approved, Phase 1 must not be marked complete and destructive data migration/cleanup must not begin.
