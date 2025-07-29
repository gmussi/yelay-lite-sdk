import dotenv from 'dotenv';
import { JsonRpcProvider } from 'ethers-v6';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies (Ethers v6)', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new JsonRpcProvider('https://base.llamarpc.com');

		sdk = new YelayLiteSdk(provider, 8453, 'ethers6', true);
	});

	it('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log('[ETHERS6] protocols count:', protocols.length);
		expect(Array.isArray(protocols)).toBe(true);
		if (protocols.length > 0) {
			expect(protocols[0]).toHaveProperty('id');
		}
	});

	it.skip('active strategies', async () => {
		const activeStrategies = await sdk.strategies.getActiveStrategies('0x7b3D25c37c6ADf650F1f7696be2278cCFa2b638F');

		console.log('[ETHERS6]', activeStrategies);
	});
});
