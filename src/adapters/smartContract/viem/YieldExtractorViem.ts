import { Abi, Address, getContract, PublicClient, WalletClient } from "viem";
import IYelayLiteVaultAbi from '../../../abis/YieldExtractor.json'
import IYieldExtractorViem from "./IYieldExtractorViem";
import { ClaimRequest } from "../../../types";

class YieldExtractorViem implements IYieldExtractorViem {
    
   
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
			abi: IYelayLiteVaultAbi as Abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }
    async filter(filter: any, fromBlock: number, toBlock: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    async yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint> {
        return this.contract.read.yieldSharesClaimed([user, vault, pool])
    }
    async queryFilter(filter: any, fromBlock: number, toBlock: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async claim(claimRequests: ClaimRequest[], overrides?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

export default YieldExtractorViem;