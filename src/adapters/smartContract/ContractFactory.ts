import { BrowserProvider, JsonRpcSigner } from 'ethers-v6';
import { Signer } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { ContractAddresses } from '../../types/config';
import AdapterYelayLiteVault from '../VersionAdapters/AdaptetYelayLiteVault/AdapterYelayLiteVault';
import IAdapterVaultWrapper from '../VersionAdapters/AdapterVaultWrapper/IAdapterVaultWrapper';
import AdapterVaultWrapper from '../VersionAdapters/AdapterVaultWrapper/AdapterVaultWrapper';
import IAdapterErc20 from '../VersionAdapters/AdapterErc20/IAdapterErc20';
import AdapterErc20 from '../VersionAdapters/AdapterErc20/AdapterErc20';
import AdapterYieldExtractor from '../VersionAdapters/AdapterYieldExtractor/AdapterYieldExtractor';
import IAdapterYieldExtractor from '../VersionAdapters/AdapterYieldExtractor/IAdapterYieldExtractor';
import IAdapterYelayLiteVault from '../VersionAdapters/AdaptetYelayLiteVault/IAdapterYelayLiteVault';

export class ContractFactory implements IContractFactory {
	private browserProvider: BrowserProvider | JsonRpcSigner | Signer | Provider;

	constructor(signerOrProvider: BrowserProvider | JsonRpcSigner | Signer | Provider, private contractAddresses: ContractAddresses) {
		this.browserProvider = signerOrProvider
	}

	getYelayLiteVault(vaultAddress: string): IAdapterYelayLiteVault {
		return new AdapterYelayLiteVault(this.browserProvider, vaultAddress)
	}

	getVaultWrapper(): IAdapterVaultWrapper {
		return new AdapterVaultWrapper(this.browserProvider, this.contractAddresses)
	}

	getErc20(address: string): IAdapterErc20 {
		return new AdapterErc20(this.browserProvider, address)
	}

	getYieldExtractor(multicall = false): IAdapterYieldExtractor {
		return new AdapterYieldExtractor(this.browserProvider, this.contractAddresses.YieldExtractor)
	}
}

