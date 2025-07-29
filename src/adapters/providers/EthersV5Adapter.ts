import type { Provider } from './chain-ethers5';
import { Signer } from './chain-ethers5';
import { IProviderAdapter } from './IProviderAdapter';

/**
 * Adapter for ethers v5 Signer or Provider.
 */
export class EthersV5Adapter implements IProviderAdapter {
	constructor(private signerOrProvider: Signer | Provider) {}

	/**
	 * Returns the ethers v5 Signer.
	 */
	getSigner(): Signer {
		if (Signer.isSigner(this.signerOrProvider)) {
			return this.signerOrProvider;
		}
		throw new Error('Signer not provided');
	}

	/**
	 * Returns the ethers v5 Provider.
	 */
	getProvider(): Provider {
		if (Signer.isSigner(this.signerOrProvider)) {
			const provider = (this.signerOrProvider.provider as Provider) || null;
			if (provider) {
				return provider;
			}
			throw new Error('Signer has no provider');
		}
		return this.signerOrProvider;
	}
}
