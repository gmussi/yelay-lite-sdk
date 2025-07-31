/**
 * Example usage of the type-safe chain adapter factory
 */

import { createChainAdapter, createTypedChainAdapter, type Framework } from '../adapters/providers/chain';

// Example 1: Basic usage with type safety
function exampleWithEthers5() {
	const adapter = createChainAdapter('ethers5');

	// TypeScript now knows this is ethers v5 BigNumber
	const amount = adapter.BigNumber.from('1000000000000000000');

	// TypeScript knows this is ethers v5 Signer
	const isValidSigner = adapter.Signer.isSigner({} as any);

	// TypeScript knows this is ethers v5 utils
	const formattedAmount = (adapter.ethersUtils as any).formatEther(amount);
}

// Example 2: Usage with ethers v6
function exampleWithEthers6() {
	const adapter = createChainAdapter('ethers6');

	// TypeScript now knows this is bigint (ethers v6)
	const amount = adapter.BigNumber.from('1000000000000000000');

	// TypeScript knows this is ethers v6 Signer
	const isValidSigner = adapter.Signer.isSigner({} as any);
}

// Example 3: Usage with viem
function exampleWithViem() {
	const adapter = createChainAdapter('viem');

	// TypeScript now knows this is bigint (viem)
	const amount = adapter.BigNumber.from('1000000000000000000');

	// TypeScript knows this is viem WalletClient
	const isValidSigner = adapter.Signer.isSigner({} as any);
}

// Example 4: Generic function that works with any framework
function processAmount<T extends Framework>(framework: T, amountString: string) {
	const adapter = createChainAdapter(framework);
	const amount = adapter.BigNumber.from(amountString);

	// TypeScript will infer the correct type based on the framework
	return (adapter.ethersUtils as any).formatEther(amount);
}

// Example 5: Using the typed factory for more control
function exampleWithTypedFactory() {
	const typedAdapter = createTypedChainAdapter('ethers5');

	// You get both the adapter and the properly typed exports
	const { adapter, BigNumberType, SignerType } = typedAdapter;

	// Use the adapter directly
	const amount = adapter.BigNumber.from('1000000000000000000');

	// Or use the typed exports
	const amount2 = BigNumberType.from('1000000000000000000');
}

// Example 6: Framework-agnostic utility function
function createFrameworkAdapter<T extends Framework>(framework: T) {
	return {
		framework,
		adapter: createChainAdapter(framework),
		// You can add framework-specific logic here
		isEthers5: framework === 'ethers5',
		isEthers6: framework === 'ethers6',
		isViem: framework === 'viem',
	};
}

// Usage examples
export function demonstrateUsage() {
	// Create adapters for different frameworks
	const ethers5Adapter = createFrameworkAdapter('ethers5');
	const ethers6Adapter = createFrameworkAdapter('ethers6');
	const viemAdapter = createFrameworkAdapter('viem');

	// Process amounts with different frameworks
	const amount1 = processAmount('ethers5', '1000000000000000000');
	const amount2 = processAmount('ethers6', '1000000000000000000');
	const amount3 = processAmount('viem', '1000000000000000000');

	console.log('Ethers v5 amount:', amount1);
	console.log('Ethers v6 amount:', amount2);
	console.log('Viem amount:', amount3);
}
