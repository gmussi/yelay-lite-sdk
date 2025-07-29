import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies (Viem)', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const client = createPublicClient({
			chain: base,
			transport: http('https://base.llamarpc.com'),
		});

		sdk = new YelayLiteSdk(client, 8453, 'viem', true);
	});

	it('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log('[VIEM] protocols count:', protocols.length);
		expect(Array.isArray(protocols)).toBe(true);
		if (protocols.length > 0) {
			expect(protocols[0]).toHaveProperty('id');
		}
	});

	it.skip('active strategies', async () => {
		const activeStrategies = await sdk.strategies.getActiveStrategies('0x7b3D25c37c6ADf650F1f7696be2278cCFa2b638F');

		console.log('[VIEM]', activeStrategies);
	});
});
