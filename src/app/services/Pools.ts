import { PoolsBackend } from '../../adapters/backend/PoolsBackend';
import { IYelayLiteVault } from '../ports/smartContract/IYelayLiteVault';
import { PaginatedResponse } from '../../types/backend';
import { PoolsTvl, HistoricalTVL, HistoricalTVLParams } from '../../types/pools';

export class Pools {
	private yelayLiteVault: IYelayLiteVault;
	private poolsBackend: PoolsBackend;

	constructor(yelayLiteVault: IYelayLiteVault, backendUrl: string, chainId: number) {
		this.yelayLiteVault = yelayLiteVault;
		this.poolsBackend = new PoolsBackend(backendUrl, chainId);
	}

	/**
	 * Retrieves the TVL of the pools.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} pools - Array of pool IDs to query.
	 * @returns {Promise<PoolsTvl[]>} A promise that resolves to an array of TVL values for each pool.
	 */
	async getPoolsTvl(vault: string, pools: number[]): Promise<PoolsTvl[]> {
		const { totalAssets, totalSupply, poolsSupply } = await this.yelayLiteVault.getPoolsSupplies(vault, pools);

		return poolsSupply.map((poolSupply: any, index: number) => ({
			id: pools[index],
			tvl: totalAssets.mul(poolSupply).div(totalSupply),
		}));
	}

	/**
	 * Fetch historical Total Value Locked (TVL) data for a specific vault and pool.
	 *
	 * @param {HistoricalTVLParams} params - Parameters for querying historical TVL:
	 *   - `vaultAddress` **(required)**: Vault address to retrieve TVL for.
	 *   - `poolId` **(required)**: Pool ID to filter data by.
	 *   - `fromTimestamp` *(optional)*: Start timestamp (in seconds).
	 *   - `toTimestamp` *(optional)*: End timestamp (in seconds).
	 *   - `page` *(optional)*: Page number for pagination (starts at 1).
	 *   - `pageSize` *(optional)*: Number of records per page (max 100).
	 *
	 * @returns {Promise<PaginatedResponse<HistoricalTVL>>} Resolves with a paginated response of historical TVL entries.
	 */
	public async historicalTVL(params: HistoricalTVLParams): Promise<PaginatedResponse<HistoricalTVL>> {
		return await this.poolsBackend.historicalTVL(params);
	}
}
