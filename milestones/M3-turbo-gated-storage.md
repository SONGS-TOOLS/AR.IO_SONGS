# SONGS Protocol × Arweave/AR.IO  
## Milestone M3 – Reusable **turbo‑gated‑storage** Package

---

### 1. High‑Level
| Field | Data |
|-------|------|
| Duration | Month 4 → 6 |
| Goal | OSS package + CLI that lets any dev add token‑gated Arweave content in ≤ 10 min. |

---

### 2. Package Scope
- **Core API**  
  ```ts
  init({ gateway, signerUrl }): TGS;
  checkAccess(wallet, txId): Promise<boolean>;
  getSignedUrl(wallet, txId, ttl): Promise<string>;
  ```

- **StorageAdapters**: AR.IO default, RawArweave fallback.

- **CLI (tgs)**
  ```bash
  tgs init        # scaffold signer + gateway plugin
  tgs deploy      # uploads assets & registers contracts
  tgs monitor     # tail access logs
  ```

---

### 3. Work Plan
| # | Task | Output |
|---|------|--------|
| 1 | Monorepo refactor (pnpm + Turbo‑repo) | /packages, /cli |
| 2 | Core library implementation | packages/tgs-core |
| 3 | StorageAdapter interface + AR.IO impl | packages/tgs-core/src/adapters |
| 4 | CLI scaffold (oclif) | cli/ |
| 5 | Docs site (Docusaurus) | docs/ on Vercel |
| 6 | CI/CD (semantic‑release + auto‑npm) | GitHub Actions |
| 7 | Workshop (record & publish) | /demos/workshop.mp4 |
| 8 | Marketing (blog, X thread) | /marketing/ |
| 9 | Support & issue triage month | Roadmap PRs |

---

### 4. Success Metrics
| Metric | Target |
|--------|--------|
| npm installs 30 d | ≥ 50 |
| GitHub stars 30 d | ≥ 10 |
| External integrations | ≥ 2 |

---

### 5. Repository Map
```
packages/
  tgs-core/
    src/
      index.ts
      adapters/
        ario.ts
        rawarweave.ts
cli/
docs/
examples/
```

---

### 6. Release Process
- Merge to main with conventional commits.
- semantic‑release tags version, publishes to npm.
- GitHub Action deploys docs to docs.turbo.dev.

---

### 7. Risks
| Risk | Mitigation |
|------|------------|
| Breaking Turbo SDK changes | Lock version ^1.x, nightly CI against canary |
| Low adoption | Launch hackathon bounty, request AR.IO blog cross‑post |

---

### 8. Sample Adapter Skeleton
```ts
import { StorageAdapter } from '../types';

export const arioAdapter: StorageAdapter = {
  name: 'AR.IO',
  async fetch(txId) {
    return fetch(`https://gateway.songs.tools/${txId}`);
  },
  async put(buffer, tags) {
    // use Turbo SDK under the hood
  }
};
``` 