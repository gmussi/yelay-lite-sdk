# Chain Adapter Factory

This module provides a type-safe factory pattern for working with multiple web3 frameworks (ethers v5, ethers v6, and viem) without using `any` types.

## Problem Solved

The original implementation used dynamic requires and global state, which:

-   Used `any` types everywhere
-   Required runtime configuration
-   Made it difficult to get proper TypeScript intellisense
-   Could lead to runtime errors if the wrong framework was selected

## New Solution

The new implementation provides:

-   **Type Safety**: Proper TypeScript types for each framework
-   **Compile-time Framework Selection**: Choose your framework at import time
-   **No Runtime Configuration**: No global state or dynamic switching
-   **Framework-specific Types**: Each framework gets its proper types (e.g., `BigNumber` vs `bigint`)

## Usage

### Basic Usage

```typescript
import { createChainAdapter } from './chain';

// Choose your framework at import time
const adapter = createChainAdapter('ethers5');

// TypeScript now knows this is ethers v5 BigNumber
const amount = adapter.BigNumber.from('1000000000000000000');

// TypeScript knows this is ethers v5 Signer
const isValidSigner = adapter.Signer.isSigner(someSignerObject);

// TypeScript knows this is ethers v5 utils
const formattedAmount = adapter.ethersUtils.formatEther(amount);
```

### Framework-specific Types

```typescript
import { createChainAdapter, type Framework } from './chain';

// With ethers v6 - BigNumber is bigint
const ethers6Adapter = createChainAdapter('ethers6');
const amount: bigint = ethers6Adapter.BigNumber.from('1000000000000000000');

// With viem - BigNumber is bigint
const viemAdapter = createChainAdapter('viem');
const amount: bigint = viemAdapter.BigNumber.from('1000000000000000000');
```

### Generic Functions

```typescript
import { createChainAdapter, type Framework } from './chain';

function processAmount<T extends Framework>(framework: T, amountString: string) {
	const adapter = createChainAdapter(framework);
	const amount = adapter.BigNumber.from(amountString);

	// TypeScript will infer the correct type based on the framework
	return adapter.ethersUtils.formatEther(amount);
}

// Usage
const ethers5Amount = processAmount('ethers5', '1000000000000000000');
const ethers6Amount = processAmount('ethers6', '1000000000000000000');
const viemAmount = processAmount('viem', '1000000000000000000');
```

### Advanced Usage with Typed Factory

```typescript
import { createTypedChainAdapter } from './chain';

const typedAdapter = createTypedChainAdapter('ethers5');

// You get both the adapter and the properly typed exports
const { adapter, BigNumberType, SignerType } = typedAdapter;

// Use the adapter directly
const amount = adapter.BigNumber.from('1000000000000000000');

// Or use the typed exports
const amount2 = BigNumberType.from('1000000000000000000');
```

## Type System

The module provides conditional types that map frameworks to their specific types:

```typescript
// BigNumber types
type BigNumberType<T extends Framework> = T extends 'ethers5'
	? import('ethers').BigNumber
	: T extends 'ethers6'
	? bigint
	: T extends 'viem'
	? bigint
	: never;

// Signer types
type SignerType<T extends Framework> = T extends 'ethers5'
	? import('ethers').Signer
	: T extends 'ethers6'
	? import('ethers-v6').Signer
	: T extends 'viem'
	? import('viem').WalletClient
	: never;
```

## Migration from Old Approach

### Old Way (Deprecated)

```typescript
import { setChainAdapter, ethersUtils, BigNumber } from './chain';

// Set framework at runtime
setChainAdapter('ethers5');

// Use with 'any' types
const amount: any = BigNumber.from('1000000000000000000');
```

### New Way (Recommended)

```typescript
import { createChainAdapter } from './chain';

// Choose framework at import time
const adapter = createChainAdapter('ethers5');

// Use with proper types
const amount = adapter.BigNumber.from('1000000000000000000');
```

## Backward Compatibility

The module still exports the default adapter (ethers5) for backward compatibility:

```typescript
import { ethersUtils, BigNumber, Signer } from './chain';

// These still work but use ethers5 as default
const amount = BigNumber.from('1000000000000000000');
```

However, it's recommended to use the new factory pattern for better type safety.

## Benefits

1. **Type Safety**: No more `any` types
2. **Compile-time Errors**: Catch framework mismatches at compile time
3. **Better IntelliSense**: Full autocomplete and type checking
4. **Framework-specific Logic**: Easy to add framework-specific behavior
5. **No Runtime Configuration**: Simpler and more predictable
6. **Tree-shaking Friendly**: Only the selected framework is included
