import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from '../../src';

describe('Yield (Viem)', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const client = createPublicClient({
			chain: base,
			transport: http('https://base.llamarpc.com'),
		});

		sdk = new YelayLiteSdk(client, 8453, 'viem', true);
	});

	it.skip('Get Yields', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield(['0x16db68c86edfdb60ba733563326ed392b319eb2b'], {
			fromBlock: 1,
			toBlock: 26539965,
		});

		console.log('[VIEM] vaultsYield', vaultsYield);
	});

	it.skip('Get Yields', async () => {
		const yields = await sdk.yields.getYields();

		console.log('[VIEM] userYield', yields);
	});

	it('Get Claimable Yield', async () => {
		const claimableYield = await sdk.yields.getClaimableYield({
			user: '0x1892e547F4E1bA76F82a09C16C9F774744De1ff3',
		});

		console.log('[VIEM] claimableYield for user 0x1892e547F4E1bA76F82a09C16C9F774744De1ff3', claimableYield);
	}, 15000);
});
