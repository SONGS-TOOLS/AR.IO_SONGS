# Week 3 and 4 - May 23 - June4, 2025 - Ongoing research

## Current status 

We currently have a working react hook to upload files to arweave. Below we will explain what issues we came accross and the solutions implemented


## Issues and solutions

### Turbo SDK

We installed the Turbo SDK in our existing Next.js app. We are using yarn and noticed that when doing `yarn install` we got an error on the console prompting us to use npm, so we install the package by doing `yarn install --ignore-engines`. It might be possible we have to change this install command also on vercel in order to avoid this error and maintain yarn as our package manager.

At first, whenever we imported anything from this package in any client-side component, we would get an error saying:

```
Module not found: 'fs'
```
or
```
Module not found: 'nodeCrypto'
```
As per the Turbo SDK docs we noticed we had to polyfill certain native Node packaged like the one mentioned above. 

Since we are using Next.js version < 15.3.0 and using turbopack for development, we did this by modifying our next.config.js and adding the following:
```js
const nextConfig = {
    experimental: {
		turbo: {
			resolveAlias: {
				fs: { browser: "browserify-fs" },
				crypto: { browser: "crypto-browserify" },
			},
		},
	},
    // rest of the config
}
```
In case the version of Next.js is greater or equal to 15.3.0 this needs to be set like the following:
```js
const nextConfig = {
    turbopack: {
        resolveAlias: {
            fs: { browser: "browserify-fs" },
            crypto: { browser: "crypto-browserify" },
        },
    },
    // rest of the config
}
```
We have not yet tested the Turbo SDK on a production build, which will not use turbopack as it still in very early development stages, but we expect we will have to add this to our config so that webpack correctly polyfills the needed modules:
```js
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import webpack from "webpack";

const nextConfig = {
    webpack: (config, { isServer }) => {
		if (!isServer) {
			config.plugins.push(new NodePolyfillPlugin());
			config.plugins.push(
				new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
                    // Replace node: prefix with regular modules
					resource.request = resource.request.replace(/^node:/, "");
					switch (mod) {
						case "crypto":
							resource.request = "crypto-browserify";
							break;
						case "fs":
							resource.request = "fs-browserify";
							break;
						default:
							throw new Error(`Not found ${mod}`);
					}
				}),
			);
		}

		return config;
	},
    // rest of the config
}
```

### Authenticated Turbo instance with Privy.io embedded wallet

Next, we needed to obtain an authenticated Turbo instance. We did this following the docs on ar.io but made some changes in order to make it work with Privy. 

Our app uses Privy smart wallets for all blockchain interactions in order to be able to sponsorship and bundle transactions. 

Both this smart wallet and the embedded wallet (an EOA wallet provided by Privy) used to manage it are created by Privy for every user that registers. 

When trying to create the Turbo instance with the smart wallet we got an error of `Invalid signature length` when retrieving the public key with the function `recoverPublicKey()`. This is because the resulting signature of signing a message needs to be verified differently from the EOA signatures.

We decided then to use the embedded wallet to create the Turbo instance.

The other thing we needed to adapt was the signing function itself, since Privy's function only accepts a string as an argument and not an array of bytes as the Viem or Wagmi functions which accepts a message that can be `string | { raw: Hex | ByteArray }`. 

So this is the final function:

```js
import { useSignMessage } from "@privy-io/react-auth";

const { signMessage } = useSignMessage();

const provider = {
    getSigner: () => ({
        signMessage: async (message: string | Bytes) => {
            // Convert raw bytes to hex string if needed
            const messageToSign =
                typeof message === "string" ? message : `0x${Buffer.from(message).toString("hex")}`;

            return await signMessage(
                {
                    message: messageToSign,
                },
                {
                    uiOptions: {
                        showWalletUIs: false,
                    },
                },
            ).then((res) => res.signature);
        },
    }),
};
```

You will notice the uiOptions in the signMessage function. This is used in order to hide the UI for this signature and do it on the background instead of prompting the user for a signature each time an upload is made.

Then we create our Ethereum Signer and initialize our Turbo instance 

```js
const signer = new InjectedEthereumSigner(createdProvider);
const message = "Sign this message to connect to Turbo";

const { signature } = await signMessage(
    {
        message: message,
    },
    {
        uiOptions: {
            showWalletUIs: false,
        },
    },
);
const hash = hashMessage(message);
const recoveredKey = await recoverPublicKey({
    hash,
    signature: signature as `0x${string}`,
});
signer.publicKey = Buffer.from(toBytes(recoveredKey));

const turboInstance = TurboFactory.authenticated({
    signer: signer,
    token: "base-eth",
});
```

It's important to note that since we work on Base, we will get an error when trying to upload any files unless the token is set to "base-eth".


### API Route to share credits

In the beginning, SONGS will sponsorship user's upload to Arweave as it has been doing for Base transactions. 

In order to do this, we will use a secure server function that will receive the requesting wallet address and the size of the file they want to upload, and will grant the requested credits for them to upload their file. 

From the front, this API Route is called like so:

