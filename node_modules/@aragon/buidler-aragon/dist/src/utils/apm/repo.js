"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canPublishVersion = exports.getRepoVersion = void 0;
const ethers_1 = require("ethers");
const appName_1 = require("~/src/utils/appName");
const abis_1 = require("./abis");
const utils_1 = require("./utils");
/**
 * Internal logic shared with single and all version fetchers
 * @param repo Initialized ethers APM Repo contract
 * @param version Version to fetch: 'latest', '0.2.0', 14
 */
async function _getRepoVersion(repo, version) {
    const res = typeof version === 'number'
        ? await repo.getByVersionId(version)
        : version === 'latest'
            ? await repo.getLatest()
            : await repo.getBySemanticVersion(utils_1.toApmVersionArray(version));
    return utils_1.parseApmVersionReturn(res);
}
/**
 * Return a Repo instance of an ethers contract
 * @param appId "finance", "finance.aragonpm.eth", "0xa600c17..."
 * @param provider Initialized ethers provider
 */
function _getRepoInstance(appId, provider) {
    const addressOrFullEnsName = utils_1.isAddress(appId) ? appId : appName_1.getFullAppName(appId); // Make sure appId is a full ENS domain
    return new ethers_1.ethers.Contract(addressOrFullEnsName, abis_1.repoAbi, provider);
}
/**
 * Fetch a single version of an APM Repo
 * @param repoNameOrAddress "finance", "finance.aragonpm.eth", "0xa600c17..."
 * @param version Version to fetch: 'latest', '0.2.0', 14
 * @param provider Initialized ethers provider
 */
function getRepoVersion(repoNameOrAddress, version = 'latest', provider) {
    const repo = _getRepoInstance(repoNameOrAddress, provider);
    return _getRepoVersion(repo, version);
}
exports.getRepoVersion = getRepoVersion;
/**
 * Returns true if the address can publish a new version to this repo
 * @param repoNameOrAddress "finance", "finance.aragonpm.eth", "0xa600c17..."
 * @param sender Account attempting to publish "0xE04cAbcB24e11620Dd62bB99c396E76cEB578914"
 * @param provider Initialized ethers provider
 */
async function canPublishVersion(repoNameOrAddress, sender, provider) {
    const repo = _getRepoInstance(repoNameOrAddress, provider);
    const CREATE_VERSION_ROLE = await repo.CREATE_VERSION_ROLE();
    return await repo.canPerform(sender, CREATE_VERSION_ROLE, []);
}
exports.canPublishVersion = canPublishVersion;
//# sourceMappingURL=repo.js.map