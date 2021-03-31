import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
interface AragonBases {
    ensAddress: string;
    daoFactoryAddress: string;
    apmAddress: string;
}
/**
 * Deploys the basic Aragon arquitecture bases if necessary.
 * @param bre
 * @return Object of Aragon base addresses
 */
export default function deployBases(bre: BuidlerRuntimeEnvironment): Promise<AragonBases>;
export {};
//# sourceMappingURL=deploy-bases.d.ts.map