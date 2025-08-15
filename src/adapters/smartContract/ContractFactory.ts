import { type Address, type Client, getContract, type Abi, GetContractReturnType, PublicClient, createPublicClient, http, WalletClient } from 'viem';
import { IContractFactory } from '../../app/ports/IContractFactory';

import VaultWrappertAbi from '../../abis/VaultWrapper.json';
import ERC20Abi from '../../abis/ERC20.json';
import { ContractAddresses } from '../../types/config';
import { IYelayLiteVaultViem } from './viem/IYelayLiteVaultViem';
import YelayLiteVaultViem from './viem/YelayLiteVaultViem';
import YieldExtractorViem from './viem/YieldExtractorViem';
import IYieldExtractorViem from './viem/IYieldExtractorViem';


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

	getVaultWrapper() {
		return getContract({
			address: this.contractAddresses.VaultWrapper as Address,
			abi: VaultWrappertAbi.abi,
			client: this.walletClient,
		});
	}

	getErc20(address: string) {
		return getContract({
			address: address as Address,
			abi: ERC20Abi as Abi,
			client: this.walletClient,
		});
	}

	getYieldExtractor(multicall = false): IYieldExtractorViem {
		return new YieldExtractorViem(this.walletClient, this.publicClient, this.contractAddresses.YieldExtractor as Address)
	}
}
