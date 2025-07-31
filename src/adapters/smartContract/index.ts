import { type Framework, type SignerType, type ProviderType } from '../providers/chain';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { IYelayLiteVault } from '../../app/ports/smartContract/IYelayLiteVault';
import { IYieldExtractor } from '../../app/ports/smartContract/IYieldExtractor';
import { VaultWrapper } from './VaultWrapper';
import { YelayLiteVault } from './YelayLiteVault';
import { YieldExtractor } from './YieldExtractor';
import { ContractFactory } from './ContractFactory';
import { ContractAddresses } from '../../types/config';

export class SmartContractAdapter<T extends Framework = Framework> {
	public vaultWrapper: IVaultWrapper;
	public yelayLiteVault: IYelayLiteVault;
	public yieldExtractor: IYieldExtractor;
	private contractFactory: ContractFactory<T>;

	constructor(framework: T, signerOrProvider: SignerType<T> | ProviderType<T>, contractAddresses: ContractAddresses) {
		this.contractFactory = new ContractFactory(framework, signerOrProvider, contractAddresses);
		this.vaultWrapper = new VaultWrapper(this.contractFactory);
		this.yelayLiteVault = new YelayLiteVault(this.contractFactory);
		this.yieldExtractor = new YieldExtractor(this.contractFactory);
	}
}
