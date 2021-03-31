"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nomiclabs/buidler/config");
require("../bootstrap-paths");
const config_2 = require("./config");
// TODO: Don't use any type below, try to use something like these...
// import { ResolvedBuidlerConfig, BuidlerConfig } from '@nomiclabs/buidler/types'
function default_1() {
    // Resolve tsconfig-paths at runtime.
    require('../bootstrap-paths.js');
    // Plugin dependencies.
    config_1.usePlugin('@nomiclabs/buidler-truffle5');
    config_1.usePlugin('@nomiclabs/buidler-web3');
    config_1.usePlugin('@nomiclabs/buidler-etherscan');
    // Task definitions.
    // Note: buidler sets up the environment by appending tasks to it. This happens when a task() function is called. Therefore, task() must be called on every test run, not only for the first time. However, when node imports a file with require the module body will only be run once on the first time and then use the cached result.
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { setupPublishTask } = require('./tasks/publish');
    const { setupStartTask } = require('./tasks/start-task');
    setupPublishTask();
    setupStartTask();
    /* eslint-enable @typescript-eslint/no-var-requires */
    // Environment extensions.
    // No extensions atm.
    // Default configuration values.
    config_1.extendConfig(config_2.configExtender);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map