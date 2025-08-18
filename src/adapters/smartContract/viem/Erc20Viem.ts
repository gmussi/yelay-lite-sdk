import { Address, getContract, PublicClient, WalletClient } from "viem"
import ERC20Abi from '../../../abis/ERC20.json';
import { ViemOverrides } from "./YelayLiteVaultViem";
import IErc20Viem from "./IErc20Viem";
import { populateGasLimit } from "../../../utils/smartContract";

class Erc20Viem implements IErc20Viem {

    private walletClient: WalletClient;
    private publicClient: PublicClient;
    private contract: any;

    constructor(walletClient: WalletClient, publicClient: PublicClient, private contractAddress: Address) {
        this.walletClient = walletClient
        this.publicClient = publicClient
        this.contractAddress = contractAddress

        this.contract = getContract({
			address: contractAddress,
			abi: ERC20Abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }
    async approve(spender: string, amount: bigint, overrides?: ViemOverrides): Promise<string> {

        const addressList = await this.walletClient.getAddresses()
		const userAddress = addressList[0]

        const finalOverrides = {
            ...overrides,
			address: this.contractAddress,
			abi: ERC20Abi,
			functionName: 'approve',
			args: [spender, amount],
			account: userAddress,
		}

		await populateGasLimit(
			this.publicClient.estimateContractGas,
			[finalOverrides],
			finalOverrides,
		);

        const { request } = await this.publicClient.simulateContract(
			finalOverrides
		)

        return this.contract.writeContract(request)
    }
    async allowance(user: string, vault: string): Promise<bigint> {
        return this.contract.read.allowance([user, vault])
    }
}

export default Erc20Viem