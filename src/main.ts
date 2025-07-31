import { type Framework, type SignerType, type ProviderType } from './adapters/providers/chain';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { VaultWrapper } from './adapters/smartContract/VaultWrapper';
import { YelayLiteVault } from './adapters/smartContract/YelayLiteVault';
import { YieldExtractor } from './adapters/smartContract/YieldExtractor';
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

export class YelayLiteSdk<T extends Framework = Framework> {
	public vaults: Vaults;
	public yields: Yield;
	public pools: Pools;
	public strategies: Strategies;
	// TODO: remove after integrating gathering swapCalldata into the flow
	public swapperAddress: string;
	private contractFactory: ContractFactory<T>;

	/**
	 * Creates a new instance of YelayLiteSdk.
	 *
	 * For chainId 8453, the Base testing environment is supported when the testing parameter is set to true.
	 * For all other chainIds, only the production environment is available regardless of the testing flag.
	 *
	 * @param {T} framework - The web3 framework to use ('ethers5', 'ethers6', or 'viem').
	 * @param {SignerType<T> | ProviderType<T>} signerOrProvider - A signer or provider instance for interacting with contracts.
	 * @param {ChainId} chainId - The network chainId.
	 * @param {boolean} [testing=false] - If true and chainId is 8453, uses the testing environment; otherwise, production is used.
	 */
	constructor(framework: T, signerOrProvider: SignerType<T> | ProviderType<T>, chainId: ChainId, testing = false) {
		const config = getEnvironment(chainId, testing);

		// Initialize the provider/signature adapter first
		const adapter: IProviderAdapter = (() => {
			switch (framework) {
				case 'ethers5':
					return new EthersV5Adapter(signerOrProvider as any);
				case 'ethers6':
					return new EthersV6Adapter(signerOrProvider as any);
				case 'viem':
					return new ViemAdapter(signerOrProvider as any);
				default:
					throw new Error('Unsupported framework');
			}
		})();

		// Initialize the contract factory with type safety
		this.contractFactory = new ContractFactory(framework, signerOrProvider, config.contracts, adapter);

		// Create adapter instances
		const vaultWrapper = new VaultWrapper(this.contractFactory);
		const yelayLiteVault = new YelayLiteVault(this.contractFactory);
		const yieldExtractor = new YieldExtractor(this.contractFactory);

		this.vaults = new Vaults(vaultWrapper, yelayLiteVault, config.backendUrl, chainId, adapter);

		this.yields = new Yield(yieldExtractor, config.backendUrl, chainId, adapter);

		this.pools = new Pools(yelayLiteVault, config.backendUrl, chainId);

		this.strategies = new Strategies(yelayLiteVault, config.backendUrl);

		this.swapperAddress = config.contracts.Swapper;
	}
}
