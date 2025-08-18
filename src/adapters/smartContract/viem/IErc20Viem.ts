import { ViemOverrides } from "./YelayLiteVaultViem";

interface IErc20Viem {
    allowance(user: string, vault: string): Promise<bigint>;
    approve(spender: string, amount: bigint, overrides?: ViemOverrides): Promise<any>;
}

export default IErc20Viem