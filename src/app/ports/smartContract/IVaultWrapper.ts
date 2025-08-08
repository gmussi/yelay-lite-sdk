import { ContractTransactionResponse, ethers, Overrides, Signer } from 'ethers';
import { SwapArgsStruct } from '../../../generated/typechain/VaultWrapper';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: ethers.BigNumberish,
		overrides?: any,
	): Promise<ContractTransactionResponse>;
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint>;
	approveVaultWrapper(
		tokenAddress: string,
		amount: ethers.BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransactionResponse>;
	swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: ethers.BigNumberish,
		overrides?: any,
	): Promise<ContractTransactionResponse>;
}
