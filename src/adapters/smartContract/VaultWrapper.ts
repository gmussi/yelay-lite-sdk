import { WalletClient } from 'viem';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { populateGasLimit } from '../../utils/smartContract';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		pool: number,
		amount: bigint,
		overrides: any = {},
	): Promise<any> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		overrides.value = amount;

		return await vaultWrapper.wrapEthAndDeposit(vault, pool, overrides);
	}

	public async vaultWrapperAllowance(walletClient: WalletClient, tokenAddress: string): Promise<bigint> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const addressList = await walletClient.getAddresses()
		const userAddress = addressList[0]

		return await this.contractFactory.getErc20(tokenAddress).allowance(userAddress, vaultWrapper.address);
	}

	public async approveVaultWrapper(
		tokenAddress: string,
		amount: bigint,
		overrides: any = {},
	): Promise<any> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

	
		return this.contractFactory.getErc20(tokenAddress).approve(vaultWrapper.address, amount, overrides);
	}

	public async swapAndDeposit(
		vault: string,
		pool: number,
		swapData: {blockNumber: number, transactionHash: string},
		amount: bigint,
		overrides: any = {},
	): Promise<any> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		// await populateGasLimit(vaultWrapper.estimateGas.swapAndDeposit, [vault, pool, swapData, amount], overrides);

		return await vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, overrides);
	}
}
