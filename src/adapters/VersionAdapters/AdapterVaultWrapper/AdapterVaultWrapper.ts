import { BigNumberish, BrowserProvider, JsonRpcSigner, ContractTransactionResponse } from 'ethers-v6';
import { ContractTransaction, Signer, Overrides} from 'ethers-v5';
import IAdapterVaultWrapper from "./IAdapterVaultWrapper";
import { Provider } from '@ethersproject/providers';

import {
	ERC20 as ERC20v6,
	ERC20__factory as ERC20__factoryv6,
	VaultWrapper as VaultWrapperv6,
	VaultWrapper__factory as VaultWrapper__factoryv6,
} from '../../../generated/typechain-v6';

import {
	ERC20 as ERC20v5,
	ERC20__factory as ERC20__factoryv5,
	VaultWrapper as VaultWrapperv5,
	VaultWrapper__factory as VaultWrapper__factoryv5,
} from '../../../generated/typechain-v5';
import { SwapArgsStruct } from '../../../generated/typechain-v6/VaultWrapper';
import { convertBigNumberToBigInt } from '../../../utils/type-transform';
import { ContractAddresses } from '../../../types/config';


class AdapterVaultWrapper implements IAdapterVaultWrapper {

	ethersVersion: 'v6' | 'v5'
	iVaultWrapper: VaultWrapperv6 | VaultWrapperv5

	constructor(provider: BrowserProvider | JsonRpcSigner | Signer | Provider, contractAddresses: ContractAddresses) {

		if (provider.constructor.name === `BrowserProvider` || provider.constructor.name === `JsonRpcSigner`) {
			this.ethersVersion = 'v6'
			this.iVaultWrapper = VaultWrapper__factoryv6.connect(contractAddresses.VaultWrapper, provider as BrowserProvider)
		} else if (provider.constructor.name === `Signer`) {
			this.ethersVersion = 'v5'
			this.iVaultWrapper = VaultWrapper__factoryv5.connect(contractAddresses.VaultWrapper, provider as Signer)
		} else {
			this.ethersVersion = 'v5'
			this.iVaultWrapper = VaultWrapper__factoryv5.connect(contractAddresses.VaultWrapper, provider as Provider)
		}
	}
	async swapAndDeposit(vault: string, pool: number, swapData: SwapArgsStruct, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		// return this.iVaultWrapper.swapAndDeposit(vault, pool, swapData, amount, overrides)
		return await (this.iVaultWrapper as VaultWrapperv6).swapAndDeposit(vault, pool, swapData, amount)
	}
	async wrapEthAndDeposit(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		// return this.iVaultWrapper.wrapEthAndDeposit(vault, pool, overrides)
		return (this.iVaultWrapper as VaultWrapperv6).wrapEthAndDeposit(vault, pool)
	}	
	estimateGas(functionName: string): (...args: any[]) => Promise<bigint> {
		if(functionName === "wrapEthAndDeposit"){
            if(this.ethersVersion === 'v6'){
                return (this.iVaultWrapper as VaultWrapperv6).wrapEthAndDeposit.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iVaultWrapper as VaultWrapperv5).estimateGas.wrapEthAndDeposit)
            }
		}
		if(functionName === "swapAndDeposit"){
            if(this.ethersVersion === 'v6'){
                return (this.iVaultWrapper as VaultWrapperv6).swapAndDeposit.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iVaultWrapper as VaultWrapperv5).estimateGas.swapAndDeposit)
            }
		}
		throw new Error("Function not found");
	}
	depositEth(vault: string, pool: number, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		throw new Error('Method not implemented.');
	}
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<bigint> {
		throw new Error('Method not implemented.');
	}
	approveVaultWrapper(tokenAddress: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		throw new Error('Method not implemented.');
	}
	getAddress(): Promise<string> {
		throw new Error('Method not implemented.');
	}
	

}

export default AdapterVaultWrapper;