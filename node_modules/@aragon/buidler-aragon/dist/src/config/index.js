"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExtender = void 0;
const aragon_1 = require("./aragon");
const mnemonic_1 = require("./mnemonic");
const networks_1 = require("./networks");
exports.configExtender = (finalConfig, userConfig) => {
    networks_1.configExtender(finalConfig, userConfig);
    mnemonic_1.configExtender(finalConfig, userConfig);
    aragon_1.configExtender(finalConfig, userConfig);
};
//# sourceMappingURL=index.js.map