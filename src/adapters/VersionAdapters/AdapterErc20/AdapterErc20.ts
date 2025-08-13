import { BigNumberish, ContractTransactionResponse, BrowserProvider, JsonRpcSigner } from "ethers-v6";
import { ContractTransaction, Signer, Overrides  } from "ethers-v5";
import { Provider } from '@ethersproject/providers';

import IAdapterErc20 from "./IAdapterErc20";
import { convertBigNumberToBigInt } from "../../../utils/type-transform";
import { ERC20 as Erc20v6, ERC20__factory as Erc20__factoryv6 } from '../../../generated/typechain-v6';
import { ERC20 as Erc20v5, ERC20__factory as Erc20__factoryv5 } from '../../../generated/typechain-v5';


class AdapterErc20 implements IAdapterErc20 {

    ethersVersion: 'v6' | 'v5'
    iErc20: Erc20v6 | Erc20v5

    constructor(provider: BrowserProvider | JsonRpcSigner | Signer | Provider, address: string) {

        if (provider.constructor.name === 'BrowserProvider') {
			this.ethersVersion = 'v6'
			this.iErc20 = Erc20__factoryv6.connect(address, provider as BrowserProvider)
		} else if (provider.constructor.name === `Signer`) {
			this.ethersVersion = 'v5'
			this.iErc20 = Erc20__factoryv5.connect(address, provider as Signer)
		} else if(provider.constructor.name === `JsonRpcSigner`) {
			this.ethersVersion = 'v6'
			this.iErc20 = Erc20__factoryv6.connect(address, provider as JsonRpcSigner)
		} else {
			this.ethersVersion = 'v5'
			this.iErc20 = Erc20__factoryv5.connect(address, provider as Provider)
		}
    }
    estimateGas(functionName: string): (...args: any[]) => Promise<bigint> {
        if(functionName === "wrapEthAndDeposit"){
            if(this.ethersVersion === 'v6'){
                return (this.iErc20 as Erc20v6).approve.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iErc20 as Erc20v5).estimateGas.approve)
            }
		}

		throw new Error("Function not found");
    }
    allowance(owner: string, spender: string): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    approve(spender: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransactionResponse | ContractTransaction> {
        throw new Error("Method not implemented.");
    }

   
}

export default AdapterErc20;