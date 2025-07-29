import { BigNumber, ContractTransaction, Overrides, Signer, BigNumberish } from '../../../adapters/providers/chain';
import { ClientData, StrategyData } from '../../../types/smartContract';

export type PoolsSupply = {
	totalAssets: BigNumber;
	totalSupply: BigNumber;
	poolsSupply: BigNumber[];
};

export interface IYelayLiteVault {
	getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply>;
	allowance(signer: Signer, vault: string): Promise<BigNumber>;
	approve(vault: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction>;
	deposit(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction>;
	redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction>;
	migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction>;
	activatePool(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransaction>;
	poolActive(vault: string, pool: number): Promise<boolean>;
	clientData(client: string, vault: string): Promise<ClientData>;
	balanceOf(vault: string, pool: number, user: string): Promise<BigNumber>;
	activeStrategies(vault: string): Promise<StrategyData[]>;
	strategyAssets(vault: string, index: number): Promise<BigNumber>;
	totalAssets(vault: string): Promise<BigNumber>;
}
