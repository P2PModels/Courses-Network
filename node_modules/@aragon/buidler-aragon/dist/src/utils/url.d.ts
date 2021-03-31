/**
 * Joins multiple url parts safely
 * - Does not break the protocol double slash //
 * - Cleans double slashes at any point
 * @param args ("http://ipfs.io", "ipfs", "Qm")
 * @return "http://ipfs.io/ipfs/Qm"
 */
export declare function urlJoin(...args: string[]): string;
/**
 * Wrapps the URL module and accepts urls without a protocol
 * assumes HTTP
 * @param url
 */
export declare function parseUrlSafe(url: string): URL;
//# sourceMappingURL=url.d.ts.map