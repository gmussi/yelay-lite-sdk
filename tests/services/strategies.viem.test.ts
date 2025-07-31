import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies (Viem)', () => {
	let sdk: YelayLiteSdk<'viem'>;

	beforeAll(() => {
		const client = createPublicClient({
			chain: base,
			transport: http('https://base.meowrpc.com'),
		});

		sdk = new YelayLiteSdk('viem', client as any, 8453, true);
	});

	it('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log('[VIEM] protocols', protocols.length);
		expect(protocols.length).toBeGreaterThan(0);
	});

	it('get active strategies', async () => {
		const activeStrategies = await sdk.strategies.getActiveStrategies('0x7b3D25c37c6ADf650F1f7696be2278cCFa2b638F');

		console.log('[VIEM] active strategies', activeStrategies);
	});
});
