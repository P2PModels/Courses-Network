export declare const externalArtifactPaths: string[];
export declare const artifactName = "artifact.json";
export declare const manifestName = "manifest.json";
export declare const flatCodeName = "code.sol";
export declare const arappName = "arapp.json";
export declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const ANY_ADDRESS = "0xffffffffffffffffffffffffffffffffffffffff";
export declare const testnetPort = 8545;
export declare const aragenGasLimit = 10000000;
export declare const aragenMnemonic = "explain tackle mirror kit van hammer degree position ginger unfair soup bonus";
export declare const aragenAccounts: {
    privateKey: string;
    publicKey: string;
}[];
export declare const defaultLocalAragonBases: {
    ensAddress: string;
    daoFactoryAddress: string;
    apmAddress: string;
};
export declare const defaultIpfsGateway = "https://ipfs.eth.aragon.network";
/**
 * Chain ids of networks that support Etherscan contract verification
 */
export declare const etherscanSupportedChainIds: Set<number>;
/**
 * Root etherscan URLs per chainId
 * Note: All URLs are expected to have the same sub paths, /tx, etc
 */
export declare const etherscanChainUrls: {
    1: string;
    3: string;
    4: string;
    5: string;
    42: string;
};
//# sourceMappingURL=params.d.ts.map