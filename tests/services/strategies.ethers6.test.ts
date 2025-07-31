import dotenv from 'dotenv';
import { JsonRpcProvider } from 'ethers-v6';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies (Ethers v6)', () => {
	let sdk: YelayLiteSdk<'ethers6'>;

	beforeAll(() => {
		const provider = new JsonRpcProvider('https://base.meowrpc.com');

		sdk = new YelayLiteSdk('ethers6', provider, 8453, true);
	});

	it('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log('[ETHERS6] protocols', protocols.length);
		expect(protocols.length).toBeGreaterThan(0);
	});
});
