import { SmartContractAdapter } from '../../adapters/smartContract';
import { Protocol, Strategy } from '../../types/strategies';
import { StrategiesBackend } from '../../adapters/backend/StrategiesBackend';
import { BrowserProvider, JsonRpcSigner } from 'ethers-v6';
import { Signer } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import { ContractAddresses } from '../../types/config';

export class Strategies {
	private smartContractAdapter: SmartContractAdapter;
	private strategiesBackend: StrategiesBackend;

	constructor(backendUrl: string, provider: BrowserProvider | JsonRpcSigner | Signer | Provider, config: ContractAddresses) {
		this.smartContractAdapter = new SmartContractAdapter(provider, config);
		this.strategiesBackend = new StrategiesBackend(backendUrl);
	}

	/**
	 * Fetches all protocols from the backend.
	 *
	 * @returns {Promise<ProtocolData[]>} A promise that resolves to an array of protocols.
	 */
	async getProtocols(): Promise<Protocol[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		return protocols.map(({ prefixes, ...rest }) => rest);
	}

	/**
	 * Fetches all active strategies for a given vault.
	 *
	 * @param {string} vault - The address of the vault.
	 * @returns {Promise<Strategy[]>} A promise that resolves to an array of strategies.
	 */
	async getActiveStrategies(vault: string): Promise<Strategy[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		const totalAssets = await this.smartContractAdapter.yelayLiteVault.totalAssets(vault);
		const activeStrategies = await this.smartContractAdapter.yelayLiteVault.activeStrategies(vault);
		const result = await Promise.all(
			activeStrategies.map(async (strategy, index) => {
				const prefix = strategy.name.split('-')[0];
				const protocol = protocols.find(p => p.prefixes.includes(prefix));
				if (!protocol) {
					throw new Error(`Protocol for ${prefix} not found`);
				}
				const strategyAssets = await this.smartContractAdapter.yelayLiteVault.strategyAssets(BigInt(index), vault);
				const allocation = ((strategyAssets * 10000n) / totalAssets) / 100n;
				return {
					...strategy,
					protocolId: protocol.id,
					allocation,
				};
			}),
		);
		return result;
	}
}
