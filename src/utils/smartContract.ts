import { ContractTransactionResponse } from 'ethers-v6';
import { Overrides } from 'ethers-v5';
import { LibErrors__factory } from '../generated/typechain-v6';
import { ContractTransaction } from 'ethers-v5';

export const tryCall = async (call: Promise<ContractTransaction | ContractTransactionResponse>): Promise<ContractTransaction | ContractTransactionResponse> => {
	try {
		return call;
	} catch (error: any) {
		const parsedError = LibErrors__factory.createInterface().parseError(error.data);
		if (parsedError) {
			console.error(`Error: ${parsedError.name}`);
		} else {
			console.error(`Error: ${error}`);
		}
		throw new Error(`Transaction failed: ${error instanceof Error ? error.message : error}`);
	}
};

export const getIncreasedGasLimit = (gasLimit: bigint) => {
	const increasedGasLimit = (gasLimit * 120n)/ 100n;
	return increasedGasLimit;
};

// optionally populate gasLimit via estimateGas
export async function populateGasLimit<T extends (...args: any[]) => Promise<bigint>>(
	fn: T,
	args: Parameters<T>,
	overrides: Overrides,
) {
	try {
		if (!overrides.gasLimit) {
			// max allowed gas limit for estimation is 5 mln
			overrides.gasLimit = await fn(...args, { gasLimit: 5_000_000 }).then(getIncreasedGasLimit);
		}
	} catch (err) {
		console.error('Gas estimation failed:', err);
		throw err;
	}
}

export const QUERY_EVENTS_BLOCK_RANGE = 10_000;
