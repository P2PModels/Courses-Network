"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployApm = void 0;
const params_1 = require("~/src/params");
const accounts_1 = require("~/src/utils/accounts");
const getLog_1 = require("~/src/utils/getLog");
const namehash_1 = require("~/src/utils/namehash");
/**
 * Deploys a new DAOFactory with direct/pure interaction with aragonOS.
 * @returns DAOFactory's instance.
 */
async function deployApm(bre, artifacts, ens, daoFactory) {
    const rootAccount = await accounts_1.getRootAccount(bre);
    // Retrieve contract artifacts.
    const APMRegistry = artifacts.require('APMRegistry');
    const Repo = artifacts.require('Repo');
    const ENSSubdomainRegistrar = artifacts.require('ENSSubdomainRegistrar');
    const APMRegistryFactory = artifacts.require('APMRegistryFactory');
    // Deploy apm base.
    const apmRegistryBase = await APMRegistry.new();
    const apmRepoBase = await Repo.new();
    const ensSubdomainRegistrarBase = await ENSSubdomainRegistrar.new();
    // Deploy APMFactory.
    const apmFactory = await APMRegistryFactory.new(daoFactory.address, apmRegistryBase.address, apmRepoBase.address, ensSubdomainRegistrarBase.address, ens.address, params_1.ZERO_ADDRESS);
    // Creating aragonpm.eth subdomain and assigning it to APMRegistryFactory.
    const tldHash = namehash_1.namehash('eth');
    const labelHash = bre.web3.utils.keccak256('aragonpm');
    await ens.setSubnodeOwner(tldHash, labelHash, apmFactory.address);
    // Deploy APMRegistry.
    const txResponse = await apmFactory.newAPM(tldHash, labelHash, rootAccount);
    // Find the created APMRegistry instance address from the transaction logs.
    const apmAddress = getLog_1.getLog(txResponse, 'DeployAPM', 'apm');
    const apm = await APMRegistry.at(apmAddress);
    return apm;
}
exports.deployApm = deployApm;
//# sourceMappingURL=deploy-apm.js.map