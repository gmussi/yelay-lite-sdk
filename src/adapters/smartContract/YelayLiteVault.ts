import { ContractTransactionResponse, ethers, Overrides, Signer } from 'ethers';
import { encodeBytes32String } from "ethers";

import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYelayLiteVault, PoolsSupply } from '../../app/ports/smartContract/IYelayLiteVault';
import { ClientData, StrategyData } from '../../types/smartContract';
import { populateGasLimit } from '../../utils/smartContract';

export class YelayLiteVault implements IYelayLiteVault {
	constructor(private contractFactory: IContractFactory) {}

	public async getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const [totalAssets, totalSupply, ...poolsSupply] = await Promise.all([
			yelayLiteVault.totalAssets(),
			yelayLiteVault['totalSupply()'](),
			...pools.map(p => yelayLiteVault['totalSupply(uint256)'](p)),
		]);
		return {
			totalAssets,
			totalSupply,
			poolsSupply,
		};
	}

	async getVaultUnderlyingAsset(vault: string): Promise<string> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		return underlying;
	}

	async allowance(signer: Signer, vault: string, tokenAddress?: string): Promise<bigint> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		const userAddress = await signer.getAddress();
		return this.contractFactory.getErc20(tokenAddress ? tokenAddress : underlying).allowance(userAddress, vault);
	}

	async approve(vault: string, amount: BigInt, overrides: Overrides = {}): Promise<ContractTransactionResponse> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();

		await populateGasLimit(
			this.contractFactory.getErc20(underlyingAsset).approve.estimateGas,
			[vault, amount.toString()],
			overrides,
		);

		return this.contractFactory.getErc20(underlyingAsset).approve(vault, amount.toString(), overrides);
	}

	async deposit(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const userAddress = (await signer.getAddress()).toLowerCase();

		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault)

		await populateGasLimit(
			yelayLiteVault.deposit.estimateGas,
			[amount.toString(), pool, userAddress],
			overrides,
		);

		return yelayLiteVault.deposit(amount.toString(), pool, userAddress, overrides);
	}

	async redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const userAddress = await signer.getAddress();

		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).redeem.estimateGas,
			[amount.toString(), pool, userAddress],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).redeem(amount.toString(), pool, userAddress, overrides);
	}

	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).migratePosition.estimateGas,
			[fromPool, toPool, amount.toString()],
			overrides,
		);
		return this.contractFactory.getYelayLiteVault(vault).migratePosition(fromPool, toPool, amount.toString(), overrides);
	}

	async activatePool(vault: string, pool: number, overrides: Overrides = {}): Promise<ContractTransactionResponse> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).activateProject.estimateGas,
			[pool],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).activateProject(pool, overrides);
	}

	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.contractFactory.getYelayLiteVault(vault).projectIdActive(pool);
	}

	async clientData(client: string, vault: string): Promise<ClientData> {
		const result = await this.contractFactory.getYelayLiteVault(vault).ownerToClientData(client);
		return {
			minPool: Number(result.minProjectId),
			maxPool: Number(result.maxProjectId),
			clientName: encodeBytes32String(result.clientName),
			
		};
	}

	async balanceOf(vault: string, pool: number, user: string): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, pool);
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		return (await this.contractFactory.getYelayLiteVault(vault).getActiveStrategies()).map(s => ({
			name: encodeBytes32String(s.name),
			
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).strategyAssets(index);
	}

	async totalAssets(vault: string): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).totalAssets();
	}
}
