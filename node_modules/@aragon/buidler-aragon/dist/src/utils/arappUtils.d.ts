import { AragonAppJson } from '~/src/types';
/**
 * Reads and parses an arapp.json file.
 * @return AragonAppJson
 */
export declare function readArapp(): AragonAppJson;
/**
 * Reads and parses an arapp.json file only if exists
 * otherwise returns undefined
 */
export declare function readArappIfExists(): AragonAppJson | undefined;
/**
 * Returns main contract path.
 * @return "./contracts/Counter.sol"
 */
export declare function getMainContractPath(): string;
/**
 * Returns main contract name.
 * @return "Counter"
 */
export declare function getMainContractName(): string;
/**
 * Parse the appName from arapp.json in a flexible manner
 * @param arapp
 * @param network
 */
export declare function parseAppName(arapp: AragonAppJson, network?: string): string;
//# sourceMappingURL=arappUtils.d.ts.map