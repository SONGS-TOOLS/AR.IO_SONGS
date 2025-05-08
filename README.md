# SONGS Protocol × Arweave/AR.IO

**Permanent, censorship-resistant music distribution with token-gated monetization**

## Project Overview

SONGS Protocol integrates Arweave and AR.IO technologies to create a permanent, decentralized platform for music distribution and monetization. This repository contains the implementation of storage integrations, token-gating mechanisms, and artist microsites.

## 🔥 Arweave Registry

| Content | TXID | Gateway Links |
|---------|------|--------------|
| Documentation Snapshot | _TBD_ | [arweave.net](https://arweave.net/_TBD_), [ar-io.dev](https://ar-io.dev/_TBD_) |
| Demo Video M1 | _TBD_ | [arweave.net](https://arweave.net/_TBD_), [ar-io.dev](https://ar-io.dev/_TBD_) |

## Repository Structure

```
├── docs/                 # Long-form decision docs
│   └── weeklies/         # Weekly discovery documents
├── adr/                  # Architecture Decision Records
├── milestones/           # M0-M4 planning files
├── src/                  # Code experiments & PoCs
├── demos/                # Example applications
├── logs/                 # Development logs
│   └── discovery/        # Research findings
├── infra/                # Infrastructure as code
│   └── gateway/          # AR.IO Gateway configuration
├── services/             # Microservices
│   ├── songs-upload/     # Upload service with Turbo SDK
│   └── signer/           # Off-chain token verification signer
├── cli/                  # Command-line tools
├── packages/             # Reusable npm packages
│   ├── ar-storage-sdk/   # Arweave storage TypeScript SDK
│   ├── songs-access-sdk/ # Token-gated access SDK
│   ├── tgs-core/         # Turbo-gated-storage core package
│   ├── tgs-adapters/     # Storage adapters for TGS
│   ├── tgs-react/        # React hooks for TGS
│   └── songs-site-cli/   # CLI for artist site generation
├── contracts/            # Smart contracts (Solidity)
├── plugins/              # AR.IO Gateway plugins
└── perf/                 # Performance and load tests
```

## Documentation & Learning Resources

### Weekly Discovery Documents

We maintain a [collection of weekly discovery documents](./docs/weeklies) that chronicle the personal learning journey and implementation process. These documents provide:

- Step-by-step exploration of key technologies (ArNS, Astro, Arweave)
- Real-world implementation challenges and solutions
- Code snippets and examples from our exploration
- Valuable insights for developers new to the project

Current discovery topics include:
- [Initial ArNS Exploration](./docs/weeklies/week-1-initial-arns-exploration.md)
- [Astro Framework Prototyping](./docs/weeklies/week-2-astro-prototyping.md)
- [Artist Data Schema Design](./docs/weeklies/week-3-data-schema-design.md)

### Architecture Decisions

For formal design decisions, see the [Architecture Decision Records](./adr) (ADRs).

## Tech Stack

- **Storage**: Arweave "Permaweb" (permanent, pay-once storage)
- **Gateways**: AR.IO network with ArNS (human-readable names)
- **Upload**: Turbo SDK / Bundlr (high-throughput bundling)
- **Contracts**: ERC-1155 for token-gated content
- **Front-end**: React hooks, Astro for artist sites

## Getting Started

### Prerequisites
- Node.js 18+
- [ArConnect](https://arconnect.io) wallet with AR tokens
- [everPay](https://everpay.io) for fast AR ↔ USDC top-ups

### Installation

```bash
# Install Turbo CLI
npm i -g @turbo/cli

# Clone repository
git clone https://github.com/songs-protocol/arweave-storage.git
cd arweave-storage

# Install dependencies
npm install
```

## Milestones

This project is being implemented in 5 key milestones:

1. **M0**: Public research repository & knowledge base
2. **M1**: Core storage integration with AR.IO
3. **M2**: Token-gated high-fidelity audio access
4. **M3**: Reusable turbo-gated-storage package
5. **M4**: ARNS-powered artist sites

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: gordo@songs-tools.com
- GitHub: [gordo-labs](https://github.com/gordo-labs)

## Acknowledgments

- Arweave team for permanent storage protocol
- AR.IO community for the gateway network
- Grant providers for supporting this work
