"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIpfsApiIsAvailable = void 0;
const ipfs_http_client_1 = __importDefault(require("ipfs-http-client"));
const plugins_1 = require("@nomiclabs/buidler/plugins");
/**
 * Sanity check to check if an IPFS API is active
 * Note: It requires the API to /api/v0/version route available
 */
async function assertIpfsApiIsAvailable(ipfsApiUrl) {
    const ipfs = ipfs_http_client_1.default(ipfsApiUrl);
    try {
        await ipfs.version();
    }
    catch (e) {
        throw new plugins_1.BuidlerPluginError(`IPFS API at ${ipfsApiUrl} is not available`);
    }
}
exports.assertIpfsApiIsAvailable = assertIpfsApiIsAvailable;
//# sourceMappingURL=assertIpfsApiIsAvailable.js.map