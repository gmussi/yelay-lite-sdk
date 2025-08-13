import IAdapterErc20 from '../../adapters/VersionAdapters/AdapterErc20/IAdapterErc20';
import IAdapterVaultWrapper from '../../adapters/VersionAdapters/AdapterVaultWrapper/IAdapterVaultWrapper';
import IAdapterYieldExtractor from '../../adapters/VersionAdapters/AdapterYieldExtractor/IAdapterYieldExtractor';
import IAdapterYelayLiteVault from '../../adapters/VersionAdapters/AdaptetYelayLiteVault/IAdapterYelayLiteVault';

export interface IContractFactory {
	getYelayLiteVault(vault: string): IAdapterYelayLiteVault;
	getVaultWrapper(): IAdapterVaultWrapper;
	getErc20(address: string): IAdapterErc20;
	getYieldExtractor(multicall?: boolean): IAdapterYieldExtractor;
}
