import { ethers } from 'ethers';
/**
 * Asserts that a sender has permissions to publish a new version / repo
 * Otherwise will throw an error with a detailed message
 * @param appName "finance.aragonpm.eth"
 * @param sender Account attempting to publish "0xE04cAbcB24e11620Dd62bB99c396E76cEB578914"
 * @param provider Initialized ethers provider
 */
export declare function assertCanPublish(appName: string, sender: string, provider: ethers.providers.Provider): Promise<void>;
//# sourceMappingURL=assertCanPublish.d.ts.map