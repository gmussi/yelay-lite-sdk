import { BigNumberish, BrowserProvider, ContractTransactionResponse, encodeBytes32String, JsonRpcSigner } from 'ethers-v6';
import { Signer, Overrides, ContractTransaction } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import IAdapterYelayLiteVault from "./IAdapterYelayLiteVault";

import {
	IYelayLiteVault as IYelayLiteVaultv6,
	IYelayLiteVault__factory as IYelayLiteVault__factoryv6,

} from '../../../generated/typechain-v6';

import {
	IYelayLiteVault as IYelayLiteVaultv5,
	IYelayLiteVault__factory as IYelayLiteVault__factoryv5,
} from '../../../generated/typechain-v5';
import { parseBytes32String } from 'ethers-v5/lib/utils';
import { ClientData, StrategyData } from '../../../types/smartContract';
import { convertBigNumberToBigInt } from '../../../utils/type-transform';

class AdapterYelayLiteVault implements IAdapterYelayLiteVault {

    ethersVersion: 'v6' | 'v5'
    iYelayLiteVault: IYelayLiteVaultv6 | IYelayLiteVaultv5
    provider: BrowserProvider | JsonRpcSigner | Signer | Provider

    constructor(provider: BrowserProvider | JsonRpcSigner | Signer | Provider, vaultAddress: string){

        this.provider = provider
        if (provider.constructor.name === 'BrowserProvider') {
			this.ethersVersion = 'v6'
			this.iYelayLiteVault = IYelayLiteVault__factoryv6.connect(vaultAddress, provider as BrowserProvider);
		} else if (provider.constructor.name === `Signer`) {
            this.ethersVersion = 'v5'
			this.iYelayLiteVault = IYelayLiteVault__factoryv5.connect(vaultAddress, provider as Signer);
		} else if(provider.constructor.name === `JsonRpcSigner`) {
            this.ethersVersion = 'v6'
			this.iYelayLiteVault = IYelayLiteVault__factoryv6.connect(vaultAddress, provider as JsonRpcSigner);
		} else {
            this.ethersVersion = 'v5'
			this.iYelayLiteVault = IYelayLiteVault__factoryv5.connect(vaultAddress, provider as Provider);
		}

    }
    async redeem(amount: bigint, pool: number, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async activateProject(projectId: bigint, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async migratePosition(fromProjectId: bigint, toProjectId: bigint, amount: bigint, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async getPoolsSupplies(vault: string, pools: number[]): Promise<{ totalAssets: bigint; totalSupply: bigint; poolsSupply: bigint[]; }> {
        throw new Error('Method not implemented.');
    }
    async clientData(client: string, vault: string): Promise<ClientData> {
        throw new Error('Method not implemented.');
    }
    async poolActive(vault: string, pool: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async allowance(signer: Signer | JsonRpcSigner, vault: string): Promise<bigint> {
        throw new Error('Method not implemented.');
    }
    async approve(vault: string, amount: bigint, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async activeStrategies(vault: string): Promise<StrategyData[]> {
        throw new Error('Method not implemented.');
    }
   
    async activatePool(vault: string, pool: number, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async migrate(vault: string, fromPool: number, toPool: number, amount: bigint, overrides?: Overrides): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async deposit(vault: string, pool: number, amount: bigint, overrides: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
        const signerAddress = await this.getSignerAddress()
        if(this.ethersVersion === 'v6'){
            this.iYelayLiteVault = IYelayLiteVault__factoryv6.connect(vault, this.provider as JsonRpcSigner)
            return await (this.iYelayLiteVault as IYelayLiteVaultv6).deposit(amount, pool, signerAddress)
        } else {
            this.iYelayLiteVault = IYelayLiteVault__factoryv5.connect(vault, this.provider as Signer)
            return await (this.iYelayLiteVault as IYelayLiteVaultv5).deposit(amount, pool, signerAddress, overrides)
        }
    }

    async totalAssets(): Promise<bigint> {
        const result = await this.iYelayLiteVault.totalAssets()
        return BigInt(result.toString())
    }
    async "totalSupply()"(): Promise<bigint> {
        const result = await this.iYelayLiteVault['totalSupply()']
        return BigInt(result.toString())
    }
    async "totalSupply(uint256)"(id: bigint): Promise<bigint> {
        const result = await this.iYelayLiteVault['totalSupply(uint256)'](id)
        return BigInt(result.toString())
    }
    async underlyingAsset(): Promise<string> {
        return this.iYelayLiteVault.underlyingAsset()
    }
    async balanceOf(account: string, id: bigint, user: string): Promise<bigint> {
        const result = await this.iYelayLiteVault.balanceOf(account, id)
        return BigInt(result.toString())
    }
    async projectIdActive(projectId: bigint): Promise<boolean> {
        return await this.iYelayLiteVault.projectIdActive(projectId)
    }
    async ownerToClientData(owner: string): Promise<{minProjectId: bigint, maxProjectId: bigint, clientName: string}> {
        const result = await this.iYelayLiteVault.ownerToClientData(owner)

        const minProjectId = BigInt(result[0].toString())
        const maxProjectId = BigInt(result[1].toString())
        const clientName = result[2]

        return {
            minProjectId,
            maxProjectId,
            clientName
        }
    }
    async getActiveStrategies(): Promise<StrategyData[]> {
        const result = await this.iYelayLiteVault.getActiveStrategies()

        if(this.ethersVersion === 'v6'){
            return result.map(s => ({
                name: parseBytes32String(s.name),
            }));
        }

        return result.map(s => ({
			name: encodeBytes32String(s.name),
			
		}));
    }
    async strategyAssets(index: bigint, vault?: string): Promise<bigint> {
        const result = await this.iYelayLiteVault.strategyAssets(index)
        return BigInt(result.toString())
    }

    estimateGas(functionName: string): (...args: any[]) => Promise<bigint> {
        if(functionName === "redeem"){
            if(this.ethersVersion === 'v6'){
                return (this.iYelayLiteVault as IYelayLiteVaultv6).redeem.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iYelayLiteVault as IYelayLiteVaultv5).estimateGas.redeem)
            }
		}
		if(functionName === "migratePosition"){
            if(this.ethersVersion === 'v6'){
                return (this.iYelayLiteVault as IYelayLiteVaultv6).migratePosition.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iYelayLiteVault as IYelayLiteVaultv5).estimateGas.migratePosition)
            }
		}
		if(functionName === "activateProject"){
            if(this.ethersVersion === 'v6'){
                return (this.iYelayLiteVault as IYelayLiteVaultv6).activateProject.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iYelayLiteVault as IYelayLiteVaultv5).estimateGas.activateProject)
            }
		}
		if(functionName === "deposit"){
            if(this.ethersVersion === 'v6'){
                return (this.iYelayLiteVault as IYelayLiteVaultv6).deposit.estimateGas
            } else {
                return convertBigNumberToBigInt((this.iYelayLiteVault as IYelayLiteVaultv5).estimateGas.deposit)
            }
		}
		throw new Error("Function not found");
    }

    async getSignerAddress(): Promise<string> {
        if (this.provider.constructor.name === 'JsonRpcSigner') {
            return await (this.provider as JsonRpcSigner).getAddress()
		} else if (this.provider.constructor.name === `Signer`) {
            return await (this.provider as Signer).getAddress()
		} else {
            throw new Error("Signer not supported");
        }
    }

}

export default AdapterYelayLiteVault;
