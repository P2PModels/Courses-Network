"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupStartTask = void 0;
const path_1 = __importDefault(require("path"));
const tcp_port_used_1 = __importDefault(require("tcp-port-used"));
const config_1 = require("@nomiclabs/buidler/config");
const plugins_1 = require("@nomiclabs/buidler/plugins");
const params_1 = require("~/src/params");
const logger_1 = require("~/src/ui/logger");
const appName_1 = require("~/src/utils/appName");
const arappUtils_1 = require("~/src/utils/arappUtils");
const fsUtils_1 = require("~/src/utils/fsUtils");
const onExit_1 = __importDefault(require("~/src/utils/onExit"));
const start_backend_1 = require("./start/start-backend");
const start_client_1 = require("./start/start-client");
const start_frontend_1 = require("./start/start-frontend");
const task_names_1 = require("./task-names");
/**
 * Sets up the start task
 * Main, composite, task. Calls startBackend, then startFrontend,
 * and then returns an unresolving promise to keep the task open.
 *
 * Note: Tasks must be setup in a function. If task() is run in the
 * module body on test teardown, they will not be setup again
 */
function setupStartTask() {
    config_1.task(task_names_1.TASK_START, 'Starts Aragon app development')
        .addFlag('noBrowser', 'Prevents opening of a browser tab with the Aragon client once the app is built.')
        .addFlag('silent', 'Silences all console output')
        .setAction(async (params, bre) => {
        if (params.silent) {
            // eslint-disable-next-line
            console.log = () => { };
        }
        logger_1.logMain(`Starting Aragon app development...`);
        const arapp = arappUtils_1.readArapp();
        const appNameProduction = arappUtils_1.parseAppName(arapp);
        const { shortName } = appName_1.getAppNameParts(appNameProduction);
        // Note: Since only the aragonpm.eth APM registry is deployed in development,
        // all apps will be hosted there regardless of their name
        const appName = `${shortName}.aragonpm.eth`;
        const appId = appName_1.getAppId(appName);
        logger_1.logMain(`App name: ${shortName}
App id: ${appId}`);
        let accountsStr = '';
        for (let i = 0; i < params_1.aragenAccounts.length; i++) {
            const account = params_1.aragenAccounts[i];
            accountsStr += `Account ${i} private key ${account.privateKey}\n`;
            accountsStr += `           public key ${account.publicKey}\n`;
        }
        logger_1.logMain(`Accounts mnemonic "${params_1.aragenMnemonic}"
${accountsStr}`);
        const { daoAddress, appAddress, close: closeBackend } = await start_backend_1.startBackend({ appName, silent: params.silent }, bre);
        const closeHandlers = [];
        closeHandlers.push(closeBackend);
        const config = bre.config.aragon;
        if (!config.appSrcPath) {
            logger_1.logMain('Warning: appSrcPath is not defined, will continue development without building any front end.');
        }
        else if (!fsUtils_1.pathExists(config.appSrcPath)) {
            logger_1.logMain(`Warning: No front end found at ${config.appSrcPath}, will continue development without building any front end.`);
        }
        else {
            await _checkPorts(config);
            await _checkScripts(config.appSrcPath);
            // #### Here the app closes after 10 seconds
            // The delay is caused by buidler artifact instances that may be doing polling
            const { close: closeFrontend } = await start_frontend_1.startFrontend(bre);
            closeHandlers.push(closeFrontend);
        }
        const { close: closeClient } = await start_client_1.startClient(bre, daoAddress, appAddress, !params.noBrowser);
        closeHandlers.push(closeClient);
        function close() {
            for (const closeHandler of closeHandlers)
                closeHandler();
        }
        onExit_1.default(close);
        if (params.noBlocking)
            return { close };
        else
            await new Promise(() => { });
    });
}
exports.setupStartTask = setupStartTask;
async function _checkPorts(config) {
    if (await tcp_port_used_1.default.check(config.clientServePort)) {
        throw new plugins_1.BuidlerPluginError(`Cannot start client. Port ${config.clientServePort} is in use. If you have an instance of the client already running use the command with the flag --no-browser.`);
    }
    if (await tcp_port_used_1.default.check(config.appServePort)) {
        throw new plugins_1.BuidlerPluginError(`Cannot serve app. Port ${config.appServePort} is in use.`);
    }
}
async function _checkScripts(appSrcPath) {
    const appPackageJson = fsUtils_1.readJson(path_1.default.join(appSrcPath, 'package.json'));
    _checkScript(appPackageJson, 'sync-assets');
    _checkScript(appPackageJson, 'watch');
    _checkScript(appPackageJson, 'serve');
}
function _checkScript(json, script) {
    if (!json.scripts[script]) {
        throw new plugins_1.BuidlerPluginError(`Missing script "${script}" in app/package.json.`);
    }
}
//# sourceMappingURL=start-task.js.map