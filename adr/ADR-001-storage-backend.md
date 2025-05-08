# ADR-001: Selection of Arweave as Primary Storage Backend

## Status
`ACCEPTED`

## Context
SONGS Protocol requires a permanent, censorship-resistant storage solution for music assets (audio files, metadata, artwork) that ensures content remains available in perpetuity while maintaining high performance for streaming access. The solution must balance:

1. **Long-term persistence** - Music should remain accessible for decades without recurring fees
2. **Censorship resistance** - Content should be immune to takedown requests or platform policy changes
3. **Cost efficiency** - Storage costs must be reasonable and predictable
4. **Performance** - Audio streaming requires consistent low-latency access
5. **Developer experience** - Integration should be straightforward with modern tools

This architectural decision will fundamentally impact all aspects of the platform, from cost structure to user experience and technical implementation.

## Decision
We will use **Arweave** as our primary storage backend, enhanced with the **AR.IO gateway network** for performance optimization. Specifically:

1. All music content (mp3/flac, artwork, metadata) will be stored on the Arweave "permaweb"
2. We will deploy our own AR.IO gateway node for low-latency access and caching
3. The Turbo SDK will be utilized for efficient bundling and uploading
4. File access will implement fallback strategies across multiple gateways
5. ArNS will be used for human-readable asset identification

## Consequences

### Positive
- **Pay-once, store-forever model** eliminates ongoing storage costs after initial upload
- **Decentralized storage network** provides high redundancy and censorship resistance
- **AR.IO gateway network** addresses the performance concerns that would otherwise limit streaming capabilities
- **Growing ecosystem tooling** (ArConnect, Turbo, ArFS) simplifies integration
- **Permanent TXIDs** provide immutable identifiers suitable for on-chain references

### Negative
- **Initial upload costs** require upfront investment (estimated ~30 AR for 500 tracks)
- **Gateway infrastructure** requires self-hosting and maintenance
- **Performance vs. traditional CDNs** may still have some latency compromises
- **Ecosystem maturity** means some tooling is still evolving and may have breaking changes
- **Recovery from upload errors** requires careful transaction management

## Alternatives Considered

### IPFS + Filecoin
- **Pros**: Active ecosystem, content-addressed storage, good tooling
- **Cons**: Deal renewal required, pinning services introduce centralization, persistence guarantees weaker than Arweave
- **Rejection Reason**: Long-term storage not guaranteed without ongoing payments

### Traditional Cloud Storage (AWS S3, GCS)
- **Pros**: Excellent performance, mature tooling, immediate familiarity
- **Cons**: Centralized control, ongoing costs, susceptible to censorship, vendor lock-in
- **Rejection Reason**: Fails on the core requirement of censorship resistance and permanent storage

### Sia/Skynet
- **Pros**: Decentralized, competitive pricing
- **Cons**: Portal centralization risks, less mature ecosystem for our needs
- **Rejection Reason**: Ecosystem size and tooling maturity significantly behind Arweave

## References
- [Arweave Yellow Paper](https://arweave.net/information)
- [AR.IO Network Documentation](https://docs.ar.io)
- [Turbo SDK Reference](https://docs.turbo.storage)
- [Storage Cost Analysis](../docs/research/storage-cost-comparison.md)
- Performance benchmarks in [Initial Tests](../docs/research/gateway-performance-tests.md) 