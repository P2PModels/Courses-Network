"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const plugins_1 = require("@nomiclabs/buidler/plugins");
const accounts_1 = require("~/src/utils/accounts");
const appName_1 = require("~/src/utils/appName");
const arappUtils_1 = require("~/src/utils/arappUtils");
const ens_1 = require("~/src/utils/ens");
const getLog_1 = require("~/src/utils/getLog");
const deploy_implementation_1 = require("./deploy-implementation");
async function createApp({ appName, dao, ensAddress }, bre) {
    // Deploy first app implementation.
    const implementation = await deploy_implementation_1.deployImplementation(bre.artifacts);
    // Create an app proxy.
    const proxy = await _createProxy({ implementationAddress: implementation.address, appName, dao }, bre);
    // Deploy a repo for the app.
    const repo = await _createRepo({ appName, ensAddress }, bre);
    return { implementation, proxy, repo };
}
exports.createApp = createApp;
/**
 * Creates a new app proxy using a Dao, and set's the specified implementation.
 * @returns Promise<Truffle.Contract<any>> The TruffleContract instance of the
 * deployed app contract, wrapped around an upgradeably proxy address.
 */
async function _createProxy({ implementationAddress, appName, dao }, bre) {
    const rootAccount = await accounts_1.getRootAccount(bre);
    const appId = appName_1.getAppId(appName);
    // Create a new app proxy with base implementation.
    const txResponse = await dao.newAppInstance(appId, implementationAddress, '0x', false, { from: rootAccount });
    // Retrieve proxy address and wrap around abi.
    const proxyAddress = getLog_1.getLog(txResponse, 'NewAppProxy', 'proxy');
    const mainContractName = arappUtils_1.getMainContractName();
    const App = bre.artifacts.require(mainContractName);
    const proxy = await App.at(proxyAddress);
    return proxy;
}
/**
 * Creates a new APM repository.
 * @returns Promise<RepoInstance> An APM repository for the app.
 */
async function _createRepo({ appName, ensAddress }, bre) {
    const rootAccount = (await bre.web3.eth.getAccounts())[0];
    const { shortName, registryName } = appName_1.getAppNameParts(appName);
    const apmAddress = await ens_1.resolveName({ name: registryName, ensAddress }, bre);
    if (!apmAddress)
        throw new plugins_1.BuidlerPluginError(`No APM registry configured for ${registryName}`);
    // Create a new repo using the APM.
    const APMRegistry = bre.artifacts.require('APMRegistry');
    const apmRegistry = await APMRegistry.at(apmAddress);
    const txResponse = await apmRegistry.newRepo(shortName, rootAccount);
    // Retrieve repo address from creation tx logs.
    const repoAddress = getLog_1.getLog(txResponse, 'NewRepo', 'repo');
    // Wrap Repo address with abi.
    const Repo = bre.artifacts.require('Repo');
    const repo = await Repo.at(repoAddress);
    return repo;
}
//# sourceMappingURL=create-app.js.map