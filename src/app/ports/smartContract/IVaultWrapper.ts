import {
	BigNumber,
	ContractTransaction,
	Overrides,
	PayableOverrides,
	BigNumberish,
	Signer,
} from '../../../adapters/providers/chain';
import { SwapArgsStruct } from '../../../generated/typechain/VaultWrapper';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<BigNumber>;
	approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction>;
	swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: BigNumberish,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
}
