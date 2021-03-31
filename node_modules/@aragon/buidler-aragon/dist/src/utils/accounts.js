"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootAccount = void 0;
/**
 * Returns the root or default account from a runtime environment
 * @param bre
 */
async function getRootAccount(bre) {
    const from = bre.config.networks[bre.network.name].from;
    return from || (await bre.web3.eth.getAccounts())[0];
}
exports.getRootAccount = getRootAccount;
//# sourceMappingURL=accounts.js.map