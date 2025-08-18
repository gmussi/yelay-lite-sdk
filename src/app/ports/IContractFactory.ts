import { IYelayLiteVaultViem } from '../../adapters/smartContract/viem/IYelayLiteVaultViem';
import IYieldExtractorViem from '../../adapters/smartContract/viem/IYieldExtractorViem';
import IErc20Viem from '../../adapters/smartContract/viem/IErc20Viem';
import IVaultWrapperViem from '../../adapters/smartContract/viem/IVaultWrapperViem';

export interface IContractFactory {
	getYelayLiteVault(vault: string): IYelayLiteVaultViem;
	getVaultWrapper(): IVaultWrapperViem;
	getErc20(address: string): IErc20Viem;
	getYieldExtractor(multicall?: boolean): IYieldExtractorViem;
}
