import { ContractTransactionResponse, Overrides } from 'ethers';
import { YieldClaimedEvent } from '../../../generated/typechain/YieldExtractor';
import { ClaimRequest } from '../../../types';
import { TypedContractEvent, TypedEventLog } from '../../../generated/typechain/common';

export interface IYieldExtractor {
	getClaimedShares(user: string, vault: string, pool: number): Promise<bigint>;
	claim(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransactionResponse>;
	getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<TypedEventLog<TypedContractEvent<YieldClaimedEvent.InputTuple,YieldClaimedEvent.OutputTuple, YieldClaimedEvent.OutputObject>> | null>;
}
