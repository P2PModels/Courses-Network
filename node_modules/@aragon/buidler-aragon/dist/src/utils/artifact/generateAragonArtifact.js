"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAragonArtifact = void 0;
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const web3_utils_1 = require("web3-utils");
const appName_1 = require("~/src/utils/appName");
const ast_1 = require("~/src/utils/ast");
const abiFallback = {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
};
function _generateAragonArtifact(arapp, appName, abi, functions) {
    const abiFunctions = abi.filter(abiElem => abiElem.type === 'function');
    const abiBySignature = lodash_1.keyBy(abiFunctions, ethers_1.ethers.utils.formatSignature);
    return Object.assign(Object.assign({}, arapp), { 
        // Artifact appears to require the abi of each function
        functions: functions.map(parsedFn => ({
            roles: parsedFn.roles.map(role => role.id),
            notice: parsedFn.notice,
            abi: abiBySignature[parsedFn.sig] ||
                (parsedFn.sig === 'fallback' ? abiFallback : null),
            // #### Todo: Is the signature actually necessary?
            // > Will keep them for know just in case, they are found in current release
            sig: parsedFn.sig
        })), deprecatedFunctions: {}, 
        // Artifact appears to require the roleId to have bytes precomputed
        roles: (arapp.roles || []).map(role => (Object.assign(Object.assign({}, role), { bytes: web3_utils_1.keccak256(role.id) }))), abi, 
        // Additional metadata
        flattenedCode: './code.sol', appName, appId: appName_1.getAppId(appName) });
}
function generateAragonArtifact(arapp, appName, abi, functionsOrSourceCode, contractName) {
    if (typeof functionsOrSourceCode === 'string') {
        if (!contractName)
            throw Error('contractName must be defined');
        const functions = ast_1.parseContractFunctions(functionsOrSourceCode, contractName);
        return _generateAragonArtifact(arapp, appName, abi, functions);
    }
    else if (Array.isArray(functionsOrSourceCode)) {
        return _generateAragonArtifact(arapp, appName, abi, functionsOrSourceCode);
    }
    else {
        throw Error('Parameter functionsOrSourceCode must be of type AragonContractFunction[] | string');
    }
}
exports.generateAragonArtifact = generateAragonArtifact;
//# sourceMappingURL=generateAragonArtifact.js.map