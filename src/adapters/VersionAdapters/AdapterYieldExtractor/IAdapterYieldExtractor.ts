import { ContractTransaction } from "ethers-v5";
import { ContractTransactionResponse } from "ethers-v6";

interface IAdapterYieldExtractor {
	queryFilter(
		filter: any,
		fromBlock?: number,
		toBlock?: number
	): Promise<any[]>;
	
	yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint>;
	
	getClaimedShares(user: string, vault: string, pool: number): Promise<bigint>;
	
	getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<any>;
	
	claim(args: any[], overrides?: any): Promise<ContractTransaction | ContractTransactionResponse>;
}

export default IAdapterYieldExtractor;