interface IVaultWrapperViem {
    address: string;
    wrapEthAndDeposit(vault: string, pool: number, overrides: any): Promise<string>;
    swapAndDeposit(vault: string, pool: number, swapData: {blockNumber: number, transactionHash: string}, amount: bigint, overrides: any): Promise<string>;
}

export default IVaultWrapperViem