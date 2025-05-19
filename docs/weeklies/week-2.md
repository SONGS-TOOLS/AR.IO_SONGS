# Week 2 - May 15-22, 2025 - Ongoing research

## Current status 

We currenly upload **4** files from the user to IPFS:
- A lossy audio file that will be used to play and preview the song from our platform (sizes can vary from 1mb to 10mb). This file is also used as metadata for other marketplaces, like OpenSea, as an attribute called ```animation_url```, which as per their documentation, will be used as a preview for the actual NFT.
- A lossless audio file that will the one we send to the Distribution Platforms (sizes can vary from 10mb to 200mb)
- An image file that will be used as a visual preview on our platform and other marketplaces, like OpenSea, as an attribute called ```image``` (sizes can vary from 100kb to 10mb)
- A json file with additional flexible metadata about the song like genres, participating artists, cretits, etc. that we call ```attributes```

In order to create a rich and smooth interface for the end user, SONGS currently indexes all events that happen in their protocol through a subgraph hosted on the platform [The Graph](https://thegraph.com).

This platform allows IPFS and Arweave text files to be indexed as a regular property that can be then queried from their GraphQL endpoint in order to avoid additional fetch calls from the app. ([More info can be found here](https://thegraph.com/docs/en/subgraphs/developing/creating/advanced/#ipfsarweave-file-data-sources)).

The SONGS app front-end, built on Next.js, is deployed and served through Vercel.


## This Week's Exploration

### First thoughts

On our plaftorm, at least for 2025, the creation of songs is sponsored by the company via the Coinbase Paymaster and bundler service. 

In order to maintain this proccess free, we would need to create a proxy wallet that will be regularly topped up with AR to pay for the actual upload.

This wallet would be the one to sign all upload transactions to the network from a protected endpoint.

Same as we are currently doing with IPFS, the attributes file will be indexed as plain text on our subgraph in order to get all information about a song in a single query call to this service. 


### Steps outline and insight

#### Create proxy endpoint to upload files to Arweave from SONGS app:

- Next.js allows us to create API endpoints that are run on the server, ensuring a secure environment where sensitive information won't be leaked to the browser, like the wallet secret key. 

    Currently Vercel, where the app is deployed, allows a maximum payload size for these enpoints of 4.5MB.

    This limitation is normally bypassed by creating an endpoint that does not actually manipulate the files itself, but creates a signed URL that can be used as an authenticated and secure path to upload the files from the client (the user browser in this case).

- As per [ar.io documentation](https://docs.ar.io/guides/uploading-to-arweave), and our understanding of the upload mechanism, the creation of signed URLs is not possible, since what we are actually doing is signing a transaction. Other strategies must be used then.

    **Can we get an authenticated turbo client in the browser without leaking sensitive information?**

    **Should we use an external serverless function to handle these uploads, i.e. AWS Lambda, that would still provide protection against information leak and allow no payload size limit.**

#### Check for wallet balance and top up if necessary

- This wallet should implement some mechanism to regularly check its balance and do periodic top ups using the turbo SDK to maintain service. 

    Should this be done in the same proxy endpoint? 
    
    How can we avoid race conditions in which several top ups are done from different requests?

#### Modify subgraph code in order to index Arweave files 

- Currently our subgraph indexes IPFS files as plain text in order to avoid additional fetch calls from the user's browser. 

    In order to maintain a flexible indexer, a regex check can be made to differentiate between IPFS and Arweave ID's and create either template depending on this check. 

    ```js
    // pseudo-code

    // https://github.com/multiformats/js-multiformats/blob/master/src/cid.ts
    import { CID } from 'multiformats/cid'


    const attributesFileId = "bafkreibomqhjqv4pezb6n7ba3qkz4rarztirwhp2ml2x4bnizd6qvhrxe4"
    // Could be CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA

    const isIPFS = (id)=>{
        try{
        return Boolean(CID.parse(attributesFileId))
        }catch{
            return false;
        }
    };
    const isArweave = (id)=>{
        const base64urlRegex = /^[A-Za-z0-9_-]{43}$/
        return base64urlRegex.test(id)
    }

    if(isIPFS(attributesFileId)){

        // Create IPFS Template

    }else if(isArweave(attributesFileId)){

        // Create Arweave template

    }else{

        // Do nothing

    }

    ``` 


#### Modify front end to fetch images and audio files depending on same structure as above. 
- On the SONGS app front-end we must check equally if the file ID returned from the subgraph is an IPFS CID or an Arweave TXID in order to prepend the correct gateway (https://ipfs.io/ipfs/ or https://arweave.net/ respectively)


