# SONGS Protocol × Arweave/AR.IO  
## Milestone M4 – ARNS‑Powered Artist Sites

---

### 1. Essentials
| Field | Data |
|-------|------|
| Period | Month 1 → 2 (parallel to M1) |
| Goal | Auto‑generate & deploy static artist microsites on Arweave, resolving at `artist.songs.ar`. |

---

### 2. Site Generator Plan
- **Stack**: **Astro** (islands), **TailwindCSS**, **Lucide‑react** icons.  
- Reads artist metadata from **ArFS** JSON (`profile.json`, `discography.json`).  
- Inlines **audio player** w/ adaptive HLS (signed URLs).  
- CLI command:  

```bash
songs-site build ./artist-data
songs-site deploy ./dist --wallet ~/.arconnect.json --ar-name djlofi.songs.ar
```

---

### 3. Task Breakdown

| # | Task |
|---|------|
| 1 | Astro template & components |
| 2 | CLI (build / deploy) |
| 3 | ArNS registration wrapper |
| 4 | Simple analytics pixel (Warp write) |
| 5 | Three themes (classic / dark / neon) |
| 6 | On‑boarding docs + Loom |
| 7 | Beta rollout (20 artists) |

---

### 4. Deliverables
- `packages/songs-site-cli` published on npm.  
- Themes stored on Arweave; TXIDs listed in README.  
- Demo video `artist-sites-demo.mp4` (Arweave).  
- 20 live sites resolving via ArNS.

---

### 5. Acceptance Tests
| Test | Tool | Pass |
|------|------|------|
| Deploy script ≤ 30 s | Shell timer | ✅ |
| ArNS resolution across 3 gateways | Curl | ✅ |
| Lighthouse score ≥ 90 | CI | ✅ |

---

### 6. Risks & Mitigations
| Risk | Level | Mitigation |
|------|-------|------------|
| ArNS Tx stuck | Medium | Retry w/ backup gateway, exponential backoff |
| Artist non‑tech savvy | Low | Web wizard + concierge option |
| Theme performance | Low | Pre‑render islands, lazy‑load images |

---

### 7. Sample Astro Component

```tsx
---
// src/components/TrackCard.astro
const { track } = Astro.props;
---
<article class="rounded-2xl shadow p-4 flex gap-4">
<img src={track.cover} alt={track.title} class="w-24 h-24 rounded-xl" />
<div class="flex-1">
  <h3 class="text-lg font-semibold">{track.title}</h3>
  <p class="text-sm">{track.artist}</p>
  <audio controls src={track.signedUrl} class="w-full mt-2"></audio>
</div>
</article>
```

### 8. CLI Deploy Flow (pseudo)

```ts
import { uploadFolder } from '@turbo/storage';
import { registerName } from '@ario/sdk';

async function deploy(siteDir, wallet, domain) {
  const txId = await uploadFolder(siteDir, { wallet });
  await registerName(domain, txId, { wallet });
  console.log(`✅ Deployed! https://${domain}`);
}
```

### 9. Artist On‑Boarding Steps (hand‑off)
1. Fill profile.json & discography.json template.
2. Run songs-site build ./mydata.
3. Run songs-site deploy ./dist --wallet ~/.arconnect.json.
4. Share the new permanent link https://artist.songs.ar. 