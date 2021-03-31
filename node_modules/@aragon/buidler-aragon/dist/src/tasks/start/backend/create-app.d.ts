/// <reference types="truffle-typings" />
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { RepoInstance, AppStubInstance, KernelInstance } from '~/typechain';
export declare function createApp({ appName, dao, ensAddress }: {
    appName: string;
    dao: KernelInstance;
    ensAddress: string;
}, bre: BuidlerRuntimeEnvironment): Promise<{
    implementation: Truffle.ContractInstance;
    proxy: AppStubInstance;
    repo: RepoInstance;
}>;
//# sourceMappingURL=create-app.d.ts.map