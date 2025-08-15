import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYelayLiteVault, PoolsSupply } from '../../app/ports/smartContract/IYelayLiteVault';
import { ClientData, StrategyData } from '../../types/smartContract';
import { populateGasLimit } from '../../utils/smartContract';
import { Address, WalletClient } from 'viem';
import IYelayLiteVaultAbi from '../../abis/IYelayLiteVault.json';
import { fromBytes } from 'viem/utils';
import { hexToBytes } from 'viem';
export class YelayLiteVault implements IYelayLiteVault {
	constructor(private contractFactory: IContractFactory) {}

	public async getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);

		const [totalAssets, totalSupply, ...poolsSupply] = await Promise.all([
			yelayLiteVault.totalAssets(),
			yelayLiteVault.totalSupply(),
			...pools.map(p => yelayLiteVault.totalSupplyForPool(p)),
		]);
		return {
			totalAssets,
			totalSupply,
			poolsSupply,
		};
	}

	async getVaultUnderlyingAsset(vault: string): Promise<string> {
		const underlying = this.contractFactory.getYelayLiteVault(vault).underlyingAsset()
		return underlying;
	}

	async allowance(walletClient: WalletClient, vault: string, tokenAddress?: string): Promise<bigint> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		const userAddressList = await walletClient.getAddresses();
		const userAddress = userAddressList[0]
		return this.contractFactory.getErc20(tokenAddress ? tokenAddress : underlying).allowance([userAddress, vault]);
	}

	async approve(vault: string, amount: bigint, overrides: any = {}): Promise<any> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		// const userAddressList = await walletClient.getAddresses()
		const userAddress = 'userAddressList[0]'
		overrides = {
			address: vault as Address,
			abi: IYelayLiteVaultAbi.abi	,
			functionName: 'approve',
			args: [vault, amount],
			account: userAddress,
		}

		await populateGasLimit(
			this.contractFactory.getErc20(underlyingAsset).estimateGas.approve,
			[vault, amount],
			overrides,
		);

		return this.contractFactory.getErc20(underlyingAsset).approve([vault, amount], {
			account: userAddress,
			gas: overrides.gas,
		});
	}

	async deposit(
		vault: string,
		pool: number,
		amount: bigint,
		overrides: any = {},
	): Promise<any> {
		// const userAddressList = await walletClient.getAddresses()
		// const userAddress = userAddressList[0]

		return this.contractFactory.getYelayLiteVault(vault).deposit(vault as Address, pool, amount, overrides)

		// const userAddressList = await walletClient.getAddresses()
		// const userAddress = userAddressList[0]

		// overrides = {
		// 	address: vault as Address,
		// 	abi: IYelayLiteVaultAbi.abi	,
		// 	functionName: 'deposit',
		// 	args: [amount, pool, userAddress],
		// }
		// console.log(`overrides`, overrides)

		// this.contractFactory.publicClient.estimateContractGas(overrides)
		// const gasEstimation = await yelayLiteVault.estimateContractGas(overrides)
		// console.log(`gasEstimation`, gasEstimation)

		// await populateGasLimit(
		// 	yelayLiteVault.estimateContractGas,
		// 	[overrides],
		// 	overrides
		// );

		// console.log(`populateGasLimitDone`)
		// return yelayLiteVault.write.deposit([amount, pool, userAddress],   
		// 	{
		// 		gas: overrides.gas,
		// 	}
		// );
	}

	async redeem(
		vault: string,
		pool: number,
		amount: bigint,
		overrides: any = {},
	): Promise<any> {



		this.contractFactory.getYelayLiteVault(vault).redeem(vault as Address, pool, amount, overrides)


	}

	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: bigint,
		overrides: any = {},
	): Promise<any> {
		// await populateGasLimit(
		// 	this.contractFactory.getYelayLiteVault(vault).estimateGas.migratePosition,
		// 	[fromPool, toPool, amount],
		// 	overrides,
		// );
		return this.contractFactory.getYelayLiteVault(vault).migratePosition(fromPool, toPool, amount, overrides);
	}

	async activatePool(vault: string, pool: number, overrides: any = {}): Promise<any> {
		// await populateGasLimit(
		// 	this.contractFactory.getYelayLiteVault(vault).estimateGas.activateProject,
		// 	[pool],
		// 	overrides,
		// );

		return this.contractFactory.getYelayLiteVault(vault).activateProject(pool, overrides);
	}

	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.contractFactory.getYelayLiteVault(vault).projectIdActive(pool);
	}

	async clientData(client: string, vault: string): Promise<ClientData> {
		const result = await this.contractFactory.getYelayLiteVault(vault).ownerToClientData(client);
		
		return {
			minPool: result.minPool,
			maxPool: result.maxPool,
			clientName: fromBytes(hexToBytes(result.clientName as Address), 'string'),
		};
	}

	async balanceOf(vault: string, pool: number, user: string): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, pool);
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		return (await this.contractFactory.getYelayLiteVault(vault).getActiveStrategies()).map((s: any) => ({
			name: fromBytes(hexToBytes(s.name as Address), 'string'),
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).strategyAssets(index);
	}

	async totalAssets(vault: string): Promise<bigint> {
		return this.contractFactory.getYelayLiteVault(vault).totalAssets();
	}
}
