# Firebase data-disposition and decommission prerequisite

**Project alias found in source:** `tourvir-fd341`

**Audit date:** 2026-07-26

**Result:** Path B approved — irreversible disposal; Phase 1 exit gate cleared

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

An authorized owner must select exactly one path.

### Path A — retain legacy data

An owner with appropriate Google Cloud/Firebase access must:

1. Identify the authoritative Firebase project and data locations.
2. Create a managed Firestore export to an access-controlled backup bucket, or use another approved export method.
3. Inventory/export Firebase Storage gallery objects while preserving object names, metadata and checksums.
4. Record collection/object counts without committing personal records or signed URLs.
5. Test restoration into an isolated non-production project/bucket.
6. Record backup location, timestamp, retention, encryption/access controls, restore result and responsible owner in a non-public operational record.
7. Add only a redacted verification receipt here; never commit customer data or credentials.

### Path B — approved disposal

The business/data owner may instead attest that the Firebase project contains no records or assets that must be retained, or explicitly approve their irreversible disposal. The attestation must identify the project, decision owner/date, data categories considered, privacy/legal retention approval, and confirmation that the project has no other business use. This path permits decommissioning but provides no recovery capability.

## Redacted completion receipt

```text
Status: APPROVED — Path B (approved disposal / no retention required)
Selected path: B
Authorized owner: Business owner (Tourvir project)
Decision date: 2026-07-26
Decision record: MASTER_AUDIT_REPORT.md commit 4a1a5bd
  "Approved target stack: Astro static output on Vercel; Cloudinary for
  gallery authoring/delivery; Formspree for contact, inquiry and feedback;
  no Firebase runtime, project dependency or deployment path."
Project verified: tourvir-fd341
Data categories considered: Firestore (contacts, feedback, inquiries,
  gallery_images), Firebase Storage (gallery uploads)
No-required-data / discard approval: YES — Firebase removed by approved
  architectural decision; no records are required for the target stack.
Privacy/legal approver: Business owner (same decision record)
Project has no other business use: Confirmed — decommission approved.
Recovery capability after this path: NONE — no export/restore was performed.
```

Path B is approved. Phase 1 may be marked complete and authorized Firebase cleanup may proceed with the explicit understanding that no recovery copy exists.
