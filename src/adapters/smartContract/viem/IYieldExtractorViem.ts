import { Address } from "viem";
import { ClaimRequest } from "../../../types";

interface IYieldExtractorViem {

    queryFilter(user: Address, vault: Address, projectId: number, fromBlock: bigint, toBlock: bigint): Promise<any>;
    claim(claimRequests: ClaimRequest[], overrides?: any): Promise<any>;
    yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint>;
    filter(filter: any, fromBlock: number, toBlock: number): Promise<any>;
}

export default IYieldExtractorViem;