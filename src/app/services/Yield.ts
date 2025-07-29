import { BigNumber, ContractTransaction, Overrides } from '@chain';
import { IProviderAdapter } from '../../adapters/providers/IProviderAdapter';
import { YieldBackend } from '../../adapters/backend/YieldBackend';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { TimeFrame } from '../../types/backend';
import { ChainId } from '../../types/config';
import {
	ClaimRequest,
	ClaimRequestParams,
	ClaimableYield,
	GetLastClaimEventParams,
	PoolYield,
	VaultYield,
	YieldAggregated,
} from '../../types/yield';
import { getTimestampOneWeekAgo } from '../../utils/backend';
import { tryCall } from '../../utils/smartContract';
import { IYieldBackend } from '../ports/backend/IYieldBackend';
import { IContractFactory } from '../ports/IContractFactory';

export class Yield {
	private smartContractAdapter: SmartContractAdapter;
	private yieldBackend: IYieldBackend;
	private adapter: IProviderAdapter;
	private chainId: ChainId;

	constructor(contractFactory: IContractFactory, backendUrl: string, chainId: ChainId, adapter: IProviderAdapter) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.yieldBackend = new YieldBackend(backendUrl, chainId);
		this.adapter = adapter;
		this.chainId = chainId;
	}

	/**
	 * Retrieves the yield of the vaults. If TimeFrame is not provided, then it will by default set the fromTimestamp to 1 week ago.
	 * @param {string[]} vaults - Optional array of vault addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield[]>} A promise that resolves to the yield data for the vaults.
	 */
	public async getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		return await this.yieldBackend.getVaultsYield(
			vaults,
			timeFrame ? timeFrame : { fromTimestamp: getTimestampOneWeekAgo() },
		);
	}

	/**
	 * Retrieves the yield of the pools within a given timeframe.
	 * @param {string[]} vaults - Optional array of vault addresses to filter results.
	 * @param {number[]} [pools] - Optional array of pool IDs to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<PoolYield[]>} A promise that resolves to the yield data for the pools.
	 */
	public async getPoolsYield(vaults?: string[], pools?: number[], timeFrame?: TimeFrame): Promise<PoolYield[]> {
		return await this.yieldBackend.getPoolsYield(vaults, pools, timeFrame);
	}

	/**
	 * Retrieves the aggregated yield data for specified vaults, pools, and users within a given timeframe.
	 * @param {string[]} [vaults] - Optional array of vault addresses to filter results.
	 * @param {number[]} [pools] - Optional array of pool IDs to filter results.
	 * @param {string[]} [users] - Optional array of user addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe to limit results within a specific period.
	 * @returns {Promise<YieldAggregated[]>} A promise that resolves to an array of aggregated yield data.
	 */
	async getYields(
		vaults?: string[],
		pools?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		return await this.yieldBackend.getYields(vaults, pools, users, timeFrame);
	}

	async getLastClaimEvent(params: GetLastClaimEventParams) {
		const provider = this.adapter.getProvider();
		const latestBlock = await provider.getBlockNumber();

		const lastClaimEvent = await this.smartContractAdapter.yieldExtractor.getLastClaimEvent(
			params.user,
			params.vault.address,
			params.poolId,
			params.vault.createBlocknumber,
			latestBlock,
		);
		if (!lastClaimEvent) {
			return null;
		}
		return {
			blockNumber: lastClaimEvent.blockNumber,
			transactionHash: lastClaimEvent.transactionHash,
		};
	}

	async getClaimableYield(params: ClaimRequestParams): Promise<ClaimableYield[]> {
		const claimRequests = await this.yieldBackend.getClaimRequests(params);

		const claimedShares = await Promise.all(
			claimRequests.map(c =>
				this.smartContractAdapter.yieldExtractor.getClaimedShares(params.user, c.yelayLiteVault, c.pool),
			),
		);

		return claimRequests.map((c, i) => {
			const totalShares = BigNumber.from(c.yieldSharesTotal);
			const claimedSharesAmount = BigNumber.from(claimedShares[i]);
			const claimable = totalShares - claimedSharesAmount;
			return {
				claimable: claimable.toString(),
				claimed: claimedSharesAmount.toString(),
				claimRequest: c,
			};
		});
	}

	async claimYield(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.yieldExtractor.claim(claimRequests, overrides));
	}
}
