import { ClaimRequest } from "../../../types";

interface IYieldExtractorViem {

    queryFilter(filter: any, fromBlock: number, toBlock: number): Promise<any>;
    claim(claimRequests: ClaimRequest[], overrides?: any): Promise<any>;
    yieldSharesClaimed(user: string, vault: string, pool: number): Promise<bigint>;
    filter(filter: any, fromBlock: number, toBlock: number): Promise<any>;
}

export default IYieldExtractorViem;