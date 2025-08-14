import { Address } from "viem";

export interface IYelayLiteVaultViem {
    deposit(vaultAddress: Address, pool: number, amount: bigint, overrides: any): Promise<string>;
	redeem(vault: string, pool: number, amount: bigint, overrides?: any): Promise<string>;
	totalAssets(): any;
	totalSupply(): any;
	migratePosition(fromPool: number, toPool: number, amount: bigint, overrides: any): any;
	activateProject(pool: number, overrides: any): any;
	projectIdActive(pool: number): boolean | PromiseLike<boolean>;
	ownerToClientData(client: string): { minProjectId: number; maxProjectId: number; clientName: string };
	balanceOf(user: string, pool: number): bigint | PromiseLike<bigint>;
	getActiveStrategies(): any[];
	strategyAssets(index: number): bigint | PromiseLike<bigint>;
    underlyingAsset(): Promise<Address>;
    allowance(user: Address, spender: Address): Promise<bigint>;
    approve(spender: Address, amount: bigint): Promise<any>;
}