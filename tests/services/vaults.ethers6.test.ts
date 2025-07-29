import dotenv from 'dotenv';
import { JsonRpcProvider, parseEther } from 'ethers-v6';
import { YelayLiteSdk } from '../../src';

dotenv.config();
jest.setTimeout(200000);

describe('Vaults (Ethers v6)', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new JsonRpcProvider('https://base.meowrpc.com');

		sdk = new YelayLiteSdk(provider, 8453, 'ethers6', true);
	});

	it('getVaults', async () => {
		const vaults = await sdk.vaults.getVaults();

		console.log('[ETHERS6] vaults count:', vaults.length);
		expect(vaults.length).toBeGreaterThan(0);
		expect(vaults[0]).toHaveProperty('address');
		expect(vaults[0]).toHaveProperty('name');
		expect(vaults[0]).toHaveProperty('chainId');
		expect(vaults[0]).toHaveProperty('pools');
	});

	it.skip('get allowance', async () => {
		const allowance = await sdk.vaults.allowance('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992');

		console.log('[ETHERS6] allowance', allowance.toString());
	});

	it.skip('approve', async () => {
		const approve = await sdk.vaults.approve('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992', parseEther('1'));

		console.log('[ETHERS6] approve', approve);
	});

	it.skip('deposit eth', async () => {
		const depositTx = await sdk.vaults.depositEth(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			parseEther('0.0000001'),
		);

		console.log('[ETHERS6] depositTx', depositTx.data);
	});

	it.skip('deposit eth', async () => {
		const depositTx = await sdk.vaults.deposit(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			parseEther('0.0001'),
		);

		const receipt = await depositTx.wait();

		console.log('[ETHERS6] redeem', (await receipt).status);
	});

	it.skip('balance of', async () => {
		const balance = await sdk.vaults.balanceOf(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			'0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7',
		);

		console.log('[ETHERS6] balance', balance.toString());
	});

	it.skip('redeem', async () => {
		const balance = await sdk.vaults.balanceOf(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			'0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7',
		);

		const redeem = await sdk.vaults.redeem('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992', 100, balance);

		const receipt = await redeem.wait();

		console.log('[ETHERS6] redeem', (await receipt).status);
	});
});
