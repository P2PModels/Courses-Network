/**
 * Uploads dist folder to IPFS
 * Applies various ignore patterns:
 * - .ipfsignore
 * - .gitignore
 */
export declare function uploadDirToIpfs({ dirPath, ipfsApiUrl, ignore, progress }: {
    dirPath: string;
    ipfsApiUrl: string;
    ignore?: string[];
    progress?: (totalBytes: number) => void;
}): Promise<string>;
//# sourceMappingURL=uploadDirToIpfs.d.ts.map