import { Address, getContract, WalletClient } from "viem";
import { PublicClient } from "viem";
import IYelayLiteVaultAbi from '../../../abis/IYelayLiteVault.json';
import { populateGasLimit } from "../../../utils/smartContract";
import { IYelayLiteVaultViem } from "./IYelayLiteVaultViem";
import { ClientData } from "../../../types";

type ViemOverrides = {
	address: Address;
	abi: any; // Using any for now since the JSON ABI doesn't match Viem's strict Abi type
	functionName: string;
	args: any[];
	account: Address;
	gas?: bigint;
}
class YelayLiteVaultViem implements IYelayLiteVaultViem {

    private walletClient: WalletClient;
    private publicClient: PublicClient;
    private contract: any;

	constructor(walletClient: WalletClient, publicClient: PublicClient, vaultAddress: Address) {
        this.walletClient = walletClient;
        this.publicClient = publicClient;
        this.contract = getContract({
			address: vaultAddress,
			abi: IYelayLiteVaultAbi.abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }


	// Read functions

	async getActiveStrategies(): Promise<number[]> {
		return this.contract.read.getActiveStrategies()
	}
	async totalSupply() {
		return this.contract.read.totalSupply()
	}
	async totalSupplyForPool(pool: number) {
		return this.contract.read.totalSupply([pool])
	}
	async totalAssets() {
		return this.contract.read.totalAssets()
	}
	async ownerToClientData(client: string): Promise<ClientData> {
		return this.contract.read.ownerToClientData(client)
	}
	async projectIdActive(pool: number): Promise<boolean> {
		return this.contract.read.projectIdActive([pool])
	}
	async strategyAssets(index: number): Promise<bigint> {
		return this.contract.read.strategyAssets(index)
	}
	async underlyingAsset(): Promise<Address> {
		return this.contract.read.underlyingAsset()
	}
	async balanceOf(user: string, pool: number): Promise<bigint> {
		return this.contract.read.balanceOf([user, pool])
	}

	// Write functions

	async redeem(vault: string, pool: number, amount: bigint, overrides?: ViemOverrides): Promise<string> {

		const addressList = await this.walletClient.getAddresses()
		const userAddress = addressList[0]

		overrides = {
			address: vault as Address,
			abi: IYelayLiteVaultAbi.abi	,
			functionName: 'redeem',
			args: [amount, pool, userAddress],
			account: userAddress,
		}

		// const gasEstimation = await this.publicClient.estimateContractGas(overrides)
		// console.log(`gasEstimation`, gasEstimation)

		await populateGasLimit(
			this.publicClient.estimateContractGas,
			[overrides],
			overrides,
		);
		console.log(`populateGasLimitDone`)

		const { request } = await this.publicClient.simulateContract(
			overrides
		// {
		// 	address: this.contractAddress,
		// 	abi: IYelayLiteVaultAbi.abi,
		// 	functionName: 'redeem',
		// 	args: [amount, pool, userAddress],
		// 	account: userAddress,
		// 	gas: overrides.gas,
		//   }
		)
		console.log(`request`, request)

		const res = await this.walletClient.writeContract(request)
		console.log(`res`, res)
		return res
	}

	async deposit(vaultAddress: Address, pool: number, amount: bigint, overrides?: ViemOverrides): Promise<string> {

		const userAddressList = await this.walletClient.getAddresses()
		const userAddress = userAddressList[0]

        console.log(`userAddress`, userAddress)
		overrides = {
			address: vaultAddress,
			abi: IYelayLiteVaultAbi.abi	,
			functionName: 'deposit',
			args: [amount, pool, userAddress],
			account: userAddress,
		}
		console.log(`overrides`, overrides)

		// const gasEstimation = await this.publicClient.estimateContractGas(overrides)
		// console.log(`gasEstimation`, gasEstimation)

		await populateGasLimit(
			this.publicClient.estimateContractGas,
			[overrides],
			overrides
		);
		console.log(`populateGasLimitDone`)

		const { request } = await this.publicClient.simulateContract(overrides)
		console.log(`request`, request)

		const res = await this.walletClient.writeContract(request)
		console.log(`res`, res)
		return res

    }
	
	async migratePosition(fromPool: number, toPool: number, amount: bigint, overrides: any) {
		return this.contract.write.migratePosition(fromPool, toPool, amount)
	}
	async activateProject(pool: number, overrides: any) {
		return this.contract.write.activateProject(pool, overrides)
	}
}
export default YelayLiteVaultViem;