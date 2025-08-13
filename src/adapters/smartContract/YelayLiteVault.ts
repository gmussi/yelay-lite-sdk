import { ContractTransactionResponse, encodeBytes32String } from 'ethers-v6';
import { BigNumberish, ContractTransaction, Signer, Overrides} from 'ethers-v5';

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
			...pools.map(p => yelayLiteVault['totalSupply(uint256)'](BigInt(p))),
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

	async approve(vault: string, amount: BigNumberish, overrides: Overrides = {}): Promise<ContractTransactionResponse | ContractTransaction> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();

		await populateGasLimit(
			this.contractFactory.getErc20(underlyingAsset).estimateGas('approve'),
			[vault, amount],
			overrides,
		);

		return this.contractFactory.getErc20(underlyingAsset).approve(vault, amount, overrides);
	}

	async deposit(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const userAddress = await signer.getAddress();

		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas('deposit'),
			[BigInt(amount.toString()), BigInt(pool), userAddress],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).deposit(vault, pool, BigInt(amount.toString()), overrides);
	}

	async redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const userAddress = await signer.getAddress();

		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas('redeem'),
			[BigInt(amount.toString()), BigInt(pool), userAddress],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).redeem(BigInt(amount.toString()), pool, overrides);
	}

	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas('migratePosition'),
			[BigInt(amount.toString()), BigInt(toPool), BigInt(amount.toString())],
			overrides,
		);
		return this.contractFactory.getYelayLiteVault(vault).migratePosition(BigInt(fromPool), BigInt(toPool),BigInt( amount.toString()), overrides);
	}

	async activatePool(vault: string, pool: number, overrides: Overrides = {}): Promise<ContractTransactionResponse> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas('activateProject'),
			[BigInt(pool)],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).activateProject(BigInt(pool), overrides);
	}

	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.contractFactory.getYelayLiteVault(vault).projectIdActive(BigInt(pool));
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
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, BigInt(pool));
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		return (await this.contractFactory.getYelayLiteVault(vault).getActiveStrategies()).map(s => ({
			name: encodeBytes32String(s.name),
			
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).strategyAssets(BigInt(index));
	}

	async totalAssets(vault: string): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).totalAssets();
	}
}
