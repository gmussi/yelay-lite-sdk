// import { BigNumber, ContractTransaction, ethers, PayableOverrides } from 'ethers';

export const tryCall = async (call: Promise<any>): Promise<any> => {
	try {
		return call;
	} catch (error: any) {
		// const parsedError = LibErrors__factory.createInterface().parseError(error.data);
		const parsedError = undefined as any;
		if (parsedError !== undefined) {
			console.error(`Error: ${parsedError?.name}`);
		} else {
			console.error(`Error: ${error}`);
		}
		throw new Error(`Transaction failed: ${error instanceof Error ? error.message : error}`);
	}
};

export const getIncreasedGasLimit = (gasLimit: bigint) => {
	const increasedGasLimit = (gasLimit * 120n) / 100n;
	return increasedGasLimit;
};

// optionally populate gasLimit via estimateGas
export async function populateGasLimit<T extends (...args: any[]) => Promise<bigint>>(
	fn: T,
	args: any,
	overrides: any,
) {
	try {
		if (!overrides.gas) {
			// max allowed gas limit for estimation is 5 mln
			// overrides.gas = await fn(...args, { gas: 5_000_000 }).then(getIncreasedGasLimit);
			overrides.gas = await fn(...args, { gas: 5_000_000n }).then(getIncreasedGasLimit);
		}
	} catch (err) {
		console.error('Gas estimation failed:', err);
		throw err;
	}
}

export const QUERY_EVENTS_BLOCK_RANGE = 10_000;
