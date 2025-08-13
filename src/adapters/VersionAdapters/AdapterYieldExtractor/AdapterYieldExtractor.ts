import { ContractTransaction, Signer } from "ethers-v5";
import IAdapterYieldExtractor from "./IAdapterYieldExtractor";
import { BrowserProvider, ContractTransactionResponse, JsonRpcSigner } from "ethers-v6";
import { Provider } from "@ethersproject/providers";

class AdapterYieldExtractor implements IAdapterYieldExtractor {

    constructor(private provider: BrowserProvider | JsonRpcSigner | Signer | Provider, address: string) {

        console.log(`AdapterYieldExtractor constructor with address: ${address}, provider: ${provider}`)
    }
    
    claim(args: any[], overrides?: any): Promise<ContractTransaction | ContractTransactionResponse> {
        throw new Error("Method not implemented.");
    }

   

    async queryFilter(
        filter: any,
        fromBlock?: number,
        toBlock?: number
    ): Promise<any[]> {
        // Implementation will depend on the specific contract and provider being used
        // This is a placeholder implementation
        throw new Error("queryFilter method not implemented in AdapterYieldExtractor");
    }

    async yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint> {
        // Implementation will depend on the specific contract and provider being used
        // This is a placeholder implementation
        throw new Error("yieldSharesClaimed method not implemented in AdapterYieldExtractor");
    }

    async getClaimedShares(user: string, vault: string, pool: number): Promise<bigint> {
        // Implementation will depend on the specific contract and provider being used
        // This is a placeholder implementation
        throw new Error("getClaimedShares method not implemented in AdapterYieldExtractor");
    }

    async getLastClaimEvent(
        user: string,
        vault: string,
        pool: number,
        stopBlock: number,
        latestBlock: number,
    ): Promise<any> {
        // Implementation will depend on the specific contract and provider being used
        // This is a placeholder implementation
        throw new Error("getLastClaimEvent method not implemented in AdapterYieldExtractor");
    }


}

export default AdapterYieldExtractor;