/**
 * Barrel for viem types and utilities.
 */
import { PublicClient, WalletClient, createPublicClient, http } from 'viem';

export type BigNumber = bigint;
export type BigNumberish = bigint | string;

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

export type ContractTransaction = any;
export type Overrides = { gasLimit?: number };
export type PayableOverrides = Overrides & { value?: bigint };
export type CallOverrides = Overrides;
export type Signer = WalletClient;
export type Provider = PublicClient;

export { PublicClient, WalletClient, createPublicClient, http };

export const ethersUtils = {
	parseBytes32String: (hex: string): string => {
		const bytes = Buffer.from(hex.replace(/^0x/, ''), 'hex');
		return bytes.toString('utf8').replace(/\0.*$/, '');
	},
};

// Mock Signer class for viem compatibility
export const Signer = {
	isSigner: (obj: any): boolean => {
		// For viem, check if it's a WalletClient
		return obj && typeof obj.signTransaction === 'function' && typeof obj.signMessage === 'function';
	},
};
