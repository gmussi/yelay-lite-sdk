import { BrowserProvider, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import {
	ERC20,
	ERC20__factory,
	IYelayLiteVault,
	IYelayLiteVault__factory,
	VaultWrapper,
	VaultWrapper__factory,
	YieldExtractor,
	YieldExtractor__factory,
} from '../../generated/typechain';
import { ContractAddresses } from '../../types/config';

export class ContractFactory implements IContractFactory {
	private browserProvider: BrowserProvider | Signer;

	constructor(_browserProvider: BrowserProvider | Signer, private contractAddresses: ContractAddresses) {
		this.browserProvider = _browserProvider;
	}

	getYelayLiteVault(vault: string): IYelayLiteVault {
		return IYelayLiteVault__factory.connect(vault, this.browserProvider);
	}

	getVaultWrapper(): VaultWrapper {
		return VaultWrapper__factory.connect(this.contractAddresses.VaultWrapper, this.browserProvider);
	}

	getErc20(address: string): ERC20 {
		return ERC20__factory.connect(address, this.browserProvider);
	}

	getYieldExtractor(multicall = false): YieldExtractor {
		return YieldExtractor__factory.connect(
			this.contractAddresses.YieldExtractor,
			multicall ? this.browserProvider : this.browserProvider,
		);
	}
}
