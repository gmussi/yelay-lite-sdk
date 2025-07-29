import { BigNumber, ContractTransaction, Overrides } from '../../../adapters/providers/chain';
import { YieldClaimedEvent } from '../../../generated/typechain/YieldExtractor';
import { ClaimRequest } from '../../../types';

export interface IYieldExtractor {
	getClaimedShares(user: string, vault: string, pool: number): Promise<BigNumber>;
	claim(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction>;
	getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<YieldClaimedEvent | null>;
}
