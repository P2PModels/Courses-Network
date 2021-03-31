import { PublishVersionTxData } from '~/src/utils/apm';
/**
 * Returns a preview sumary of the publish tx with escape codes
 * The resulting string can be directly outputed to stdout
 */
export declare function getPrettyPublishTxPreview({ txData, appName, nextVersion, bump, contractAddress, contentHash, ipfsGateway }: {
    txData: PublishVersionTxData;
    appName: string;
    nextVersion: string;
    bump: string;
    contractAddress: string;
    contentHash: string;
    ipfsGateway: string;
}): string;
/**
 * Returns a string with formated data about a publish version tx
 */
export declare const getPublishTxOutput: {
    dryRun: ({ txData, rootAccount }: {
        txData: PublishVersionTxData;
        rootAccount: string;
    }) => string;
    /**
     * Display tx hash after broadcasting tx
     */
    txHash: (txHash: string, etherscanUrl: string) => string;
    /**
     * Display receipt after transaction is mined
     */
    receipt: (receipt: any) => string;
};
//# sourceMappingURL=prettyOutput.d.ts.map