import { ethers } from 'ethers';
import { ApmVersion } from './types';
/**
 * Fetch a single version of an APM Repo
 * @param repoNameOrAddress "finance", "finance.aragonpm.eth", "0xa600c17..."
 * @param version Version to fetch: 'latest', '0.2.0', 14
 * @param provider Initialized ethers provider
 */
export declare function getRepoVersion(repoNameOrAddress: string, version: string | number | undefined, provider: ethers.providers.Provider): Promise<ApmVersion>;
/**
 * Returns true if the address can publish a new version to this repo
 * @param repoNameOrAddress "finance", "finance.aragonpm.eth", "0xa600c17..."
 * @param sender Account attempting to publish "0xE04cAbcB24e11620Dd62bB99c396E76cEB578914"
 * @param provider Initialized ethers provider
 */
export declare function canPublishVersion(repoNameOrAddress: string, sender: string, provider: ethers.providers.Provider): Promise<boolean>;
//# sourceMappingURL=repo.d.ts.map