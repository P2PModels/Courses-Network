"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployImplementation = void 0;
const arappUtils_1 = require("~/src/utils/arappUtils");
/**
 * Deploys the app's current contract.
 * @returns Promise<Truffle.Contract<any>> The deployed TruffleContract instance
 * for the app's main contract.
 */
async function deployImplementation(artifacts) {
    const mainContractName = arappUtils_1.getMainContractName();
    // Deploy the main contract.
    const App = artifacts.require(mainContractName);
    const implementation = await App.new();
    return implementation;
}
exports.deployImplementation = deployImplementation;
//# sourceMappingURL=deploy-implementation.js.map