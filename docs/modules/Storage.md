## Storage (`IFileStorage`, `SupabaseFileStorage`, `LocalFileStorage`, `IImageProcessor`, `ImageProcessor`)

### Purpose
Provides content-addressed image processing and private object storage for lesson media (`S2-T02`), ensuring uploaded vocabulary pictures are validated by magic bytes, bounded to `<= 2 MB`, scaled to at most `800px` in their largest dimension, normalized into a WebP container (`vocab/{sha256}.webp`), deduplicated by SHA-256 hash, and served exclusively via short-lived signed URLs after server-side authorization (`TC-34`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `inputStream` | `Stream` | Raw uploaded image stream (`PNG`, `JPEG`, or `WebP`) |
| `declaredLength` | `long?` | Optional declared byte length (`<= 2 MB`) |
| `objectKey` | `string` | Relative storage key (e.g., `vocab/{sha256}.webp`), validated against path traversal |
| `ttl` | `TimeSpan` | Time-to-live for signed read URLs (default `15 minutes`) |

**Returns:** `ProcessedImageResult` (`{ Content, ContentType, Sha256Hex, ObjectKey, Width, Height }`) from `IImageProcessor.ProcessImageAsync`; `SignedMediaUrlDto` (`{ ImageKey, Url, ExpiresAt }`) from `IFileStorage.CreateSignedReadUrlAsync`.

### Prerequisites / Context
- **Magic-Byte Validation:** Rejects files lacking valid PNG (`89 50 4E 47 0D 0A 1A 0A`), JPEG (`FF D8 FF`), or RIFF WebP (`RIFF....WEBP`) headers regardless of file extension.
- **Size & Complexity:** Stream reading is bounded at `2 MB` (`MaxImageBytes = 2,097,152`), giving $O(B)$ time and memory where $B \le 2\text{ MB}$.
- **Deduplication:** Identical normalized images produce the same `vocab/{sha256}.webp` key; `UploadIfNotExistsAsync` skips redundant writes.
- **Signed URLs:** `SupabaseFileStorage` uses the server-side `Supabase:ServiceRoleKey` against the private bucket (`lesson-media` by default) to mint short-lived signed URLs; `LocalFileStorage` signs URLs with `HMAC-SHA256` (`exp` + `sig`) and verifies constant-time signatures via `TryValidateSignedUrl`.

