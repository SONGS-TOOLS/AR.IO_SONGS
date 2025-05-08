# Week 1 - May 8-14, 2025 - Initial AR.IO Exploration

## Current Understanding

AR.IO and Arweave provide the permanent storage infrastructure needed for our decentralized music platform. My current understanding is that:
- Arweave offers permanent, pay-once storage for data
- AR.IO provides gateway access and human-readable names
- We need programmatic tools to upload/manage content
- There are various wallet options available for interacting with the network

## This Week's Exploration

### Wallet Options Investigated

I explored several AR.IO compatible wallets:
- [Wander](https://www.wander.app/)
- [Zelf](https://zelf.world/)
- [Beacon](https://beaconwallet.app/)

Started the onboarding process with Wander to test the experience.

### Services Exploration

#### ArDrive
Investigated [ArDrive](https://ardrive.io/) as a potential storage solution:
```
ArDrive: permanent cloud storage
https://ardrive.io/#/sign-in
```

User experience observations:
- Wallet creation process is lengthy
- Inconsistent session management (offers to create wallet again on return)
- UX/UI needs improvement throughout the process
- Unclear distinction between private/public drives
- Seems positioned as a Pinata-like alternative
- Drives function as decentralized content hubs

While useful as a consumer tool, ArDrive doesn't appear to meet our programmatic needs for the SONGS Protocol.

### Developer Tools Investigation

Pivoted to more programmatic options:
- [Turbo](https://ardrive.io/turbo-bundler/) for high-throughput bundling
- [Turbo Top-up](https://turbo-topup.com/) for credits
- [AR-IO Faucet](https://faucet.arweave.net/) for testnet tokens

Found the ArDrive Core SDK documentation:
```
ArDrive Core is a TypeScript library that contains the essential back end application features to support the ArDrive CLI and Desktop apps, such as file management, Permaweb upload/download, wallet management, and other common functions.
```

Also discovered the ArDrive CLI:
```
The ArDrive Command Line Interface (CLI) is a Node.js application for terminal-based ArDrive workflows. It also offers utility operations for securely interacting with Arweave wallets and inspecting various Arweave blockchain conditions.
```

ArFS:
```
Arweave File System, or “ArFS” is a data modeling, storage, and retrieval protocol designed to emulate common file system operations and to provide aspects of mutability to your data hierarchy on Arweave (opens new window)'s otherwise permanent, immutable data storage blockweave.

Due to Arweave's permanent, immutable and public nature traditional file system operations such as permissions, file/folder renaming and moving, and file updates cannot be done by simply updating the on-chain data model.

ArFS works around this by implementing a privacy and encryption pattern and defining an append-only transaction data model using tags within Arweave Transaction headers (opens new window).
````

Turbo:
TL;DR
Description too long and overly complex, simplify and go hands on


---


