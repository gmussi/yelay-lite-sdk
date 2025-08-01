/**
 * Type-safe chain adapter factory that supports multiple web3 frameworks.
 * Usage: import { createChainAdapter } from './chain';
 * const adapter = createChainAdapter('ethers5');
 */

// Framework-specific type definitions
// Type aliases for each framework’s utils module
type Ethers5Utils = typeof import('ethers/lib/utils');
type Ethers6Utils = typeof import('./chain-ethers6').ethersUtils;
type ViemUtils = typeof import('./chain-viem').ethersUtils;
// Conditional mapping for the adapter’s utils
type UtilsType<T extends Framework> = T extends 'ethers5'
	? Ethers5Utils
	: T extends 'ethers6'
	? Ethers6Utils
	: T extends 'viem'
	? ViemUtils
	: never;

export type Framework = 'ethers5' | 'ethers6' | 'viem';

// Conditional types based on framework
export type BigNumberType<T extends Framework> = T extends 'ethers5'
	? import('ethers').BigNumber
	: T extends 'ethers6'
	? bigint
	: T extends 'viem'
	? bigint
	: never;

export type SignerType<T extends Framework> = T extends 'ethers5'
	? import('ethers').Signer
	: T extends 'ethers6'
	? import('ethers-v6').Signer
	: T extends 'viem'
	? import('viem').WalletClient
	: never;

export type ProviderType<T extends Framework> = T extends 'ethers5'
	? import('@ethersproject/providers').Provider
	: T extends 'ethers6'
	? import('ethers-v6').Provider
	: T extends 'viem'
	? import('viem').PublicClient
	: never;

// Common types that work across all frameworks
export type BigNumberish = bigint | string | number;
export type ContractTransaction = any; // Could be made framework-specific if needed
export type Overrides = any; // Could be made framework-specific if needed
export type PayableOverrides = any; // Could be made framework-specific if needed
export type CallOverrides = any; // Could be made framework-specific if needed

// Define the adapter interface that all frameworks must implement
export interface ChainAdapter<T extends Framework = Framework> {
	BigNumber: {
		from: (value: BigNumberish) => BigNumberType<T>;
		isBigNumber: (value: unknown) => value is BigNumberType<T>;
	};
	Signer: {
		isSigner: (obj: unknown) => obj is SignerType<T>;
	};
	ethersUtils: UtilsType<T>;
}

// Factory function that returns the appropriate adapter based on framework
export function createChainAdapter<T extends Framework>(framework: T): ChainAdapter<T> {
	switch (framework) {
		case 'ethers5':
			return require('./chain-ethers5') as ChainAdapter<T>;
		case 'ethers6':
			return require('./chain-ethers6') as ChainAdapter<T>;
		case 'viem':
			return require('./chain-viem') as ChainAdapter<T>;
		default:
			throw new Error(`Unsupported framework: ${framework}`);
	}
}

// Type-safe factory that returns properly typed exports
export function createTypedChainAdapter<T extends Framework>(framework: T) {
	const adapter = createChainAdapter(framework);

	return {
		// Re-export the adapter with proper typing
		adapter,

		// Export types based on framework
		BigNumber: adapter.BigNumber,
		Signer: adapter.Signer,
		ethersUtils: adapter.ethersUtils,

		// Framework-specific type exports with proper typing
		BigNumberType: adapter.BigNumber as ChainAdapter<T>['BigNumber'],
		SignerType: adapter.Signer as ChainAdapter<T>['Signer'],
	};
}

// Legacy compatibility - exports the default adapter (ethers5)
// This maintains backward compatibility while encouraging the new pattern
const defaultAdapter = createChainAdapter('ethers5');

export const ethersUtils = defaultAdapter.ethersUtils;
export const Signer = defaultAdapter.Signer;
export const BigNumber = defaultAdapter.BigNumber;

// Export types for backward compatibility (using ethers5 as default)
export type BigNumber = BigNumberType<'ethers5'>;
export type Signer = SignerType<'ethers5'>;
export type Provider = ProviderType<'ethers5'>;

// Export adapters for each framework
export const ethers5 = createChainAdapter('ethers5');
export const ethers6 = createChainAdapter('ethers6');
export const viem = createChainAdapter('viem');

// Default export for backward compatibility
export default defaultAdapter;
