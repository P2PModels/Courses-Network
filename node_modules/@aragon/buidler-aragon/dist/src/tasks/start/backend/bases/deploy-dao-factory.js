"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployDaoFactory = void 0;
/**
 * Deploys a new DAOFactory with direct/pure interaction with aragonOS.
 * @returns DAOFactory's instance.
 */
async function deployDaoFactory(artifacts) {
    // Retrieve contract artifacts.
    const Kernel = artifacts.require('Kernel');
    const ACL = artifacts.require('ACL');
    const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory');
    const DAOFactory = artifacts.require('DAOFactory');
    // Deploy a DAOFactory.
    const kernelBase = await Kernel.new(true /*petrifyImmediately*/);
    const aclBase = await ACL.new();
    const registryFactory = await EVMScriptRegistryFactory.new();
    const daoFactory = await DAOFactory.new(kernelBase.address, aclBase.address, registryFactory.address);
    return daoFactory;
}
exports.deployDaoFactory = deployDaoFactory;
//# sourceMappingURL=deploy-dao-factory.js.map