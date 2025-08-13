import { ContractTransactionResponse } from 'ethers-v6';
import { BigNumberish, ContractTransaction, Signer, Overrides} from 'ethers-v5';
import { ClientData, StrategyData } from '../../../types/smartContract';

export type PoolsSupply = {
	totalAssets: bigint;
	totalSupply: bigint;
	poolsSupply: bigint[];
};

export interface IYelayLiteVault {
	getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply>;
	allowance(signer: Signer, vault: string): Promise<bigint>;
	approve(vault: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransactionResponse | ContractTransaction>;
	deposit(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransactionResponse>;
	redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransactionResponse>;
	migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransactionResponse>;
	activatePool(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransactionResponse>;
	poolActive(vault: string, pool: number): Promise<boolean>;
	clientData(client: string, vault: string): Promise<ClientData>;
	balanceOf(vault: string, pool: number, user: string): Promise<bigint>;
	activeStrategies(vault: string): Promise<StrategyData[]>;
	strategyAssets(vault: string, index: number): Promise<bigint>;
	totalAssets(vault: string): Promise<bigint>;
}
