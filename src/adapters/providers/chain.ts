/**
 * Dynamic chain adapter that switches implementation at runtime.
 * The adapter type is set by the YelayLiteSdk constructor.
 */

// Global variable to store the selected adapter type
let selectedAdapter: 'ethers5' | 'ethers6' | 'viem' = 'ethers5';

// Function to set the adapter type (called from YelayLiteSdk constructor)
export function setChainAdapter(adapterType: 'ethers5' | 'ethers6' | 'viem') {
	selectedAdapter = adapterType;
}

// Dynamic re-exports based on selected adapter
function getAdapterExports() {
	switch (selectedAdapter) {
		case 'ethers6':
			return require('./chain-ethers6');
		case 'viem':
			return require('./chain-viem');
		default:
			return require('./chain-ethers5');
	}
}

// Re-export everything from the selected adapter
const adapterExports = getAdapterExports();

// Export types
export type BigNumber = any;
export type BigNumberish = any;
export type ContractTransaction = any;
export type Overrides = any;
export type PayableOverrides = any;
export type CallOverrides = any;
export type Signer = any;
export type Provider = any;

// Export utilities and values
export const ethersUtils = adapterExports.ethersUtils;
export const Signer = adapterExports.Signer;
export const BigNumber = adapterExports.BigNumber;
