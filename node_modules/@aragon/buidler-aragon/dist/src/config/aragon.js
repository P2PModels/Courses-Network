"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExtender = exports.defaultAragonConfig = void 0;
const params_1 = require("~/src/params");
exports.defaultAragonConfig = {
    appServePort: 8001,
    clientServePort: 3000,
    appBuildOutputPath: 'dist/',
    ignoreFilesPath: '.',
    ipfsGateway: params_1.defaultIpfsGateway,
    deployedAddresses: {
        ens: params_1.defaultLocalAragonBases.ensAddress,
        apm: params_1.defaultLocalAragonBases.apmAddress,
        daoFactory: params_1.defaultLocalAragonBases.daoFactoryAddress
    }
};
exports.configExtender = (finalConfig, userConfig) => {
    // Apply defaults
    finalConfig.aragon = Object.assign(Object.assign({}, exports.defaultAragonConfig), (userConfig.aragon || {}));
};
//# sourceMappingURL=aragon.js.map