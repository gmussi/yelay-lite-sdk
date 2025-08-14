import { ClientData, StrategyData } from '../../../types/smartContract';
import { PublicClient, WalletClient } from 'viem';

export type PoolsSupply = {
	totalAssets: bigint;
	totalSupply: bigint;
	poolsSupply: bigint[];
};

export interface IYelayLiteVault {
	getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply>;
	allowance(walletClient: WalletClient, vault: string): Promise<bigint>;
	approve(vault: string, amount: bigint, overrides?: any): Promise<any>;
	deposit(
		vault: string,
		pool: number,
		amount: bigint,
		overrides?: any,
	): Promise<any>;
	redeem(
		vault: string,
		pool: number,
		amount: bigint,
		overrides?: any,
	): Promise<any>;
	migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: bigint,
		overrides?: any,
	): Promise<any>;
	activatePool(vault: string, pool: number, overrides?: any): Promise<any>;
	poolActive(vault: string, pool: number): Promise<boolean>;
	clientData(client: string, vault: string): Promise<ClientData>;
	balanceOf(vault: string, pool: number, user: string): Promise<bigint>;
	activeStrategies(vault: string): Promise<StrategyData[]>;
	strategyAssets(vault: string, index: number): Promise<bigint>;
	totalAssets(vault: string): Promise<bigint>;
}
