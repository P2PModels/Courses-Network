import { ethers } from 'ethers';
/**
 * Fetches APM Repo version from external network
 * @param name "finance.aragonpm.eth"
 * @param version "2.0.0"
 * @param provider ethers provider connected to an external network
 */
export default function getExternalRepoVersion(name: string, version: string | undefined, provider: ethers.providers.Provider): Promise<{
    contentURI: string;
    contractAddress: string;
}>;
//# sourceMappingURL=getRepoVersion.d.ts.map