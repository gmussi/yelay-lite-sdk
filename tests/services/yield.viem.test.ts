import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Yield (Viem)', () => {
	let sdk: YelayLiteSdk<'viem'>;

	beforeAll(() => {
		const client = createPublicClient({
			chain: base,
			transport: http('https://base.meowrpc.com'),
		});

		sdk = new YelayLiteSdk('viem', client as any, 8453, true);
	});

	it('get vaults yield', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield();

		console.log('[VIEM] vaultsYield', vaultsYield.length);
		expect(vaultsYield.length).toBeGreaterThan(0);
	});

	it('get claimable yield', async () => {
		const claimableYield = await sdk.yields.getClaimableYield({
			user: '0x1892e547F4E1bA76F82a09C16C9F774744De1ff3',
		});

		console.log('[VIEM] claimableYield for user 0x1892e547F4E1bA76F82a09C16C9F774744De1ff3', claimableYield);
	}, 15000);
});
