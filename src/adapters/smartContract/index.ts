
import { BrowserProvider, JsonRpcSigner } from 'ethers-v6';
import AdapterVaultWrapper from '../VersionAdapters/AdapterVaultWrapper/AdapterVaultWrapper';
import IAdapterVaultWrapper from '../VersionAdapters/AdapterVaultWrapper/IAdapterVaultWrapper';
import IAdapterYieldExtractor from '../VersionAdapters/AdapterYieldExtractor/IAdapterYieldExtractor';
import IAdapterYelayLiteVault from '../VersionAdapters/AdaptetYelayLiteVault/IAdapterYelayLiteVault';
import { Signer } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import AdapterYelayLiteVault from '../VersionAdapters/AdaptetYelayLiteVault/AdapterYelayLiteVault';
import AdapterYieldExtractor from '../VersionAdapters/AdapterYieldExtractor/AdapterYieldExtractor';
import { ContractAddresses } from '../../types/config';

export class SmartContractAdapter {
	public vaultWrapper: IAdapterVaultWrapper;
	public yelayLiteVault: IAdapterYelayLiteVault;
	public yieldExtractor: IAdapterYieldExtractor;

	constructor(provider: BrowserProvider | JsonRpcSigner | Signer | Provider, contractAddresses: ContractAddresses) {
		this.vaultWrapper = new AdapterVaultWrapper(provider, contractAddresses);
		this.yelayLiteVault = new AdapterYelayLiteVault(provider, 'asd');
		this.yieldExtractor = new AdapterYieldExtractor(provider, 'asd');
	}
}
