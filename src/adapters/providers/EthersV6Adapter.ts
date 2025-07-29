import { Provider, Signer } from './chain-ethers6';
import { JsonRpcProvider } from '@ethersproject/providers'; // Import ethers v5 provider
import { IProviderAdapter } from './IProviderAdapter';

/**
 * Adapter for ethers v6 Signer or Provider.
 * Returns ethers v5 compatible providers for universal typechain compatibility.
 */
export class EthersV6Adapter implements IProviderAdapter {
	constructor(private signerOrProvider: Signer | Provider) {}

	/**
	 * Returns the ethers v6 Signer.
	 */
	getSigner(): Signer {
		// Check if it's a signer using more reliable detection
		if (
			this.signerOrProvider &&
			typeof (this.signerOrProvider as any).getAddress === 'function' &&
			typeof (this.signerOrProvider as any).signTransaction === 'function'
		) {
			return this.signerOrProvider as Signer;
		}
		throw new Error('Signer not provided');
	}

	/**
	 * Returns an ethers v5 compatible provider for universal typechain compatibility.
	 * This ensures all typechain-generated contracts work regardless of the underlying provider version.
	 */
	getProvider(): any {
		// Get the v6 provider
		let v6Provider: Provider;

		if (typeof (this.signerOrProvider as any).getAddress === 'function') {
			const provider = (this.signerOrProvider as any).provider;
			if (provider) {
				v6Provider = provider as Provider;
			} else {
				throw new Error('Signer has no provider');
			}
		} else if (
			this.signerOrProvider &&
			(typeof (this.signerOrProvider as any).getBlockNumber === 'function' ||
				typeof (this.signerOrProvider as any).getBlock === 'function')
		) {
			v6Provider = this.signerOrProvider as Provider;
		} else {
			throw new Error('Provider not provided');
		}

		// Extract the RPC URL from the v6 provider and create a v5 provider
		// This ensures compatibility with ethers v5 typechain contracts
		const rpcUrl = (v6Provider as any).connection?.url || 'https://base.llamarpc.com';
		return new JsonRpcProvider(rpcUrl);
	}
}
