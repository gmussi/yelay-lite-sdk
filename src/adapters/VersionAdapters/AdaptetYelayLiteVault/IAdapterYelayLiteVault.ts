import { JsonRpcSigner } from "ethers-v6";
import { ClientData, StrategyData } from "../../../types";
import { Signer, Overrides } from "ethers-v5";

interface IAdapterYelayLiteVault {
	// View functions
	totalAssets(vault?: string): Promise<bigint>;
	"totalSupply()"(): Promise<bigint>;
	"totalSupply(uint256)"(id: bigint): Promise<bigint>;
	underlyingAsset(): Promise<string>;
	balanceOf(account: string, id: bigint, user?: string): Promise<bigint>;
	projectIdActive(projectId: bigint): Promise<boolean>;
	ownerToClientData(owner: string): Promise<{
		minProjectId: bigint;
		maxProjectId: bigint;
		clientName: string;
	}>;
	getPoolsSupplies(vault: string, pools: number[]): Promise<{
		totalAssets: bigint;
		totalSupply: bigint;
		poolsSupply: bigint[];
	}>;
	clientData(client: string, vault: string): Promise<ClientData>;
	poolActive(vault: string, pool: number): Promise<boolean>;
	allowance(signer: Signer | JsonRpcSigner, vault: string): Promise<bigint>;
	redeem(amount: bigint,pool: number, overrides?: Overrides): Promise<any>;
	activatePool(vault: string, pool: number, overrides?: Overrides): Promise<any>;
	migrate(vault: string, fromPool: number, toPool: number, amount: bigint, overrides?: Overrides): Promise<any>;
	getActiveStrategies(): Promise<StrategyData[]>;
	strategyAssets(index: bigint, vault?: string): Promise<bigint>;
	deposit(vault: string, pool: number, amount: bigint, overrides?: Overrides): Promise<any>;
	approve(vault: string, amount: bigint, overrides?: Overrides): Promise<any>;
	activeStrategies(vault: string): Promise<StrategyData[]>;
	activateProject(projectId: bigint, overrides?: Overrides): Promise<any>;
	migratePosition(fromProjectId: bigint, toProjectId: bigint, amount: bigint, overrides?: Overrides): Promise<any>;
	estimateGas(functionName: string): (...args: any[]) => Promise<bigint>

	

}

export default IAdapterYelayLiteVault;