import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Yield', () => {
	let sdk: YelayLiteSdk<'ethers5'>;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.meowrpc.com');

		sdk = new YelayLiteSdk('ethers5', provider, 8453, true);
	});

	it('get vaults yield', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield();

		console.log('vaultsYield', vaultsYield.length);
		expect(vaultsYield.length).toBeGreaterThan(0);
	});
});
