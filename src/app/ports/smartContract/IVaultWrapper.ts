import { WalletClient } from "viem";

export interface IVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: bigint,
		overrides?: any,
	): Promise<any>;
	vaultWrapperAllowance(signer: WalletClient, tokenAddress: string): Promise<bigint>;
	approveVaultWrapper(
		tokenAddress: string,
		amount: bigint,
		overrides?: any,
	): Promise<any>;
	swapAndDeposit(
		vault: string,
		pool: number,
		swapData: {},
		amount: bigint,
		overrides?: any,
	): Promise<any>;
}
