"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apm_1 = require("~/src/utils/apm");
/**
 * Gets the ABI from an Aragon App release directory
 * @param contentURI
 * @param options
 */
async function getAbiFromContentUri(contentURI, options) {
    const artifact = await apm_1.resolveRepoContentUriFile(contentURI, 'artifact.json', options).then(JSON.parse);
    if (!artifact.abi)
        throw Error('artifact.json does not contain the ABI');
    return artifact.abi;
}
exports.default = getAbiFromContentUri;
//# sourceMappingURL=getAbiFromContentUri.js.map