import { AbiItem } from '~/src/types';
/**
 * Gets the ABI from an Aragon App release directory
 * @param contentURI
 * @param options
 */
export default function getAbiFromContentUri(contentURI: string, options: {
    ipfsGateway: string;
}): Promise<AbiItem[]>;
//# sourceMappingURL=getAbiFromContentUri.d.ts.map