"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApp = void 0;
const deploy_implementation_1 = require("./deploy-implementation");
const appName_1 = require("~/src/utils/appName");
const accounts_1 = require("~/src/utils/accounts");
async function updateApp({ appName, dao, repo, appServePort }, bre) {
    // Deploy a new app implementation.
    const implementation = await deploy_implementation_1.deployImplementation(bre.artifacts);
    // Update the repo with the new implementation.
    const { version, uri } = await _updateRepo(repo, implementation.address, appServePort);
    // Update the proxy with the new implementation.
    await _updateProxy({ implementationAddress: implementation.address, appName, dao }, bre);
    return { implementationAddress: implementation.address, version, uri };
}
exports.updateApp = updateApp;
/**
 * Updates the app proxy's implementation in the Kernel.
 */
async function _updateProxy({ implementationAddress, appName, dao }, bre) {
    const rootAccount = await accounts_1.getRootAccount(bre);
    const appId = appName_1.getAppId(appName);
    // Set the new implementation in the Kernel.
    await dao.setApp(await dao.APP_BASES_NAMESPACE(), appId, implementationAddress, {
        from: rootAccount
    });
}
/**
 * Bump APM repository with a new version.
 */
async function _updateRepo(repo, implementationAddress, appServePort) {
    // Calculate next valid semver.
    const semver = [
        (await repo.getVersionsCount()).toNumber() + 1,
        0,
        0
    ];
    // URI where this plugin is serving the app's front end.
    const contentUri = `http://localhost:${appServePort}`;
    const contentUriBytes = `0x${Buffer.from(contentUri).toString('hex')}`;
    // Create a new version in the app's repo, with the new implementation.
    await repo.newVersion(semver, implementationAddress, contentUriBytes);
    return { version: semver, uri: contentUri };
}
//# sourceMappingURL=update-app.js.map