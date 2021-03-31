import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { TruffleEnvironmentArtifacts } from '@nomiclabs/buidler-truffle5/src/artifacts';
import { KernelInstance } from '~/typechain';
/**
 * Deploys a new DAO with direct/pure interaction with aragonOS.
 * @returns DAO's Kernel TruffleContract.
 */
export declare function createDao(bre: BuidlerRuntimeEnvironment, artifacts: TruffleEnvironmentArtifacts, daoFactoryAddress: string): Promise<KernelInstance>;
//# sourceMappingURL=create-dao.d.ts.map