```js
// This can be either an authencitaded or unauthenticated Turbo instance

const [{ winc: fileSizeCost }] = await turboInstance.getUploadCosts({
    bytes: [Math.ceil(fileSize * 1.1)],
});

const response = await fetch("/handleCreditsRequest", {
    method: "POST",
    body: JSON.stringify({
        fileSizeCost: Number(fileSizeCost),
        approvedAddress: walletAddress,
    }),
});
```

We've padded the filesize by multiplying it by 1.1 since we have noticed that whenever we passed the exact cost of the file upload, at times we got an error from ar-drive saying `insufficient funds`. By doing this and keeping it an integer, we have experienced continous succesful uploads.

The code on our API route looks like this:

```js
const jwk = JSON.parse(process.env.ARWEAVE_WALLET_JSON || "{}");
const turbo = TurboFactory.authenticated({ privateKey: jwk });

const body = await request.json();
const { fileSizeCost, approvedAddress } = body;

const response = await turbo.shareCredits({
    approvedAddress: approvedAddress,
    approvedWincAmount: +fileSizeCost,
    expiresBySeconds: 60,
});
return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
        "Content-Type": "application/json",
    },
});
```

In order for our API Route to work, we need to previously set an environment variable containing the keyfile content for the wallet that will contain the tokens to be shared.

### Client-side file upload

From the client, we can then upload a file after being granted the needed credits to do:

```ts
await turboInstance.uploadFile({
    fileStreamFactory: () => file.stream(),
    fileSizeFactory: () => file.size,
    dataItemOpts: {
        tags: [
            {
                name: "Content-Type",
                value: file.type || "application/octet-stream",
            },
        ],
        paidBy: payingAddress,
    },
});
```

### Create reusable hook

In order to have a reusable component across our app, we created a hook that contains this code like so:

```js

import { useEffect, useState } from "react";
import { InjectedEthereumSigner } from "@dha-team/arbundles";
import { ByteArray, hashMessage, recoverPublicKey, toBytes } from "viem";
import { usePrivy, useSignMessage } from "@privy-io/react-auth";
import {
	TurboAuthenticatedClient,
	TurboFactory,
	TurboUploadDataItemResponse,
} from "@ardrive/turbo-sdk/web";

const useArweaveUploader = () => {
	const { signMessage } = useSignMessage();
	const {user} = usePrivy();

	const [turboInstance, setTurboInstance] = useState<TurboAuthenticatedClient | null>(null);
	useEffect(() => {
		const createTurbo = async () => {
			const createdProvider = {
				getSigner: () => ({
					signMessage: async (message: string | ByteArray) => {
						// Convert raw bytes to hex string if needed
						const messageToSign =
							typeof message === "string" ? message : `0x${Buffer.from(message).toString("hex")}`;

						return await signMessage(
							{
								message: messageToSign,
							},
							{
								uiOptions: {
									showWalletUIs: false,
								},
							},
						).then((res) => res.signature);
					},
				}),
			};
			const signer = new InjectedEthereumSigner(createdProvider);
			const message = "Sign this message to connect to Turbo";

			const { signature } = await signMessage(
				{
					message: message,
				},
				{
					uiOptions: {
						showWalletUIs: false,
					},
				},
			);
			const hash = hashMessage(message);
			const recoveredKey = await recoverPublicKey({
				hash,
				signature: signature as `0x${string}`,
			});

			signer.publicKey = Buffer.from(toBytes(recoveredKey));
			const turboInstance = TurboFactory.authenticated({
				signer: signer,
				token: "base-eth",
			});
			setTurboInstance(turboInstance);
		};

		if (user) {
			createTurbo();
		}

	}, [user]);

    const requestCredits = async (fileSize: number): Promise<CreditShareApproval> => {
		const result = await fetch("/api/arweave", {
			method: "POST",
			body: JSON.stringify({ fileSizeCost: fileSize, approvedAddress: user?.wallet?.address }),
		});
		return result.json();
	};

	const uploadToArweave = async (file: File): Promise<TurboUploadDataItemResponse | undefined> => {
		if (!turboInstance) return;

		try {
			const {payingAddress} = await requestCredits(file.size);

			const result = await turboInstance.uploadFile({
				fileStreamFactory: () => file.stream(),
				fileSizeFactory: () => file.size,
				dataItemOpts: {
					tags: [
						{
							name: "Content-Type",
							value: file.type || "application/octet-stream",
						},
					],
					paidBy: payingAddress,
				},
			});
			return result;
		} catch (e) {
			console.error("Error uploading file", e);
			return undefined;
		}
	};

	return { uploadToArweave, turboInstance };
};

export default useArweaveUploader;

```

### TO DO

- Implement security measures in our API endpoint to ensure only registered users can request credits. 
- Add progress percentage to useArweaveUploader hook in order to render it for better UX
- Create fallbacks for cases like:
    - No credits to be shared from sponsoring wallet
    - No credits found for uploading wallet

Since some of the files the users upload to SONGS are often changed, we are still deciding on what is the best strategy regarding storing files permanently. 

Maybe we will upload to Arweave only the track files once the song has been released, since these are the most permanent files attached to a song.