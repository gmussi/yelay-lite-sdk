import { ContractTransactionResponse, ethers, Overrides, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { SwapArgsStruct } from '../../generated/typechain/VaultWrapper';
import { populateGasLimit } from '../../utils/smartContract';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		pool: number,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		overrides.value = amount.toString();

		await populateGasLimit(vaultWrapper.wrapEthAndDeposit.estimateGas, [vault, pool], overrides);

		return await vaultWrapper.wrapEthAndDeposit(vault, pool, overrides);
	}

	public async vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const userAddress = await signer.getAddress();

		return await this.contractFactory.getErc20(tokenAddress).allowance(userAddress, await vaultWrapper.getAddress());
	}

	public async approveVaultWrapper(
		tokenAddress: string,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		await populateGasLimit(
			this.contractFactory.getErc20(tokenAddress).approve.estimateGas,
			[await vaultWrapper.getAddress(), amount.toString()],
			overrides,
		);

		return this.contractFactory.getErc20(tokenAddress).approve(await vaultWrapper.getAddress(), amount.toString(), overrides);
	}

	public async swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: BigInt,
		overrides: Overrides = {},
	): Promise<ContractTransactionResponse> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		await populateGasLimit(vaultWrapper.swapAndDeposit.estimateGas, [vault, pool, swapData, amount.toString()], overrides);

		return await vaultWrapper.swapAndDeposit(vault, pool, swapData, amount.toString(), overrides);
	}
}
