import { ApmVersion, ApmVersionReturn } from './types';
/**
 * Parses hex string if it's a hex string, otherwise returns it
 * @param hex "0xaa6161" | "hello"
 */
export declare function toUtf8IfHex(hex: string): string;
/**
 * Parse a raw version response from an APM repo
 */
export declare function parseApmVersionReturn(res: ApmVersionReturn): ApmVersion;
/**
 * Return a semantic version string into the APM version array format
 * @param version "0.2.4"
 */
export declare function toApmVersionArray(version: string): [number, number, number];
/**
 * Clean an IPFS hash of prefixes and suffixes commonly found
 * in both gateway URLs and content URLs
 * @param ipfsDirtyHash
 */
export declare function stipIpfsPrefix(ipfsDirtyHash: string): string;
/**
 * Returns a joined IPFS location given an IPFS gateway and an IPFS path
 * This util makes sure the url is properly joined, and that it contains
 * the "ipfs" route only once, stripping it from the gateway and the location
 * @param ipfsGateway "https://ipfs.io"
 * @param location "Qmzz"
 * @return "https://ipfs.io/ipfs/Qmzz/artifact.json"
 */
export declare function joinIpfsLocation(ipfsGateway: string, location: string): string;
/**
 * Return a fetchable URL to get the resources of a contentURI
 * @param contentUri "ipfs:QmaT4Eef..."
 * @param options
 */
export declare function contentUriToFetchUrl(contentUri: string, options?: {
    ipfsGateway?: string;
}): string;
/**
 * Returns contentURI in Aragon's protocol:location format as hex
 * @param protocol "ipfs"
 * @param location "QmbNG8dVgi363popKyCrojMNj3wRczxjEoSv27J8tvFgwQ"
 */
export declare function toContentUri(protocol: 'http' | 'https' | 'ipfs', location: string): string;
/**
 * Returns true if is an address
 * @param address
 */
export declare function isAddress(address: string): boolean;
/**
 * Return hex format of data with 0x prefix
 * @param data
 */
export declare function utf8ToHex(data: string): string;
//# sourceMappingURL=utils.d.ts.map