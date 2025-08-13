import { BrowserProvider, JsonRpcSigner } from 'ethers-v6';
import { Signer } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { Pools } from './app/services/Pools';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { Strategies } from './app/services/Strategies';
import { getEnvironment } from './environment';
import { ChainId } from './types/config';

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
	 * @param {BrowserProvider} browserProvider - A signer or provider instance for interacting with contracts.
	 * @param {ChainId} chainId - The network chainId.
	 * @param {boolean} [testing=false] - If true and chainId is 8453, uses the testing environment; otherwise, production is used.
	 */
	constructor(browserProvider: BrowserProvider | JsonRpcSigner | Signer | Provider, chainId: ChainId, testing = false) {
		const config = getEnvironment(chainId, testing);
		const contractFactory = new ContractFactory(browserProvider, config.contracts);

		console.log(`browserProvider constructor name:`, browserProvider.constructor.name)		
		if (browserProvider.constructor.name === 'BrowserProvider') {
			console.log(`Initializing as BrowserProvider`)
		} else if (browserProvider.constructor.name === `Signer`) {
			console.log(`Initializing as Signer`)
		} else if(browserProvider.constructor.name === `JsonRpcSigner`) {
			console.log(`Initializing as JsonRpcSigner`)
		} else {
			console.log(`Initializing as Provider`)
		}

		this.vaults = new Vaults(config.backendUrl, chainId, browserProvider, config.contracts);

		this.yields = new Yield(config.backendUrl, chainId, browserProvider, config.contracts);

		this.pools = new Pools(config.backendUrl, chainId, browserProvider, config.contracts);

		this.strategies = new Strategies(config.backendUrl, browserProvider, config.contracts);

		this.swapperAddress = config.contracts.Swapper;
	}

}
