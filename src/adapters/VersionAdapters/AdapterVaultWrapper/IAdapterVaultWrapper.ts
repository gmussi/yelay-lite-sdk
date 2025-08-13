import { ContractTransaction, BigNumberish, Overrides} from 'ethers-v5';
import { Signer } from 'ethers-v5';
import { SwapArgsStruct } from '../../../generated/typechain-v6/VaultWrapper';
import { ContractTransactionResponse } from 'ethers-v6';

interface IAdapterVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse>;
	
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint>;
	
	approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse>;
	
	swapAndDeposit(vault: string, pool: number, swapData: SwapArgsStruct, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse>;

	getAddress(): Promise<string>;

	wrapEthAndDeposit(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse>
	estimateGas(functionName: string): (...args: any[]) => Promise<bigint> 
}

export default IAdapterVaultWrapper;