import { IYelayLiteVaultViem } from '../../adapters/smartContract/viem/IYelayLiteVaultViem';

export interface IContractFactory {
	getYelayLiteVault(vault: string): IYelayLiteVaultViem;
	getVaultWrapper(): any;
	getErc20(address: string): any;
	getYieldExtractor(multicall?: boolean): any;
}
