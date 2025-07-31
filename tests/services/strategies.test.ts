import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies', () => {
	let sdk: YelayLiteSdk<'ethers5'>;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.meowrpc.com');

		sdk = new YelayLiteSdk('ethers5', provider, 8453, true);
	});

	it('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log('protocols', protocols.length);
		expect(protocols.length).toBeGreaterThan(0);
	});
});
