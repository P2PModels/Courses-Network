"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePublishVersionTxData = exports.publishVersionIntent = exports.publishVersion = void 0;
const ethers_1 = require("ethers");
const semver_1 = __importDefault(require("semver"));
const appName_1 = require("~/src/utils/appName");
const abis_1 = require("./abis");
const utils_1 = require("./utils");
/**
 * Return the kernel address of an aragon app contract
 * @param appId 'finance.aragonpm.eth' | 'aragonpm.eth'
 * @param provider Initialized ethers provider
 */
function _getKernel(appId, provider) {
    const app = new ethers_1.ethers.Contract(appId, abis_1.appStorageAbi, provider);
    return app.kernel();
}
/**
 * Return tx data to publish a new version of an APM repo
 * If the repo does not exist yet, it will return a tx to create
 * a new repo and publish first version to its registry
 * @param appName "finance.aragonpm.eth"
 * @param provider Initialized ethers provider
 * @param versionInfo Object with required version info
 * @param options Additional options
 *  - managerAddress: Must be provided to deploy a new repo
 */
async function publishVersion(appName, versionInfo, provider, options) {
    const { version, contentUri, contractAddress } = versionInfo;
    if (!semver_1.default.valid(version)) {
        throw new Error(`${version} is not a valid semantic version`);
    }
    const repoAddress = await provider.resolveName(appName);
    const versionArray = utils_1.toApmVersionArray(version);
    if (repoAddress) {
        // If the repo exists, create a new version in the repo
        return {
            to: repoAddress,
            methodName: 'newVersion',
            params: [versionArray, contractAddress, contentUri]
        };
    }
    else {
        // If the repo does not exist yet, create a repo with the first version
        const { shortName, registryName } = appName_1.getAppNameParts(appName);
        const registryAddress = await provider.resolveName(registryName);
        const managerAddress = options && options.managerAddress;
        if (!registryAddress)
            throw Error(`Registry ${registryName} does not exist`);
        if (!managerAddress)
            throw Error('managerAddress must be provided');
        return {
            to: registryAddress,
            methodName: 'newRepoWithVersion',
            params: [
                shortName,
                managerAddress,
                versionArray,
                contractAddress,
                contentUri
            ]
        };
    }
}
exports.publishVersion = publishVersion;
/**
 * Wrapps publishVersion to return the tx data formated as an aragon.js intent
 * @param appName "finance.aragonpm.eth"
 * @param provider Initialized ethers provider
 * @param versionInfo Object with required version info
 * @param options Additional options
 *  - managerAddress: Must be provided to deploy a new repo
 */
async function publishVersionIntent(appName, versionInfo, provider, options) {
    const txData = await publishVersion(appName, versionInfo, provider, options);
    const { to, methodName, params } = txData;
    return {
        dao: await _getKernel(to, provider),
        proxyAddress: to,
        methodName,
        params,
        targetContract: to
    };
}
exports.publishVersionIntent = publishVersionIntent;
/**
 * Returns encoded tx data for publishing a new version
 */
function encodePublishVersionTxData({ methodName, params }) {
    switch (methodName) {
        case 'newRepoWithVersion':
            const apmRegistry = new ethers_1.ethers.utils.Interface(abis_1.apmRegistryAbi);
            return apmRegistry.functions.newRepoWithVersion.encode(params);
        case 'newVersion':
            const apmRepo = new ethers_1.ethers.utils.Interface(abis_1.repoAbi);
            return apmRepo.functions.newVersion.encode(params);
        default:
            throw Error(`Unsupported publish version method name: ${methodName}`);
    }
}
exports.encodePublishVersionTxData = encodePublishVersionTxData;
//# sourceMappingURL=publishVersion.js.map