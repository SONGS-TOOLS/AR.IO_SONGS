# SONGS Protocol × Arweave/AR.IO  
## Milestone M2 – Token‑Gated High‑Fidelity Access

---

### 1. Snapshot
| Item | Value |
|------|-------|
| **Timeline** | Month 2 → 4 |
| **Objective** | Deliver lossless audio streaming locked behind ERC‑1155 ownership. |

---

### 2. Functional Spec
- **Roles**: `Fan`, `RightsHolder`, `Artist`.  
- **Token**: `SongShare` (ERC‑1155) with *supply caps* & *bonding curve* pricing.  
- **Unlock path**: Wallet ↔ Signer ↔ Gateway.  
- **Latency SLO**: ≤ 2 s p95 stream start (EU, US).  

---

### 3. Component Blueprint

| Component | Tech Stack | Notes |
|-----------|------------|-------|
| Gating Contract | Solidity ^0.8.25, OpenZeppelin | Supports batch purchase, royalty split |
| Off‑chain Signer | Node 18, Fastify, Redis | Validates ownership, issues JWT‑style sig |
| Gateway Middleware | Express plugin inside `ar-io-node` | Checks sig, streams range bytes |
| Access SDK | TypeScript, ESM | `unlock(txId, wallet)` returns signed URL |

---

### 4. Detailed Tasks

| # | Task |
|---|------|
| 1 | Token taxonomy design doc (ADR‑004) |
| 2 | Solidity gating contracts + Hardhat tests |
| 3 | Signer service incl. rate‑limit & nonce |
| 4 | React purchase flow (wagmi hooks) |
| 5 | Gateway auth plugin |
| 6 | Load/latency tests (k6 > 5 k RPS) |
| 7 | Analytics ETL (unlock_events → Postgres) |
| 8 | Security audit & fixes |
| 9 | Docs & examples |

---

### 5. Acceptance Checklist
- [ ] **Audit report** uploaded; no critical/high issues.  
- [ ] `npx k6 run tests/latency.js` p95 ≤ 2000 ms.  
- [ ] 100 + paid unlocks within first 30 days (tracking query in Dune).  

---

### 6. Key Artifacts Locations
| Artifact | Repo Path |
|----------|-----------|
| Contracts source | `/contracts/SongShare*.sol` |
| Signer Docker | `/services/signer` |
| Gateway plugin | `/plugins/gateway-auth.js` |
| Access SDK | `/packages/songs-access-sdk` |
| k6 scripts | `/perf/` |
| Audit report TXID | `README#audit-M2` |

---

### 7. Example Usage Snippets

```ts
// Unlock from front‑end
import { unlock } from '@songs/access-sdk';
const url = await unlock(txId, signerWallet);
audio.src = url;
```

```bash
# Signer service env
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=supersecret
TTL_SECONDS=60
NODE_ENV=production
```

```js
// Gateway plugin skeleton
module.exports = (req, res, next) => {
  const { sig, wallet } = req.query;
  if (!verifySig(sig, wallet, req.params.txid)) {
    return res.status(401).end('Forbidden');
  }
  next();
};
``` 