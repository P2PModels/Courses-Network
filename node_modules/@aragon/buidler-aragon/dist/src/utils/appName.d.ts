/**
 * Returns the hashed appId given a partial or full app name
 * @param appNameOrId "finance" | "finance.aragonpm.eth"
 * @param registry If appName is a partial ENS domain, provide a custom registry
 */
export declare function getAppId(appNameOrId: string, registry?: string): string;
/**
 * Returns the parts of an appName split by shortName and registry
 * @param appName "finance.aragonpm.eth"
 */
export declare function getAppNameParts(appName: string): {
    shortName: string;
    registryName: string;
};
/**
 * Returns the full ENS domain app name
 * @param appName "finance" | "finance.aragonpm.eth"
 * @param registry "open.aragonpm.eth"
 */
export declare function getFullAppName(appName: string, registry?: string): string;
//# sourceMappingURL=appName.d.ts.map