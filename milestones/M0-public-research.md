# SONGS Protocol × Arweave/AR.IO  
## Milestone M0 – Public Research Repo & Knowledge Base

---

### 0. Global Context _(one‑time reference)_
- **Project**: SONGS Protocol – permanent, token‑gated music distribution on **Arweave** + **AR.IO**.  
- **Stack quick‑map**  
  | Layer | Tech | Purpose |
  |-------|------|---------|
  | Storage | Arweave "Permaweb" | Immutable files & metadata |
  | Fast I/O | AR.IO Gateway mesh + $ARIO | CDN‑grade read/write, GraphQL |
  | Upload | Turbo SDK / Bundlr | High‑throughput bundling & payment |
  | Gating | ERC‑1155 + off‑chain signer | Paid unlock of lossless audio |
  | Sites | ArNS (`artist.songs.ar`) | Human‑readable permanent URLs |

---

### 1. Milestone Overview
| Item | Value |
|------|-------|
| **Duration** | Month 0 → 1 (4 weeks) |
| **Goal** | *Stand‑up a public, permanent knowledge base that chronicles every design & decision for future milestones and external contributors.* |

**Success definition**: anyone can fork the repo, replay our decisions, and verify artefacts via Arweave TXIDs.

---

### 2. Deliverables Checklist
1. **GitHub repo** `songs-protocol/arweave-storage` (MIT licence).  
2. Folder structure:  
   - `/docs` – long‑form decision docs
   - `/adr` – Architecture Decision Records (ADR-000*.md)
   - `/milestones` – M0…M4 files (this file copied here)
   - `/src` – code experiments & PoCs
   - `/demos` – short example apps

3. **Contribution Guide** (`CONTRIBUTING.md`) + **Code of Conduct**.  
4. **ADR template** + ≥ 3 initial ADRs (storage choice, gateway topology, upload service).  
5. **Daily dev‑logs** (`/logs/YYYY-MM-DD.md`, min 20 entries).  
6. **5‑min Loom video** walking through repo philosophy & structure.  
7. **CI**: Markdown‑lint, spell‑check, ADR naming convention.  
8. **Permanent backup**: snapshot of `/docs`, `/adr`, video → `turbo upload ./snapshot` (store TXID list in `README.md#🔥-Arweave‑Registry`).  

---

### 3. Detailed Task Board

| # | Task | Owner | Notes |
|---|------|-------|-------|
| 1 | Repo creation & MIT licence | DevOps | Use GitHub template `.gitignore Node+Docs` |
| 2 | Base folder scaffolding | Tech Lead | Ensure empty dirs committed via `.gitkeep` |
| 3 | CONTRIBUTING + COC | Tech Writer | Follow CNCF templates |
| 4 | ADR template (ADR‑000) | Solutions Arch | Use Michael Nygard style |
| 5 | Discovery workshops (recorded) | Team | Slides saved `/docs/workshops/` |
| 6 | Daily logs + meeting links | All | Script `./scripts/new-log` |
| 7 | CI pipeline (Markdownlint + Vale) | DevOps | GitHub Actions |
| 8 | Loom recording & caption | PM | Captions exported `.vtt` |
| 9 | Turbo upload snapshot script | DevOps | Tag TXIDs in YAML manifest |
| 10 | README TXID registry section | Tech Writer | Include gateway fail‑over links |
| 11 | Review & internal QA | PM | Checklist against this table |

---

### 4. Acceptance Criteria (Smart‑Checklist)
- [ ] Repo **public** + MIT.  
- [ ] `README` contains **Arweave TXIDs** and resolves via at least two gateways: `arweave.net`, `ar-io.dev`.  
- [ ] ≥ 3 ADRs committed (`ADR‑001‑storage-backend.md`, `ADR‑002‑gateway-choice.md`, etc.).  
- [ ] CI passes `npm run lint:docs` on `main`.  
- [ ] Loom video link valid; video itself also pinned on Arweave (dual residence).  

---

### 5. Risks & Mitigations
| Risk | Probability | Impact | Plan |
|------|-------------|--------|------|
| Docs drift vs implementation | Medium | Medium | ADR discipline + CI link‑checker |
| Arweave upload failure | Low | High | Keep IPFS pin + retry script w/ 3 gateways |
| On‑boarding overhead | Medium | Low | Provide *Getting Started* in repo root |

---

### 6. Useful Commands & Snippets

```bash
# Turbo CLI install
npm i -g @turbo/cli

# Upload entire docs snapshot to Arweave
turbo upload ./snapshot --tag milestone=M0 --wallet ~/.arconnect.json

# Generate a new ADR
npm run adr:new "choose-storage-backend"
```

### 7. Reference Links
- Turbo Docs: https://docs.turbo.storage
- AR.IO Gateway: https://docs.ar.io
- ADR Guide: https://github.com/joelparkerhenderson/architecture_decision_record 