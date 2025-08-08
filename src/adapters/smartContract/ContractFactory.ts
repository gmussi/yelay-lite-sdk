import { createChainAdapter, type Framework, type SignerType, type ProviderType } from '../providers/chain';

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
import { IProviderAdapter } from '../providers/IProviderAdapter';

export class ContractFactory<T extends Framework = Framework> implements IContractFactory {
	private provider: ProviderType<T>;
	private adapter: ReturnType<typeof createChainAdapter<T>>;
	private providerAdapter: IProviderAdapter;

	constructor(
		framework: T,
		private signerOrProvider: SignerType<T> | ProviderType<T>,
		private contractAddresses: ContractAddresses,
		providerAdapter?: IProviderAdapter,
	) {
		this.adapter = createChainAdapter(framework);
		this.providerAdapter = providerAdapter!;

		// Use the provider adapter to get the correct provider format
		this.provider = this.providerAdapter.getProvider() as ProviderType<T>;
	}

	/**
	 * Universal contract connection that works with all adapter types
	 */
	private connectContract<ContractType>(address: string, factory: any): ContractType {
		// Attempt to connect with signer; if that fails or no signer, fallback to provider
		if (typeof this.providerAdapter.getSigner === 'function') {
			try {
				const signer = this.providerAdapter.getSigner();
				return factory.connect(address, signer) as ContractType;
			} catch {
				// invalid signer for v5 contract, ignore and fallback
			}
		}
		return factory.connect(address, this.provider as any) as ContractType;
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
		return this.connectContract<YieldExtractor>(this.contractAddresses.YieldExtractor, YieldExtractor__factory);
	}
}
