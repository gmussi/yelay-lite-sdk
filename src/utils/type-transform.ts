import { BigNumber } from "ethers-v5";

export const convertBigNumberToBigInt = <T extends any[]>(
    fn: (...args: T) => Promise<BigNumber>
) => async (...args: T): Promise<bigint> => {
    const result = await fn(...args);
    return BigInt(result.toString());
};