/**
 * Example usage of the new chain adapter imports
 *
 * This demonstrates how to import specific web3 libraries
 * instead of using the global setChainAdapter approach.
 */

// Method 1: Import specific library (recommended)
import { ethers5 } from '../adapters/providers/chain';
import { ethers6 } from '../adapters/providers/chain';
import { viem } from '../adapters/providers/chain';

// Method 2: Import default (ethers5 for backward compatibility)
import chain from '../adapters/providers/chain';

// Method 3: Import specific types and utilities
import { BigNumber, Signer, Provider } from '../adapters/providers/chain';

// Example usage with ethers5
export function exampleEthers5Usage() {
	// Use ethers5 specific types and utilities
	const bigNumber = ethers5.BigNumber.from('1000000000000000000');
	const utils = ethers5.ethersUtils;

	console.log('Ethers5 BigNumber:', bigNumber.toString());
	console.log('Ethers5 utils:', utils.parseEther('1.0'));
}

// Example usage with ethers6
export function exampleEthers6Usage() {
	// Use ethers6 specific types and utilities
	const bigNumber = ethers6.BigNumber.from('1000000000000000000');
	const utils = ethers6.ethersUtils;

	console.log('Ethers6 BigNumber:', bigNumber.toString());
	console.log('Ethers6 utils:', utils.parseEther('1.0'));
}

// Example usage with viem
export function exampleViemUsage() {
	// Use viem specific types and utilities
	const bigNumber = viem.BigNumber.from('1000000000000000000');
	const utils = viem.ethersUtils;

	console.log('Viem BigNumber:', bigNumber.toString());
	console.log(
		'Viem utils:',
		utils.parseBytes32String('0x68656c6c6f000000000000000000000000000000000000000000000000000000'),
	);
}

// Example usage with default import (ethers5)
export function exampleDefaultUsage() {
	// Use default import (ethers5)
	const bigNumber = chain.BigNumber.from('1000000000000000000');
	const utils = chain.ethersUtils;

	console.log('Default BigNumber:', bigNumber.toString());
	console.log('Default utils:', utils.parseEther('1.0'));
}
