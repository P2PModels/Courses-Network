"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployEns = void 0;
const accounts_1 = require("~/src/utils/accounts");
const getLog_1 = require("~/src/utils/getLog");
/**
 * Deploys a new ENS instance using a ENSFactory.
 * @returns ENS's instance.
 */
async function deployEns(bre, artifacts) {
    const rootAccount = await accounts_1.getRootAccount(bre);
    // Retrieve contract artifacts.
    const ENS = artifacts.require('ENS');
    const ENSFactory = artifacts.require('ENSFactory');
    // Deploy a ENSFactory.
    const factory = await ENSFactory.new();
    const txResponse = await factory.newENS(rootAccount);
    // Find the created ENS instance address from the transaction logs.
    const ensAddress = getLog_1.getLog(txResponse, 'DeployENS', 'ens');
    const ens = await ENS.at(ensAddress);
    return ens;
}
exports.deployEns = deployEns;
//# sourceMappingURL=deploy-ens.js.map