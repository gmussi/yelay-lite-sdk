/**
 * Barrel for ethers v6 types and utils.
 * Based on ethers v6 migration - BigNumber is now bigint, utils moved to root
 */
import * as ethersV6 from 'ethers-v6';

// In ethers v6, BigNumber is replaced with native JS bigint
// But we provide a compatibility layer for existing code
export type BigNumber = bigint;
export type BigNumberish = bigint | string | number;

// Compatibility layer for BigNumber to match ethers v5 API
export const BigNumber = {
	from: (value: BigNumberish): bigint => {
		if (typeof value === 'bigint') return value;
		if (typeof value === 'string') return BigInt(value);
		if (typeof value === 'number') return BigInt(value);
		return BigInt(value);
	},
	isBigNumber: (value: any): value is bigint => {
		return typeof value === 'bigint';
	},
};

// Re-export other types that exist in v6
export type { ContractTransaction, Overrides, Provider } from 'ethers-v6';

// v6 doesn't have separate PayableOverrides/CallOverrides - they merged into Overrides
export type PayableOverrides = ethersV6.Overrides & { value?: bigint };
export type CallOverrides = ethersV6.Overrides;

// Export Signer as both type and value
export type Signer = ethersV6.Signer;
export const Signer = {
	...ethersV6.AbstractSigner,
	isSigner: (obj: any): obj is ethersV6.Signer => {
		return obj && typeof obj.getAddress === 'function' && typeof obj.signTransaction === 'function';
	},
};

// ethers v6 moved utils to root level (no more ethers.utils.*)
export const ethersUtils = {
	parseBytes32String: ethersV6.decodeBytes32String, // renamed in v6
	// Add other utilities as needed
	parseEther: ethersV6.parseEther,
	formatEther: ethersV6.formatEther,
	keccak256: ethersV6.keccak256,
};
