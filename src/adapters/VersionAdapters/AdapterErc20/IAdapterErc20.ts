import { ContractTransactionResponse } from 'ethers-v6';
import { ContractTransaction, BigNumberish, Overrides } from 'ethers-v5';
interface IAdapterErc20 {
	allowance(owner: string, spender: string): Promise<bigint>;
	estimateGas(functionName: string): (...args: any[]) => Promise<bigint>;
	approve(spender: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransactionResponse | ContractTransaction>;
}

export default IAdapterErc20