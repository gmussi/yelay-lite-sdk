import { Abi, Address, getContract, PublicClient, WalletClient } from "viem";
import IYelayLiteVaultAbi from '../../../abis/YieldExtractor.json'
import IYieldExtractorViem from "./IYieldExtractorViem";
import { ClaimRequest } from "../../../types";

class YieldExtractorViem implements IYieldExtractorViem {
    
   
    private walletClient: WalletClient;
    private publicClient: PublicClient;
    private contract: any;
	private contractAddress: Address;
    
    constructor(walletClient: WalletClient, publicClient: PublicClient, contractAddress: Address) {
        this.walletClient = walletClient;
        this.publicClient = publicClient;
		this.contractAddress = contractAddress.toLowerCase() as Address;
        this.contract = getContract({
			address: contractAddress,
			abi: IYelayLiteVaultAbi as Abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});
    }
    async yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint> {
        return this.contract.read.yieldSharesClaimed([user, vault, pool])
    }
    async queryFilter(user: Address, vault: Address, projectId: number, fromBlock: bigint, toBlock: bigint): Promise<any> {
        
        const logs = await this.publicClient.getContractEvents({ 
            address: this.contractAddress,
            abi: IYelayLiteVaultAbi as Abi,
            eventName: 'YieldClaimed',
            args: {
                user: user,
                yelayLiteVault: vault,
                projectId: projectId,
            },
            fromBlock,
            toBlock
          })
          return logs
    }
    async claim(claimRequests: ClaimRequest[], overrides?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async filter(filter: any, fromBlock: number, toBlock: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

export default YieldExtractorViem;