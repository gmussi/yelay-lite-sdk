import { Abi, Address, getContract, WalletClient } from "viem";
import { PublicClient } from "viem";
import IYelayLiteVaultAbi from '../../../abis/IYelayLiteVault.json';
import { populateGasLimit } from "../../../utils/smartContract";
import { IYelayLiteVaultViem } from "./IYelayLiteVaultViem";

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
	private contractAddress: Address;

	constructor(walletClient: WalletClient, publicClient: PublicClient, vaultAddress: Address) {
        this.walletClient = walletClient;
        this.publicClient = publicClient;
		this.contractAddress = vaultAddress.toLowerCase() as Address;
        this.contract = getContract({
			address: vaultAddress,
			abi: IYelayLiteVaultAbi.abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }

	balanceOf(user: string, pool: number): bigint | PromiseLike<bigint> {
		return this.contract.read.balanceOf([user, pool])
	}

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

	async totalSupply() {
		return this.contract.read.totalSupply()
	}
	async totalSupplyForPool(pool: number) {
		return this.contract.read.totalSupply([pool])
	}

	ownerToClientData(client: string): { minProjectId: number; maxProjectId: number; clientName: string; } {
		throw new Error("Method not implemented.");
	}
	async totalAssets() {
		return this.contract.read.totalAssets()
	}
	
	migratePosition(fromPool: number, toPool: number, amount: bigint, overrides: any) {
		throw new Error("Method not implemented.");
	}
	activateProject(pool: number, overrides: any) {
		throw new Error("Method not implemented.");
	}
	projectIdActive(pool: number): boolean | PromiseLike<boolean> {
		throw new Error("Method not implemented.");
	}
	getActiveStrategies() {
		return this.contract.read.getActiveStrategies()
	}
	strategyAssets(index: number): bigint | PromiseLike<bigint> {
		return this.contract.read.strategyAssets()
	}
	underlyingAsset(): Promise<Address> {
		throw new Error("Method not implemented.");
	}
	allowance(user: Address, spender: Address): Promise<bigint> {
		throw new Error("Method not implemented.");
	}
	approve(spender: Address, amount: bigint): Promise<any> {
		throw new Error("Method not implemented.");
	}
}
export default YelayLiteVaultViem;