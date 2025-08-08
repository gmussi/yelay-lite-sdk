import { BigNumber, ContractTransaction, Overrides, Signer, BigNumberish, ethersUtils } from '../providers/chain';
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

	async allowance(signer: Signer, vault: string, tokenAddress?: string): Promise<BigNumber> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		const userAddress = await signer.getAddress();
		return this.contractFactory.getErc20(tokenAddress ? tokenAddress : underlying).allowance(userAddress, vault);
	}

	async approve(vault: string, amount: BigNumberish, overrides: Overrides = {}): Promise<ContractTransaction> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();

		await populateGasLimit(
			this.contractFactory.getErc20(underlyingAsset).estimateGas.approve,
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
	): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();
		const contract = this.contractFactory.getYelayLiteVault(vault);
		const normalizedAmount = typeof amount === 'bigint' ? amount.toString() : amount;

		// Estimate gas for the deposit transaction (fills overrides.gasLimit if missing)
		await populateGasLimit(contract.estimateGas.deposit, [normalizedAmount, pool, userAddress], overrides);

		// Populate the transaction using the v5 contract to ensure proper encoding
		const populated = await (contract as any).populateTransaction.deposit(
			normalizedAmount,
			pool,
			userAddress,
			overrides,
		);

		// Build the transaction request for the v6 signer
		const txRequest: any = {
			to: populated.to ?? contract.address,
			data:
				populated.data ??
				(contract as any).interface.encodeFunctionData('deposit', [normalizedAmount, pool, userAddress]),
		};
		// Attach gasLimit override if present (convert to bigint)
		if (overrides.gasLimit) {
			txRequest.gasLimit = BigInt(overrides.gasLimit.toString());
		}
		// Attach value override if present (convert to bigint)
		if ((overrides as any).value) {
			txRequest.value = BigInt((overrides as any).value.toString());
		}
		// Send the transaction using the v6 signer
		return signer.sendTransaction(txRequest);
	}

	async redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();
		const contract = this.contractFactory.getYelayLiteVault(vault);
		const normalizedAmount = typeof amount === 'bigint' ? amount.toString() : amount;

		await populateGasLimit(contract.estimateGas.redeem, [normalizedAmount, pool, userAddress], overrides);

		const populated = await (contract as any).populateTransaction.redeem(
			normalizedAmount,
			pool,
			userAddress,
			overrides,
		);

		const txRequest: any = {
			to: populated.to ?? (contract as any).address,
			data:
				populated.data ??
				(contract as any).interface.encodeFunctionData('redeem', [normalizedAmount, pool, userAddress]),
		};
		if (overrides.gasLimit) {
			txRequest.gasLimit = BigInt(overrides.gasLimit.toString());
		}
		if ((overrides as any).value) {
			txRequest.value = BigInt((overrides as any).value.toString());
		}
		return signer.sendTransaction(txRequest);
	}

	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.migratePosition,
			[fromPool, toPool, amount],
			overrides,
		);
		return this.contractFactory.getYelayLiteVault(vault).migratePosition(fromPool, toPool, amount, overrides);
	}

	async activatePool(vault: string, pool: number, overrides: Overrides = {}): Promise<ContractTransaction> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.activateProject,
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
			clientName: ethersUtils.parseBytes32String(result.clientName),
		};
	}

	async balanceOf(vault: string, pool: number, user: string): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, pool);
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		const strategies = await this.contractFactory.getYelayLiteVault(vault).getActiveStrategies();
		return strategies.map((s: StrategyData) => ({
			name: ethersUtils.parseBytes32String(s.name),
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).strategyAssets(index);
	}

	async totalAssets(vault: string): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).totalAssets();
	}
}
