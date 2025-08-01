import { IProviderAdapter } from '../../adapters/providers/IProviderAdapter';
import { BigNumber, CallOverrides, ContractTransaction, Overrides, BigNumberish } from '../../adapters/providers/chain';
import { VaultsBackend } from '../../adapters/backend/VaultsBackend';
import { ClientData } from '../../types/smartContract';
import { Vault } from '../../types/vaults';
import { tryCall } from '../../utils/smartContract';
import { IVaultWrapper } from '../ports/smartContract/IVaultWrapper';
import { IYelayLiteVault } from '../ports/smartContract/IYelayLiteVault';
import { IVaultsBackend } from '../ports/backend/IVaultsBackend';

// Placeholder for SwapArgsStruct from typechain
type SwapArgsStruct = any;

export class Vaults {
	private vaultWrapper: IVaultWrapper;
	private yelayLiteVault: IYelayLiteVault;
	private vaultsBackend: IVaultsBackend;
	private adapter: IProviderAdapter;

	constructor(
		vaultWrapper: IVaultWrapper,
		yelayLiteVault: IYelayLiteVault,
		backendUrl: string,
		chainId: number,
		adapter: IProviderAdapter,
	) {
		this.vaultWrapper = vaultWrapper;
		this.yelayLiteVault = yelayLiteVault;
		this.vaultsBackend = new VaultsBackend(backendUrl, chainId);
		this.adapter = adapter;
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
	 * @param {ethers.BigNumberish} amount - The amount of ETH to deposit (in wei).
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
	): Promise<ContractTransaction> {
		return tryCall(this.vaultWrapper.depositEth(vault, pool, amount, overrides));
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async allowance(vault: string): Promise<BigNumber> {
		const signer = this.adapter.getSigner?.();
		if (!signer) {
			throw new Error('Signer not provided');
		}
		return this.yelayLiteVault.allowance(signer, vault);
	}

	/**
	 * Checks if a given pool ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param pool - The pool ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the pool ID is active.
	 */
	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.yelayLiteVault.poolActive(vault, pool);
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
		return this.yelayLiteVault.clientData(client, vault);
	}

	/**
	 * Retrieves the balance of a user for a specific pool within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified pool.
	 */
	async balanceOf(vault: string, pool: number, user: string): Promise<BigNumber> {
		return this.yelayLiteVault.balanceOf(vault, pool, user);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} vault - The address of the vault.
	 * @param {ethers.BigNumberish} amount - The amount to approve.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	 */
	async approve(vault: string, amount: BigNumberish, overrides?: Overrides): Promise<ContractTransaction> {
		return tryCall(this.yelayLiteVault.approve(vault, amount, overrides));
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} tokenAddress - The address of the token.
	 * @param {ethers.BigNumberish} amount - The amount to approve.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	 */
	async approveVaultWrapper(
		tokenAddress: string,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction> {
		return tryCall(this.vaultWrapper.approveVaultWrapper(tokenAddress, amount, overrides));
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} tokenAddress - Token address
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async vaultWrapperAllowance(tokenAddress: string): Promise<BigNumber> {
		const signer = this.adapter.getSigner?.();
		if (!signer) {
			throw new Error('Signer not provided');
		}
		return this.vaultWrapper.vaultWrapperAllowance(signer, tokenAddress);
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {ethers.BigNumberish} amount - The amount to deposit.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the deposit transaction.
	 */
	public async deposit(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction> {
		const signer = this.adapter.getSigner?.();
		if (!signer) {
			throw new Error('Signer not provided');
		}

		return tryCall(this.yelayLiteVault.deposit(signer, vault, pool, amount, overrides));
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {ethers.BigNumberish} amount - The amount to deposit.
	 * @param {SwapArgsStruct} swapData - Swap args from 1inch.
	 * @param {CallOverrides} callOverrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the deposit transaction.
	 */
	public async swapAndDeposit(
		vault: string,
		pool: number,
		amount: BigNumberish,
		swapData: SwapArgsStruct,
		callOverrides?: CallOverrides,
	): Promise<ContractTransaction> {
		return tryCall(this.vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, callOverrides));
	}

	/**
	 * Withdraws a specified amount from a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {ethers.BigNumberish} amount - The amount to withdraw.\
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the withdrawal transaction.
	 */
	public async redeem(
		vault: string,
		pool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction> {
		const signer = this.adapter.getSigner?.();
		if (!signer) {
			throw new Error('Signer not provided');
		}
		return tryCall(this.yelayLiteVault.redeem(signer, vault, pool, amount, overrides));
	}

	/**
	 * Activates a specific pool within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool to activate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the activation transaction.
	 */
	async activatePool(vault: string, pool: number, overrides?: Overrides): Promise<ContractTransaction> {
		return tryCall(this.yelayLiteVault.activatePool(vault, pool, overrides));
	}

	/**
	 * Migrates a position from one pool to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromPool - The ID of the pool to migrate from.
	 * @param {number} toPool - The ID of the pool to migrate to.
	 * @param {ethers.BigNumberish} amount - The amount to migrate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the migration transaction.
	 */
	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction> {
		return this.yelayLiteVault.migrate(vault, fromPool, toPool, amount, overrides);
	}
}
