import { BrowserProvider, JsonRpcSigner, ContractTransactionResponse } from 'ethers-v6';
import { BigNumberish, Signer, ContractTransaction, Overrides } from 'ethers-v5';
import { Provider } from '@ethersproject/providers';
import { VaultsBackend } from '../../adapters/backend/VaultsBackend';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { ClientData } from '../../types/smartContract';
import { Vault } from '../../types/vaults';
import { tryCall } from '../../utils/smartContract';
import { SwapArgsStruct } from '../../generated/typechain-v6/VaultWrapper';
import { IVaultsBackend } from '../ports/backend/IVaultsBackend';
import { ContractAddresses } from '../../types/config';

function isSigner(obj: any): obj is Signer {
	return obj && typeof obj.getAddress === 'function' && typeof obj.signMessage === 'function';
}

export class Vaults {
	private smartContractAdapter: SmartContractAdapter;
	private vaultsBackend: IVaultsBackend;
	private browserProvider: BrowserProvider | JsonRpcSigner | Signer | Provider;

	constructor(
		backendUrl: string,
		chainId: number,
		_browserProvider: BrowserProvider | JsonRpcSigner | Signer | Provider,
		config: ContractAddresses
	) {
		this.smartContractAdapter = new SmartContractAdapter(_browserProvider, config);
		this.vaultsBackend = new VaultsBackend(backendUrl, chainId);
		this.browserProvider = _browserProvider;
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	public async getVaults(): Promise<Vault[]> {
		return this.vaultsBackend.getVaults();
	}

	/**
	 * Deposits a specified amount of ETH into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {BigNumberish} amount - The amount of ETH to deposit (in wei).
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the deposit transaction.
	 *
	 * This method wraps the specified ETH amount and deposits it into the target vault for the given pool.
	 * It uses the VaultWrapper contract to handle ETH wrapping and depositing in a single transaction.
	 */
	public async depositEth(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		return tryCall(this.smartContractAdapter.vaultWrapper.depositEth(vault, pool, amount, overrides));
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async allowance(vault: string): Promise<bigint> {
		if (!isSigner(this.browserProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}
		return this.smartContractAdapter.yelayLiteVault.allowance(this.browserProvider, vault);
	}

	/**
	 * Checks if a given pool ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param pool - The pool ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the pool ID is active.
	 */
	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.smartContractAdapter.yelayLiteVault.poolActive(vault, pool);
	}

	/**
	 * Retrieves data about a specific client in the specified vault.
	 *
	 * @param {string} client - The address of the client.
	 * @param {string} vault - The address of the vault contract.
	 * @returns A promise that resolves to a `ClientData` object containing:
	 *   - `minPool`: The minimum pool ID associated with the client (as a number).
	 *   - `maxPool`: The maximum pool ID associated with the client (as a number).
	 *   - `clientName`: The name of the client decoded from a bytes32 string.
	 */
	async clientData(client: string, vault: string): Promise<ClientData> {
		return this.smartContractAdapter.yelayLiteVault.clientData(client, vault);
	}

	/**
	 * Retrieves the balance of a user for a specific pool within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified pool.
	 */
	async balanceOf(vault: string, pool: number, user: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.balanceOf(vault, BigInt(pool), user);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} vault - The address of the vault.
	 * @param {BigNumberish} amount - The amount to approve.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the approval transaction.
	 */
	async approve(vault: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		return tryCall(this.smartContractAdapter.yelayLiteVault.approve(vault, BigInt(amount.toString()), overrides));
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} tokenAddress - The address of the token.
	 * @param {BigNumberish} amount - The amount to approve.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	 */
	async approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		return tryCall(this.smartContractAdapter.vaultWrapper.approveVaultWrapper(tokenAddress, BigInt(amount.toString()), overrides));
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} tokenAddress - Token address
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async vaultWrapperAllowance(tokenAddress: string): Promise<bigint> {
		if (!isSigner(this.browserProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}
		return this.smartContractAdapter.vaultWrapper.vaultWrapperAllowance(this.browserProvider, tokenAddress);
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {BigNumberish} amount - The amount to deposit.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the deposit transaction.
	 */
	async deposit(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		if (!isSigner(this.browserProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}

		return tryCall(
			this.smartContractAdapter.yelayLiteVault.deposit(vault, pool, BigInt(amount.toString()), overrides),
		);
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {BigNumberish} amount - The amount to deposit.
	 * @param {SwapArgsStruct} swapData - Swap args from 1inch.
	 * @param {Overrides} callOverrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the deposit transaction.
	 */
	async swapAndDeposit(
		vault: string,
		pool: number,
		amount: BigNumberish,
		swapData: SwapArgsStruct,
		callOverrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		return tryCall(
			this.smartContractAdapter.vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, callOverrides),
		);
	}

	/**
	 * Withdraws a specified amount from a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {BigNumberish} amount - The amount to withdraw.\
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the withdrawal transaction.
	 */
	async redeem(
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		if (!isSigner(this.browserProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}
		return tryCall(
			this.smartContractAdapter.yelayLiteVault.redeem(BigInt(amount.toString()), pool, overrides),
		);
	}

	/**
	 * Activates a specific pool within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool to activate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the activation transaction.
	 */
	async activatePool(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransaction | ContractTransactionResponse> {
		return tryCall(this.smartContractAdapter.yelayLiteVault.activatePool(vault, pool, overrides));
	}

	/**
	 * Migrates a position from one pool to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromPool - The ID of the pool to migrate from.
	 * @param {number} toPool - The ID of the pool to migrate to.
	 * @param {BigNumberish} amount - The amount to migrate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction | ContractTransactionResponse>} A promise that resolves to the result of the migration transaction.
	 */
	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction | ContractTransactionResponse> {
		return this.smartContractAdapter.yelayLiteVault.migrate(vault, fromPool, toPool, BigInt(amount.toString()), overrides);
	}
}
