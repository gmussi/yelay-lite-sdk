import { Address, getContract, PublicClient, WalletClient } from "viem"
import VaultWrapperAbi from "../../../abis/VaultWrapper.json";
import IVaultWrapperViem from "./IVaultWrapperViem";
import { ViemOverrides } from "./YelayLiteVaultViem";
import { populateGasLimit } from "../../../utils/smartContract";

class VaultWrapperViem implements IVaultWrapperViem {

    private walletClient: WalletClient;
    private publicClient: PublicClient;
    address: any;
    private contract: any

    constructor(walletClient: WalletClient, publicClient: PublicClient, contractAddress: Address) {
        this.walletClient = walletClient
        this.publicClient = publicClient
        this.address = contractAddress
        this.contract = getContract({
			address: contractAddress,
			abi: VaultWrapperAbi.abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }
    async wrapEthAndDeposit(vault: string, pool: number, overrides?: ViemOverrides): Promise<string> {

        const addressList = await this.walletClient.getAddresses()
		const userAddress = addressList[0]

        const finalOverrides = {
            ...overrides,
			address: vault as Address,
			abi: VaultWrapperAbi.abi,
			functionName: 'wrapEthAndDeposit',
			args: [vault, pool],
			account: userAddress,
		}

		await populateGasLimit(
			this.publicClient.estimateContractGas,
			[finalOverrides],
			finalOverrides,
		);

		const { request } = await this.publicClient.simulateContract(finalOverrides)

        return this.contract.writeContract(request)
    }
    async swapAndDeposit(vault: string, pool: number, swapData: {blockNumber: number, transactionHash: string}, amount: bigint, overrides?: ViemOverrides): Promise<string> {

        const addressList = await this.walletClient.getAddresses()
		const userAddress = addressList[0]

        const finalOverrides = {
            ...overrides,
			address: vault as Address,
			abi: VaultWrapperAbi.abi,
			functionName: 'swapAndDeposit',
			args: [vault, pool, swapData, amount],
			account: userAddress,
		}

		await populateGasLimit(
			this.publicClient.estimateContractGas,
			[finalOverrides],
			finalOverrides,
		);

		const { request } = await this.publicClient.simulateContract(finalOverrides)

        return this.contract.writeContract(request)
    }
}

export default VaultWrapperViem