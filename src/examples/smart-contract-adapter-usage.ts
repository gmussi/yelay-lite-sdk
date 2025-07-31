/**
 * Example usage of the updated SmartContractAdapter with type-safe framework selection
 */

import { SmartContractAdapter } from '../adapters/smartContract';
import { type Framework } from '../adapters/providers/chain';
import { ContractAddresses } from '../types/config';

// Example contract addresses (you would get these from your config)
const contractAddresses: ContractAddresses = {
	VaultWrapper: '0x1234567890123456789012345678901234567890',
	Swapper: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
	YieldExtractor: '0x0987654321098765432109876543210987654321',
	// Add other contract addresses as needed
};

// Example 1: Using with ethers v5
function exampleWithEthers5() {
	// You would get these from your ethers v5 setup
	const ethers5Provider = {} as any; // Replace with actual ethers v5 provider
	const ethers5Signer = {} as any; // Replace with actual ethers v5 signer

	// Create adapter with ethers v5
	const adapter = new SmartContractAdapter('ethers5', ethers5Signer, contractAddresses);

	// TypeScript knows this is ethers v5 types
	const vault = adapter.yelayLiteVault;
	const wrapper = adapter.vaultWrapper;
	const extractor = adapter.yieldExtractor;
}

// Example 2: Using with ethers v6
function exampleWithEthers6() {
	// You would get these from your ethers v6 setup
	const ethers6Provider = {} as any; // Replace with actual ethers v6 provider
	const ethers6Signer = {} as any; // Replace with actual ethers v6 signer

	// Create adapter with ethers v6
	const adapter = new SmartContractAdapter('ethers6', ethers6Signer, contractAddresses);

	// TypeScript knows this is ethers v6 types
	const vault = adapter.yelayLiteVault;
	const wrapper = adapter.vaultWrapper;
	const extractor = adapter.yieldExtractor;
}

// Example 3: Using with viem
function exampleWithViem() {
	// You would get these from your viem setup
	const viemPublicClient = {} as any; // Replace with actual viem public client
	const viemWalletClient = {} as any; // Replace with actual viem wallet client

	// Create adapter with viem
	const adapter = new SmartContractAdapter('viem', viemWalletClient, contractAddresses);

	// TypeScript knows this is viem types
	const vault = adapter.yelayLiteVault;
	const wrapper = adapter.vaultWrapper;
	const extractor = adapter.yieldExtractor;
}

// Example 4: Generic function that works with any framework
function createSmartContractAdapter<T extends Framework>(
	framework: T,
	signerOrProvider: any, // This would be properly typed based on framework
	addresses: ContractAddresses,
) {
	return new SmartContractAdapter(framework, signerOrProvider, addresses);
}

// Example 5: Framework-agnostic utility
function demonstrateFrameworkUsage() {
	// Create adapters for different frameworks
	const ethers5Adapter = createSmartContractAdapter('ethers5', {} as any, contractAddresses);
	const ethers6Adapter = createSmartContractAdapter('ethers6', {} as any, contractAddresses);
	const viemAdapter = createSmartContractAdapter('viem', {} as any, contractAddresses);

	// All adapters have the same interface but with framework-specific types internally
	console.log('Ethers v5 adapter created:', ethers5Adapter);
	console.log('Ethers v6 adapter created:', ethers6Adapter);
	console.log('Viem adapter created:', viemAdapter);
}

// Example 6: Type-safe framework selection
function createAdapterWithTypeSafety<T extends Framework>(framework: T) {
	return {
		framework,
		createAdapter: (signerOrProvider: any, addresses: ContractAddresses) => {
			return new SmartContractAdapter(framework, signerOrProvider, addresses);
		},
		// You can add framework-specific logic here
		isEthers5: framework === 'ethers5',
		isEthers6: framework === 'ethers6',
		isViem: framework === 'viem',
	};
}

export function demonstrateUsage() {
	// Create framework-specific factories
	const ethers5Factory = createAdapterWithTypeSafety('ethers5');
	const ethers6Factory = createAdapterWithTypeSafety('ethers6');
	const viemFactory = createAdapterWithTypeSafety('viem');

	// Create adapters using the factories
	const adapter1 = ethers5Factory.createAdapter({} as any, contractAddresses);
	const adapter2 = ethers6Factory.createAdapter({} as any, contractAddresses);
	const adapter3 = viemFactory.createAdapter({} as any, contractAddresses);

	console.log('Framework-specific adapters created successfully');
}
