"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopGanache = exports.startGanache = void 0;
const tcp_port_used_1 = __importDefault(require("tcp-port-used"));
const util_1 = require("util");
const plugins_1 = require("@nomiclabs/buidler/plugins");
const params_1 = require("~/src/params");
// There's an issue with how web3 exports its typings that conflicts with
// ganache-core imports of those typings. Follow https://github.com/trufflesuite/ganache-core/issues/465
// for upcoming solutions, meanwhile require is used to ignore the types.
/* eslint-disable @typescript-eslint/no-var-requires */
const ganache = require('ganache-core');
let server;
async function startGanache(bre) {
    if (bre.network.name === 'buidlerevm') {
        throw new plugins_1.BuidlerPluginError('Cannot use buidlerevm network for this task until a JSON RPC is exposed');
    }
    if (bre.network.name !== 'localhost') {
        throw new plugins_1.BuidlerPluginError('This plugin currently requires that the localhost network is used.');
    }
    const nodeUrl = bre.network.config.url;
    const port = nodeUrl ? parsePort(nodeUrl) || params_1.testnetPort : params_1.testnetPort;
    // If port is in use, assume that a local chain is already running.
    const portInUse = await tcp_port_used_1.default.check(port);
    if (portInUse) {
        return { networkId: 0 };
    }
    // Start a new ganache server.
    server = ganache.server({
        gasLimit: params_1.aragenGasLimit,
        mnemonic: params_1.aragenMnemonic,
        /* eslint-disable @typescript-eslint/camelcase */
        default_balance_ether: 100
    });
    const blockchain = await util_1.promisify(server.listen)(port);
    return {
        networkId: blockchain.options.network_id,
        close: () => {
            server.close();
        }
    };
}
exports.startGanache = startGanache;
function stopGanache() {
    if (!server) {
        throw new plugins_1.BuidlerPluginError('Cant stop ganache server because it doesnt seem to be running.');
    }
    server.close();
}
exports.stopGanache = stopGanache;
function parsePort(urlString) {
    const url = new URL(urlString);
    if (!url || !url.port)
        return null;
    return parseInt(url.port);
}
//# sourceMappingURL=start-ganache.js.map