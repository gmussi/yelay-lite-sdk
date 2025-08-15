import { IYelayLiteVaultViem } from '../../adapters/smartContract/viem/IYelayLiteVaultViem';
import IYieldExtractorViem from '../../adapters/smartContract/viem/IYieldExtractorViem';

export interface IContractFactory {
	getYelayLiteVault(vault: string): IYelayLiteVaultViem;
	getVaultWrapper(): any;
	getErc20(address: string): any;
	getYieldExtractor(multicall?: boolean): IYieldExtractorViem;
}
