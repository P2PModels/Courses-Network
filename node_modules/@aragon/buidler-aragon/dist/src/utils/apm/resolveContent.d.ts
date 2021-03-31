import { AragonManifest, AragonArtifact } from '~/src/types';
/**
 * Resolve an Aragon app contentUri and return its manifest and artifact
 * @param contentUri "ipfs:Qm..."
 * @param options
 * - ipfsGateway: 'http://localhost:8080' | 'https://my-remote-ipfs.io'
 */
export declare function resolveRepoContentUri(contentUri: string, options?: {
    ipfsGateway?: string;
}): Promise<{
    artifact: AragonArtifact;
    manifest: AragonManifest;
}>;
/**
 * Resolve an Aragon app contentUri and return a single file given it's path
 * @param contentUri "ipfs:Qm..."
 * @param filepath "code.sol"
 * @param options
 * - ipfsGateway: 'http://localhost:8080' | 'https://my-remote-ipfs.io'
 */
export declare function resolveRepoContentUriFile(contentUri: string, filepath: string, options?: {
    ipfsGateway?: string;
}): Promise<string>;
//# sourceMappingURL=resolveContent.d.ts.map