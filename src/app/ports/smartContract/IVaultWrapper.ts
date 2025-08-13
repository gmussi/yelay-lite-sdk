import { ContractTransactionResponse } from 'ethers-v6';
import { BigNumberish, ContractTransaction, Signer, Overrides} from 'ethers-v5';
import { SwapArgsStruct } from '../../../generated/typechain-v6/VaultWrapper';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: any,
	): Promise<ContractTransaction | ContractTransactionResponse>;
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint>;
	approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse>;
	swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: BigNumberish,
		overrides?: any,
	): Promise<ContractTransaction | ContractTransactionResponse>;
}
