import { PublicClient, WalletClient } from './chain-viem';
import { JsonRpcProvider } from '@ethersproject/providers'; // Import ethers v5 provider
import { IProviderAdapter } from './IProviderAdapter';

/**
 * Adapter for viem PublicClient or WalletClient.
 * Returns ethers v5 compatible providers for universal typechain compatibility.
 */
export class ViemAdapter implements IProviderAdapter {
	constructor(private client: PublicClient | WalletClient) {}

	/**
	 * Returns the underlying viem client as a mock signer.
	 * Note: viem handles signing differently, this is for interface compatibility.
	 */
	getSigner(): WalletClient {
		// Check if it's a WalletClient by looking for wallet-specific methods
		if (
			this.client &&
			typeof (this.client as any).signTransaction === 'function' &&
			typeof (this.client as any).signMessage === 'function'
		) {
			return this.client as WalletClient;
		}
		throw new Error('Viem client is not a WalletClient');
	}

	/**
	 * Returns an ethers v5 compatible provider for universal typechain compatibility.
	 * This creates a JsonRpcProvider using the same RPC endpoint as the viem client.
	 */
	getProvider(): any {
		// Extract RPC URL from viem client transport
		const transport = (this.client as any).transport;
		let rpcUrl = 'https://base.llamarpc.com'; // fallback

		if (transport && transport.url) {
			rpcUrl = transport.url;
		} else if (transport && transport.transports) {
			// Handle fallback transport
			const firstTransport = transport.transports[0];
			if (firstTransport && firstTransport.value && firstTransport.value.url) {
				rpcUrl = firstTransport.value.url;
			}
		}

		// Create ethers v5 compatible provider
		return new JsonRpcProvider(rpcUrl);
	}
}
