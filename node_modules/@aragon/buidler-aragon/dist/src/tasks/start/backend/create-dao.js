"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDao = void 0;
const accounts_1 = require("~/src/utils/accounts");
const getLog_1 = require("~/src/utils/getLog");
/**
 * Deploys a new DAO with direct/pure interaction with aragonOS.
 * @returns DAO's Kernel TruffleContract.
 */
async function createDao(bre, artifacts, daoFactoryAddress) {
    const rootAccount = await accounts_1.getRootAccount(bre);
    // Create a DAO instance using the factory.
    const DAOFactory = artifacts.require('DAOFactory');
    const daoFactory = await DAOFactory.at(daoFactoryAddress);
    const txResponse = await daoFactory.newDAO(rootAccount);
    // Find the created DAO instance address from the transaction logs.
    const daoAddress = getLog_1.getLog(txResponse, 'DeployDAO', 'dao');
    // Use the DAO address to construct a full KernelInstance object.
    const Kernel = artifacts.require('Kernel');
    const dao = await Kernel.at(daoAddress);
    // Give rootAccount the ability to manage apps.
    const aclAddress = await dao.acl();
    const ACL = artifacts.require('ACL');
    const acl = await ACL.at(aclAddress);
    await acl.createPermission(rootAccount, dao.address, await dao.APP_MANAGER_ROLE(), rootAccount, { from: rootAccount });
    return dao;
}
exports.createDao = createDao;
//# sourceMappingURL=create-dao.js.map