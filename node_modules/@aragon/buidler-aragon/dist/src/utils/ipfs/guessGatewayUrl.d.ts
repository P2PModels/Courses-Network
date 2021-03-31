/**
 * Returns a URL that may have a given content hash already available
 * Use after publish to guess at which gateway URL the recently uploaded
 * content is already available
 *
 * Possible gateway routes given a URL exposing an IPFS node are
 * - mynode.io/ipfs/Qm...
 * - mynode.io:8080/ipfs/Qm...
 * - mynode.io:5001/ipfs/Qm...
 */
export declare function guessGatewayUrl({ ipfsApiUrl, contentHash, ipfsGateway }: {
    ipfsApiUrl: string;
    contentHash: string;
    ipfsGateway?: string;
}): Promise<string | null>;
/**
 * Aggregate a list of possible available gateway URLs given an API url and gateway
 * - Some gateways are exposed in port 80 or 8080
 * - The IPFS API has a gateway route, but it is closed in Infura's for example
 * @return possibleGatewayUrls = [
 *   'http://mynode.io/',
 *   'http://mynode.io:5001/',
 *   'http://mynode.io:6001/',
 *   'http://mynode.io:8080/',
 *   'https://ipfs.io'
 * ]
 */
export declare function getPossibleGatewayUrls({ ipfsApiUrl, ipfsGateway }: {
    ipfsApiUrl: string;
    ipfsGateway?: string;
}): string[];
//# sourceMappingURL=guessGatewayUrl.d.ts.map