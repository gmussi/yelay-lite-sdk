/**
 * Ethers v5 adapter barrel.
 * Exports all common types and utilities from ethers v5.
 */
import { Signer as EthersSigner, BigNumber as EthersBigNumber } from 'ethers';

export { BigNumberish, ContractTransaction, Overrides, PayableOverrides, CallOverrides } from 'ethers';

export { Provider } from '@ethersproject/providers';

export * as ethersUtils from 'ethers/lib/utils';

// Export BigNumber as both type and value
export type BigNumber = EthersBigNumber;
export const BigNumber = EthersBigNumber;

// Export Signer as both type and value
export type Signer = EthersSigner;
export const Signer = EthersSigner;
