import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Pools (Viem)', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const client = createPublicClient({
			chain: base,
			transport: http('https://base.llamarpc.com'),
		});

		sdk = new YelayLiteSdk(client, 8453, 'viem', true);
	});

	it('get projectsTVL', async () => {
		const projectTvl = await sdk.pools.getPoolsTvl('0x16db68c86edfdb60ba733563326ed392b319eb2b', [1, 2]);

		console.log('[VIEM] projectTvl1', projectTvl[0].tvl.toString());
		console.log('[VIEM] projectTvl2', projectTvl[1].tvl.toString());
	});

	it('get historical TVL', async () => {
		const vaultAddress = '0x1f463353fea78e38568499cf117437493d334ecf';
		const poolId = 121;
		const paginatedResponse = await sdk.pools.historicalTVL({
			vaultAddress,
			poolId,
		});

		// Check if we got a paginated response with the expected format
		expect(paginatedResponse.data.length).toBeGreaterThan(0);
		expect(paginatedResponse.totalItems).toBeDefined();
		expect(paginatedResponse.totalPages).toBeDefined();
		expect(paginatedResponse.currentPage).toBeDefined();
		expect(paginatedResponse.pageSize).toBeDefined();

		const firstTVL = paginatedResponse.data[0];
		expect(firstTVL.vaultAddress).toEqual(vaultAddress);
		expect(firstTVL.poolId).toEqual(poolId);
		expect(firstTVL.createTimestamp).toBeDefined();
		expect(firstTVL.assets).toBeDefined();

		console.log('[VIEM] Historical TVL data length:', paginatedResponse.data.length);
	});
});
