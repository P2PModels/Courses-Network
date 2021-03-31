import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { TruffleEnvironmentArtifacts } from '@nomiclabs/buidler-truffle5/src/artifacts';
import { DAOFactoryInstance, APMRegistryInstance, ENSInstance } from '~/typechain';
/**
 * Deploys a new DAOFactory with direct/pure interaction with aragonOS.
 * @returns DAOFactory's instance.
 */
export declare function deployApm(bre: BuidlerRuntimeEnvironment, artifacts: TruffleEnvironmentArtifacts, ens: ENSInstance, daoFactory: DAOFactoryInstance): Promise<APMRegistryInstance>;
//# sourceMappingURL=deploy-apm.d.ts.map