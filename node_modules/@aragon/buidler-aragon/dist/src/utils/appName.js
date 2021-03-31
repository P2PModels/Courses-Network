"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullAppName = exports.getAppNameParts = exports.getAppId = void 0;
const namehash_1 = require("~/src/utils/namehash");
const DEFAULT_APM_REGISTRY = 'aragonpm.eth';
/**
 * Returns true if a string looks like hex
 * @param maybeHex
 */
function seemsHex(maybeHex) {
    return maybeHex.startsWith('0x');
}
/**
 * Returns the hashed appId given a partial or full app name
 * @param appNameOrId "finance" | "finance.aragonpm.eth"
 * @param registry If appName is a partial ENS domain, provide a custom registry
 */
function getAppId(appNameOrId, registry) {
    if (seemsHex(appNameOrId)) {
        // Is already an appId
        return appNameOrId;
    }
    else {
        const fullAppName = getFullAppName(appNameOrId, registry);
        return namehash_1.namehash(fullAppName);
    }
}
exports.getAppId = getAppId;
/**
 * Returns the parts of an appName split by shortName and registry
 * @param appName "finance.aragonpm.eth"
 */
function getAppNameParts(appName) {
    const nameParts = getFullAppName(appName).split('.');
    return {
        shortName: nameParts[0],
        registryName: nameParts.slice(1).join('.')
    };
}
exports.getAppNameParts = getAppNameParts;
/**
 * Returns the full ENS domain app name
 * @param appName "finance" | "finance.aragonpm.eth"
 * @param registry "open.aragonpm.eth"
 */
function getFullAppName(appName, registry = DEFAULT_APM_REGISTRY) {
    if (!appName)
        throw Error(`appName is not defined`);
    // Already full ENS domain
    if (appName.includes('.'))
        return appName;
    // Concat with registry
    return `${appName}.${registry}`;
}
exports.getFullAppName = getFullAppName;
//# sourceMappingURL=appName.js.map