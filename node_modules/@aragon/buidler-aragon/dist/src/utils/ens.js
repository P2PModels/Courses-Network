"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveName = void 0;
const ethers_1 = require("ethers");
/**
 * Resolve ENS name with custom ensAddress
 * @param name
 * @param bre
 * @param customEnsAddress
 */
async function resolveName({ name, ensAddress }, bre) {
    const networkConfig = bre.network.config;
    const provider = new ethers_1.ethers.providers.Web3Provider(bre.web3.currentProvider, {
        name: bre.network.name,
        chainId: networkConfig.chainId || 5555,
        ensAddress
    });
    return provider.resolveName(name);
}
exports.resolveName = resolveName;
//# sourceMappingURL=ens.js.map