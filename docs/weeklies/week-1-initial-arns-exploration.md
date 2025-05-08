# Week 1 - May 8-14, 2025 - Initial ArNS Exploration

## Current Understanding

ArNS (Arweave Name Service) appears to be a naming system for the Arweave network, similar to how DNS works for the internet or ENS works for Ethereum. My current understanding is that it allows human-readable names to be mapped to Arweave transaction IDs, making content discovery more intuitive for users.

At this stage, I have several questions:
- How is an ArNS name registered technically?
- What are the costs involved?
- How long do registrations last?
- How quickly do updates propagate?
- What are the security considerations?

## This Week's Exploration

### Setting up an ArConnect wallet

First step is to set up an ArConnect wallet with some test AR tokens:

```bash
# Steps I followed:
# 1. Installed ArConnect extension from Chrome Web Store
# 2. Created a new wallet
# 3. Backed up seed phrase securely
# 4. Loaded wallet with AR from faucet for testing
```

### Initial ArNS Registration Test

Attempted to register a test name:

```bash
# Command attempted:
turbo upload ./test-site --tag App=SONGS --wallet ~/.arconnect.json

# Response received:
# [Record details here]
```

### Resources Discovered

- [ArNS Specification](https://ar.io/docs/arns/specification)
- [Turbo CLI Documentation](https://docs.turbo.storage)
- [AR.IO Name Service Tutorial](https://ar.io/tutorials/register-arns-name)

## Challenges & Breakthroughs

### Challenges
- Still unclear on exactly how to register a subdomain (artist.songs.ar)
- Need to understand the relationship between gateway network and name resolution
- Understanding cost structure for long-term name maintenance

### Breakthroughs
- Discovered that ArNS uses a yearly renewal system, unlike Arweave storage which is pay-once
- Learning that ArNS records are actually stored as Arweave transactions themselves

## Next Steps

- [ ] Complete an end-to-end test registration of a subdomain
- [ ] Document exact command sequence and parameters
- [ ] Research how to connect ArNS names to specific versions of content
- [ ] Investigate how to integrate ArNS into our CLI tool
- [ ] Understand how to test ArNS resolution before going live

## Code & Examples

Example structure of an ArNS record (to be expanded):

```json
{
  "name": "artist.songs.ar",
  "txid": "abc123...",
  "contractTxId": "def456...",
  "registeredAt": 1234567890,
  "expiresAt": 1234567890
}
``` 