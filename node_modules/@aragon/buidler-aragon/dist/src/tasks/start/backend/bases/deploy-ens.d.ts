import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { TruffleEnvironmentArtifacts } from '@nomiclabs/buidler-truffle5/src/artifacts';
import { ENSInstance } from '~/typechain';
/**
 * Deploys a new ENS instance using a ENSFactory.
 * @returns ENS's instance.
 */
export declare function deployEns(bre: BuidlerRuntimeEnvironment, artifacts: TruffleEnvironmentArtifacts): Promise<ENSInstance>;
//# sourceMappingURL=deploy-ens.d.ts.map