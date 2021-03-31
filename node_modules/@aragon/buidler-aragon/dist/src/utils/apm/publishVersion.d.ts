import { ethers } from 'ethers';
import { ApmVersion, AragonJsIntent, PublishVersionTxData } from './types';
/**
 * Return tx data to publish a new version of an APM repo
 * If the repo does not exist yet, it will return a tx to create
 * a new repo and publish first version to its registry
 * @param appName "finance.aragonpm.eth"
 * @param provider Initialized ethers provider
 * @param versionInfo Object with required version info
 * @param options Additional options
 *  - managerAddress: Must be provided to deploy a new repo
 */
export declare function publishVersion(appName: string, versionInfo: ApmVersion, provider: ethers.providers.Provider, options?: {
    managerAddress: string;
}): Promise<PublishVersionTxData>;
/**
 * Wrapps publishVersion to return the tx data formated as an aragon.js intent
 * @param appName "finance.aragonpm.eth"
 * @param provider Initialized ethers provider
 * @param versionInfo Object with required version info
 * @param options Additional options
 *  - managerAddress: Must be provided to deploy a new repo
 */
export declare function publishVersionIntent(appName: string, versionInfo: ApmVersion, provider: ethers.providers.Provider, options?: {
    managerAddress: string;
}): Promise<AragonJsIntent>;
/**
 * Returns encoded tx data for publishing a new version
 */
export declare function encodePublishVersionTxData({ methodName, params }: {
    methodName: 'newVersion' | 'newRepoWithVersion';
    params: any[];
}): string;
//# sourceMappingURL=publishVersion.d.ts.map