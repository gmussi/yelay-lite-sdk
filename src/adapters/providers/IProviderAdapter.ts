/**
 * Adapter interface to unify different provider libraries (ethers v5, ethers v6, viem).
 */
export interface IProviderAdapter {
	/**
	 * Returns a compatible provider instance for contract interactions.
	 */
	getProvider(): any;

	/**
	 * Returns a compatible signer instance for transaction signing, if applicable.
	 */
	getSigner?(): any;
}
