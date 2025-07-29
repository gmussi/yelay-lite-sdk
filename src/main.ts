import type { Provider, Signer } from './adapters/providers/chain';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { Pools } from './app/services/Pools';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { Strategies } from './app/services/Strategies';
import { getEnvironment } from './environment';
import { ChainId } from './types/config';
import { IProviderAdapter } from './adapters/providers/IProviderAdapter';
import { EthersV5Adapter } from './adapters/providers/EthersV5Adapter';
import { EthersV6Adapter } from './adapters/providers/EthersV6Adapter';
import { ViemAdapter } from './adapters/providers/ViemAdapter';
import { setChainAdapter } from './adapters/providers/chain';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public pools: Pools;
	public strategies: Strategies;
	// TODO: remove after integrating gathering swapCalldata into the flow
	public swapperAddress: string;

	/**
	 * Creates a new instance of YelayLiteSdk.
	 *
	 * For chainId 8453, the Base testing environment is supported when the testing parameter is set to true.
	 * For all other chainIds, only the production environment is available regardless of the testing flag.
	 *
	 * @param {Signer | Provider} signerOrProvider - A signer or provider instance for interacting with contracts.
	 * @param {ChainId} chainId - The network chainId.
	 * @param {'ethers5' | 'ethers6' | 'viem'} [adapterType='ethers5'] - Which provider adapter to use.
	 * @param {boolean} [testing=false] - If true and chainId is 8453, uses the testing environment; otherwise, production is used.
	 */
	constructor(
		signerOrProvider: Signer | Provider | any,
		chainId: ChainId,
		adapterType: 'ethers5' | 'ethers6' | 'viem' = 'ethers5',
		testing = false,
	) {
		// Set the chain adapter type before any other operations
		setChainAdapter(adapterType);

		const config = getEnvironment(chainId, testing);
		// Initialize the provider/signature adapter
		const adapter: IProviderAdapter = (() => {
			switch (adapterType) {
				case 'ethers5':
					return new EthersV5Adapter(signerOrProvider);
				case 'ethers6':
					return new EthersV6Adapter(signerOrProvider);
				case 'viem':
					return new ViemAdapter(signerOrProvider);
				default:
					throw new Error('Unsupported adapter type');
			}
		})();
		// Try to get signer first, fall back to provider if signer is not available
		let normalized;
		try {
			if (adapter.getSigner) {
				normalized = adapter.getSigner();
			} else {
				normalized = adapter.getProvider();
			}
		} catch {
			normalized = adapter.getProvider();
		}
		const contractFactory = new ContractFactory(normalized, config.contracts, adapterType);

		this.vaults = new Vaults(contractFactory, config.backendUrl, chainId, adapter);

		this.yields = new Yield(contractFactory, config.backendUrl, chainId, adapter);

		this.pools = new Pools(contractFactory, config.backendUrl, chainId);

		this.strategies = new Strategies(contractFactory, config.backendUrl);

		this.swapperAddress = config.contracts.Swapper;
	}
}
