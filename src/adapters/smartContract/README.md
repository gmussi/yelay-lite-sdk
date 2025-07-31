# Smart Contract Adapter

The `SmartContractAdapter` provides a type-safe way to interact with smart contracts across multiple web3 frameworks (ethers v5, ethers v6, and viem).

## Key Features

-   **Type-safe framework selection**: Choose your framework at construction time
-   **Framework-specific types**: Each framework gets its proper types (e.g., `BigNumber` vs `bigint`)
-   **Unified interface**: Same API across all frameworks
-   **No runtime configuration**: Framework is selected at construction time

## Constructor Changes

### Old Constructor (Deprecated)

```typescript
// Required manual ContractFactory creation
const contractFactory = new ContractFactory(signerOrProvider, contractAddresses, 'ethers5');
const adapter = new SmartContractAdapter(contractFactory);
```

### New Constructor (Recommended)

```typescript
// Framework is specified first, then signer/provider with proper typing
const adapter = new SmartContractAdapter('ethers5', signerOrProvider, contractAddresses);
```

## Usage Examples

### Basic Usage

```typescript
import { SmartContractAdapter } from './adapters/smartContract';
import { ContractAddresses } from './types/config';

// Define your contract addresses
const contractAddresses: ContractAddresses = {
	VaultWrapper: '0x1234567890123456789012345678901234567890',
	Swapper: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
	YieldExtractor: '0x0987654321098765432109876543210987654321',
};

// Create adapter with ethers v5
const ethers5Signer = {} as any; // Your ethers v5 signer
const adapter = new SmartContractAdapter('ethers5', ethers5Signer, contractAddresses);

// Use the contracts
const vault = adapter.yelayLiteVault;
const wrapper = adapter.vaultWrapper;
const extractor = adapter.yieldExtractor;
```

### Framework-specific Usage

```typescript
// Ethers v5
const ethers5Adapter = new SmartContractAdapter('ethers5', ethers5Signer, contractAddresses);

// Ethers v6
const ethers6Adapter = new SmartContractAdapter('ethers6', ethers6Signer, contractAddresses);

// Viem
const viemAdapter = new SmartContractAdapter('viem', viemWalletClient, contractAddresses);
```

### Generic Functions

```typescript
import { type Framework } from './adapters/providers/chain';

function createAdapter<T extends Framework>(
	framework: T,
	signerOrProvider: any, // This would be properly typed based on framework
	addresses: ContractAddresses,
) {
	return new SmartContractAdapter(framework, signerOrProvider, addresses);
}

// Usage
const adapter1 = createAdapter('ethers5', ethers5Signer, contractAddresses);
const adapter2 = createAdapter('ethers6', ethers6Signer, contractAddresses);
const adapter3 = createAdapter('viem', viemWalletClient, contractAddresses);
```

## Type Safety

The adapter provides full type safety based on the selected framework:

### Ethers v5

-   `BigNumber`: `ethers.BigNumber`
-   `Signer`: `ethers.Signer`
-   `Provider`: `@ethersproject/providers.Provider`

### Ethers v6

-   `BigNumber`: `bigint`
-   `Signer`: `ethers-v6.Signer`
-   `Provider`: `ethers-v6.Provider`

### Viem

-   `BigNumber`: `bigint`
-   `Signer`: `viem.WalletClient`
-   `Provider`: `viem.PublicClient`

## ContractFactory Integration

The `SmartContractAdapter` internally uses the updated `ContractFactory` which:

1. Accepts the framework as the first parameter
2. Uses framework-specific types for signer/provider
3. Handles MulticallWrapper wrapping for ethers v5
4. Provides proper type safety throughout

## Migration Guide

### Step 1: Update Constructor Calls

```typescript
// Before
const contractFactory = new ContractFactory(signer, addresses, 'ethers5');
const adapter = new SmartContractAdapter(contractFactory);

// After
const adapter = new SmartContractAdapter('ethers5', signer, addresses);
```

### Step 2: Update Type Annotations

```typescript
// Before
const adapter: SmartContractAdapter = new SmartContractAdapter(contractFactory);

// After
const adapter = new SmartContractAdapter<'ethers5'>('ethers5', signer, addresses);
```

### Step 3: Update Generic Functions

```typescript
// Before
function createAdapter(adapterType: string, signer: any, addresses: ContractAddresses) {
	const contractFactory = new ContractFactory(signer, addresses, adapterType as any);
	return new SmartContractAdapter(contractFactory);
}

// After
function createAdapter<T extends Framework>(framework: T, signerOrProvider: any, addresses: ContractAddresses) {
	return new SmartContractAdapter(framework, signerOrProvider, addresses);
}
```

## Benefits

1. **Type Safety**: No more `any` types - TypeScript knows exactly what types you're working with
2. **Better IntelliSense**: Full autocomplete and type checking
3. **Compile-time Errors**: Catch framework mismatches before runtime
4. **Simplified API**: No need to manually create ContractFactory
5. **Framework-specific Logic**: Easy to add framework-specific behavior
6. **Tree-shaking Friendly**: Only the selected framework is included

## Backward Compatibility

The old constructor pattern is no longer supported. All code must be updated to use the new constructor pattern for better type safety and developer experience.
