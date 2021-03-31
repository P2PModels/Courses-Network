import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
/**
 * Resolve ENS name with custom ensAddress
 * @param name
 * @param bre
 * @param customEnsAddress
 */
export declare function resolveName({ name, ensAddress }: {
    name: string;
    ensAddress: string;
}, bre: BuidlerRuntimeEnvironment): Promise<string | undefined>;
//# sourceMappingURL=ens.d.ts.map