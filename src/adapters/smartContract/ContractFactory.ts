import type { Provider } from '../providers/chain';
import { Signer } from '../providers/chain';

import { MulticallWrapper } from 'ethers-multicall-provider';
import { IContractFactory } from '../../app/ports/IContractFactory';
import {
	ERC20,
	ERC20__factory,
	IYelayLiteVault,
	IYelayLiteVault__factory,
	VaultWrapper,
	VaultWrapper__factory,
	YieldExtractor,
	YieldExtractor__factory,
} from '../../generated/typechain';
import { ContractAddresses } from '../../types/config';

export class ContractFactory implements IContractFactory {
	private provider: Provider;
	private adapterType: 'ethers5' | 'ethers6' | 'viem';

	constructor(
		private signerOrProvider: Signer | Provider,
		private contractAddresses: ContractAddresses,
		adapterType: 'ethers5' | 'ethers6' | 'viem' = 'ethers5',
	) {
		this.adapterType = adapterType;

		if (Signer.isSigner(signerOrProvider)) {
			if (signerOrProvider.provider) {
				// Try to wrap with MulticallWrapper for ethers v5, fallback to regular provider for others
				try {
					this.provider = MulticallWrapper.wrap(signerOrProvider.provider);
				} catch {
					this.provider = signerOrProvider.provider;
				}
			} else {
				throw new Error('Signer has no provider');
			}
		} else {
			// Try to wrap with MulticallWrapper for ethers v5, fallback to regular provider for others
			try {
				this.provider = MulticallWrapper.wrap(signerOrProvider);
			} catch {
				this.provider = signerOrProvider;
			}
		}
	}

	/**
	 * Universal contract connection that works with all adapter types
	 */
	private connectContract<T>(address: string, factory: any): T {
		// For all adapter types, use the ethers5 factory pattern
		// The adapter layer ensures the signerOrProvider is compatible
		return factory.connect(address, this.signerOrProvider) as T;
	}

	getYelayLiteVault(vault: string): IYelayLiteVault {
		return this.connectContract<IYelayLiteVault>(vault, IYelayLiteVault__factory);
	}

	getVaultWrapper(): VaultWrapper {
		return this.connectContract<VaultWrapper>(this.contractAddresses.VaultWrapper, VaultWrapper__factory);
	}

	getErc20(address: string): ERC20 {
		return this.connectContract<ERC20>(address, ERC20__factory);
	}

	getYieldExtractor(multicall = false): YieldExtractor {
		const providerToUse = multicall ? this.provider : this.signerOrProvider;
		return YieldExtractor__factory.connect(this.contractAddresses.YieldExtractor, providerToUse);
	}
}
