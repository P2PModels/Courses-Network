"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const appName_1 = require("~/src/utils/appName");
const apm_1 = require("~/src/utils/apm");
const ApmRepoAbi = [
    'function getLatest() public view returns (uint16[3] semanticVersion, address contractAddress, bytes contentURI)',
    'function getBySemanticVersion(uint16[3] _semanticVersion) public view returns (uint16[3] semanticVersion, address contractAddress, bytes contentURI)'
];
/**
 * Fetches APM Repo version from external network
 * @param name "finance.aragonpm.eth"
 * @param version "2.0.0"
 * @param provider ethers provider connected to an external network
 */
async function getExternalRepoVersion(name, version, provider) {
    const contract = new ethers_1.ethers.Contract(appName_1.getFullAppName(name), ApmRepoAbi, provider);
    const { contentURI, contractAddress } = version
        ? await contract.getBySemanticVersion(apm_1.toApmVersionArray(version))
        : await contract.getLatest();
    // throws an error in the event it is not an address
    ethers_1.ethers.utils.getAddress(contractAddress);
    if (!contentURI)
        throw Error('version data contentURI is not defined');
    return { contentURI, contractAddress };
}
exports.default = getExternalRepoVersion;
//# sourceMappingURL=getRepoVersion.js.map