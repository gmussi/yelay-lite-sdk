import { type Address, PublicClient, WalletClient } from 'viem';
import { IContractFactory } from '../../app/ports/IContractFactory';

import { ContractAddresses } from '../../types/config';
import { IYelayLiteVaultViem } from './viem/IYelayLiteVaultViem';
import YelayLiteVaultViem from './viem/YelayLiteVaultViem';
import YieldExtractorViem from './viem/YieldExtractorViem';
import IYieldExtractorViem from './viem/IYieldExtractorViem';
import Erc20Viem from './viem/Erc20Viem';
import VaultWrapperViem from './viem/VaultWrapperViem';
import IVaultWrapperViem from './viem/IVaultWrapperViem';
import IErc20Viem from './viem/IErc20Viem';


export class ContractFactory implements IContractFactory {

	walletClient: WalletClient;
	publicClient: PublicClient;

	constructor(
		walletClient: WalletClient,
		publicClient: PublicClient,
		private contractAddresses: ContractAddresses
	) {
		this.walletClient = walletClient;
		this.publicClient = publicClient;
		this.contractAddresses = contractAddresses;
	}

	
	getYelayLiteVault(vault: string): IYelayLiteVaultViem {
		return new YelayLiteVaultViem(this.walletClient, this.publicClient, vault as Address);
	}

	getVaultWrapper(): IVaultWrapperViem {
		return new VaultWrapperViem(this.walletClient, this.publicClient, this.contractAddresses.VaultWrapper as Address)
	}

	getErc20(address: string): IErc20Viem {
		return new Erc20Viem(this.walletClient, this.publicClient, address as Address)
	}

	getYieldExtractor(multicall = false): IYieldExtractorViem {
		return new YieldExtractorViem(this.walletClient, this.publicClient, this.contractAddresses.YieldExtractor as Address)
	}
}
