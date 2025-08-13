import { ContractTransactionResponse } from 'ethers-v6';
import { ContractTransaction, Signer, BigNumberish, PayableOverrides } from 'ethers-v5';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { SwapArgsStruct } from '../../generated/typechain-v6/VaultWrapper';
import { populateGasLimit } from '../../utils/smartContract';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides: PayableOverrides = {},
	): Promise<ContractTransaction | ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		overrides.value = amount.toString();

		await populateGasLimit(vaultWrapper.estimateGas('wrapEthAndDeposit'), [vault, pool], overrides);

		return await vaultWrapper.wrapEthAndDeposit(vault, pool, overrides);
	}

	public async vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const userAddress = await signer.getAddress();

		return await this.contractFactory.getErc20(tokenAddress).allowance(userAddress, await vaultWrapper.getAddress());
	}

	public async approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides: PayableOverrides = {},
	): Promise<ContractTransaction | ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		await populateGasLimit(
			this.contractFactory.getErc20(tokenAddress).estimateGas('approve'),
			[await vaultWrapper.getAddress(), amount],
			overrides,
		);

		return this.contractFactory.getErc20(tokenAddress).approve(await vaultWrapper.getAddress(), amount.toString(), overrides);
	}

	public async swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: BigNumberish,
		overrides: PayableOverrides = {},
	): Promise<ContractTransaction | ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		await populateGasLimit(vaultWrapper.estimateGas('swapAndDeposit'), [vault, pool, swapData, amount], overrides);

		return await vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, overrides);
	}
}
