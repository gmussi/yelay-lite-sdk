import { Address } from "viem";
import { ClientData } from "../../../types";

export interface IYelayLiteVaultViem {
    deposit(vaultAddress: Address, pool: number, amount: bigint, overrides: any): Promise<string>;
	redeem(vault: string, pool: number, amount: bigint, overrides?: any): Promise<string>;
	totalAssets(): Promise<bigint>;
	totalSupply(): Promise<bigint>;
	totalSupplyForPool(pool: number): Promise<bigint>;
	migratePosition(fromPool: number, toPool: number, amount: bigint, overrides: any): any;
	activateProject(pool: number, overrides: any): any;
	projectIdActive(pool: number): boolean | PromiseLike<boolean>;
	ownerToClientData(client: string): Promise<ClientData>;
	balanceOf(user: string, pool: number): bigint | PromiseLike<bigint>;
	getActiveStrategies(): Promise<number[]>;
	strategyAssets(index: number): bigint | PromiseLike<bigint>;
    underlyingAsset(): Promise<Address>;
}