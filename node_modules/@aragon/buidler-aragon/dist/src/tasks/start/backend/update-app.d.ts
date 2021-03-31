import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { RepoInstance, KernelInstance } from '~/typechain';
export declare function updateApp({ appName, dao, repo, appServePort }: {
    appName: string;
    dao: KernelInstance;
    repo: RepoInstance;
    appServePort: number;
}, bre: BuidlerRuntimeEnvironment): Promise<{
    implementationAddress: string;
    version: [number, number, number];
    uri: string;
}>;
//# sourceMappingURL=update-app.d.ts.map