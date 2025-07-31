import dotenv from 'dotenv';
import { JsonRpcProvider } from 'ethers-v6';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Yield (Ethers v6)', () => {
	let sdk: YelayLiteSdk<'ethers6'>;

	beforeAll(() => {
		const provider = new JsonRpcProvider('https://base.meowrpc.com');

		sdk = new YelayLiteSdk('ethers6', provider, 8453, true);
	});

	it('get vaults yield', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield();

		console.log('[ETHERS6] vaultsYield', vaultsYield.length);
		expect(vaultsYield.length).toBeGreaterThan(0);
	});
});
