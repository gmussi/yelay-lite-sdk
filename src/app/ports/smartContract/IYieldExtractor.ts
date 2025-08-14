import { ClaimRequest } from '../../../types';

export interface IYieldExtractor {
	getClaimedShares(user: string, vault: string, pool: number): Promise<bigint>;
	claim(claimRequests: ClaimRequest[], overrides?: any): Promise<any>;
	getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<{blockNumber: number, transactionHash: string} | null>;
}
