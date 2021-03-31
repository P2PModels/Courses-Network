"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLog = void 0;
const plugins_1 = require("@nomiclabs/buidler/plugins");
exports.getLog = (receipt, logName, argName) => {
    const log = receipt.logs.find(({ event }) => event === logName);
    if (!log) {
        throw new plugins_1.BuidlerPluginError(`Cannot find proxy address. Unable to find ${logName} log.`);
    }
    return log.args[argName];
};
//# sourceMappingURL=getLog.js.map