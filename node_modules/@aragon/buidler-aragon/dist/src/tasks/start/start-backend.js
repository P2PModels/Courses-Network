"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBackend = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const stream_1 = require("stream");
const logger_1 = require("~/src/ui/logger");
const appInstaller_1 = __importDefault(require("~/src/utils/appInstaller"));
const arappUtils_1 = require("~/src/utils/arappUtils");
const artifact_1 = require("~/src/utils/artifact");
const onExit_1 = __importDefault(require("~/src/utils/onExit"));
const task_names_1 = require("~/src/tasks/task-names");
const deploy_bases_1 = __importDefault(require("./backend/bases/deploy-bases"));
const create_app_1 = require("./backend/create-app");
const create_dao_1 = require("./backend/create-dao");
const update_app_1 = require("./backend/update-app");
const set_permissions_1 = require("./backend/set-permissions");
const start_ganache_1 = require("./backend/start-ganache");
/**
 * Starts the task's backend sub-tasks. Logic is contained in ./tasks/start/utils/backend/.
 * Creates a Dao and a Repo for the app in development and watches for changes in
 * contracts. When contracts change, it compiles the contracts, deploys them and updates the
 * proxy in the Dao.
 * @returns Promise<{ daoAddress: string, appAddress: string }> Dao and app address that can
 * be used with an Aragon client to view the app.
 */
async function startBackend({ appName, silent }, bre) {
    const config = bre.config.aragon;
    const hooks = config.hooks;
    const ipfsGateway = config.ipfsGateway;
    await _compileDisablingOutput(bre, silent);
    /**
     * Until BuidlerEVM JSON RPC is ready, a ganache server will be started
     * on the appropiate conditions.
     */
    const { networkId, close: closeGanache } = await start_ganache_1.startGanache(bre);
    if (networkId !== 0) {
        logger_1.logBack(`Started a ganache testnet instance with id ${networkId}.`);
    }
    // Deploy bases.
    logger_1.logBack('Deploying Aragon bases (ENS, DAOFactory, and APM)...');
    const { ensAddress, daoFactoryAddress, apmAddress } = await deploy_bases_1.default(bre);
    logger_1.logBack(`ENS deployed: ${ensAddress}`);
    logger_1.logBack(`DAO factory deployed: ${daoFactoryAddress}`);
    logger_1.logBack(`APM deployed: ${apmAddress}`);
    // Read arapp.json.
    const arapp = arappUtils_1.readArapp();
    // Call preDao hook.
    if (hooks && hooks.preDao) {
        await hooks.preDao({ log: logger_1.logHook('preDao') }, bre);
    }
    // Create a DAO.
    logger_1.logBack('Deploying DAO and app repository...');
    const dao = await create_dao_1.createDao(bre, bre.artifacts, daoFactoryAddress);
    logger_1.logBack(`DAO deployed: ${dao.address}`);
    const _experimentalAppInstaller = appInstaller_1.default({ apmAddress, dao, ipfsGateway }, bre);
    // Call postDao hook.
    if (hooks && hooks.postDao) {
        await hooks.postDao({ dao, _experimentalAppInstaller, log: logger_1.logHook('postDao') }, bre);
    }
    // Create app.
    // Note: This creates the proxy, but doesn't
    // initialize it yet.
    logger_1.logBack('Creating app...');
    const { proxy, repo } = await create_app_1.createApp({ appName, dao, ensAddress }, bre);
    logger_1.logBack(`Proxy address: ${proxy.address}`);
    logger_1.logBack(`Repo address: ${repo.address}`);
    // Call preInit hook.
    if (hooks && hooks.preInit) {
        await hooks.preInit({ proxy, _experimentalAppInstaller, log: logger_1.logHook('preInit') }, bre);
    }
    // Call getInitParams hook.
    let proxyInitParams = [];
    if (hooks && hooks.getInitParams) {
        const params = await hooks.getInitParams({ log: logger_1.logHook('initParams') }, bre);
        proxyInitParams = params ? params : proxyInitParams;
    }
    if (proxyInitParams && proxyInitParams.length > 0) {
        logger_1.logBack(`Proxy init params: ${proxyInitParams}`);
    }
    // Update app.
    const appServePort = config.appServePort;
    const { implementationAddress, version } = await update_app_1.updateApp({ appName, dao, repo, appServePort }, bre);
    logger_1.logBack(`Implementation address: ${implementationAddress}`);
    logger_1.logBack(`App version: ${version}`);
    // Initialize the proxy.
    logger_1.logBack('Initializing proxy...');
    await proxy.initialize(...proxyInitParams);
    logger_1.logBack(`Proxy initialized: ${await proxy.hasInitialized()}`);
    // Call postInit hook.
    if (hooks && hooks.postInit) {
        await hooks.postInit({ proxy, _experimentalAppInstaller, log: logger_1.logHook('postInit') }, bre);
    }
    // TODO: What if user wants to set custom permissions?
    // Use a hook? A way to disable all open permissions?
    await set_permissions_1.setAllPermissionsOpenly(dao, proxy, arapp, bre, bre.artifacts);
    logger_1.logBack('All permissions set openly.');
    // Watch back-end files.
    const contractsWatcher = chokidar_1.default
        .watch('./contracts/', {
        awaitWriteFinish: { stabilityThreshold: 1000 }
    })
        .on('change', async () => {
        logger_1.logBack(`Triggering backend build...`);
        const compilationSucceeded = await _compileDisablingOutput(bre, silent, false);
        // Do nothing if contract compilation fails.
        if (!compilationSucceeded) {
            logger_1.logBack('Unable to update proxy, please check your contracts.');
            return;
        }
        // Update artifacts.
        logger_1.logBack('Updating artifacts...');
        const appBuildOutputPath = config.appBuildOutputPath;
        await artifact_1.generateArtifacts(appBuildOutputPath, bre);
        // Update app.
        logger_1.logBack('Updating app...');
        const { implementationAddress, version } = await update_app_1.updateApp({ appName, dao, repo, appServePort }, bre);
        logger_1.logBack(`Implementation address: ${implementationAddress}`);
        logger_1.logBack(`App version: ${version}`);
        // Call postUpdate hook.
        if (hooks && hooks.postUpdate) {
            await hooks.postUpdate({ proxy, log: logger_1.logHook('postUpdate') }, bre);
        }
    });
    onExit_1.default(() => {
        contractsWatcher.close();
    });
    return {
        daoAddress: dao.address,
        appAddress: proxy.address,
        close: () => {
            contractsWatcher.close();
            if (closeGanache)
                closeGanache();
        }
    };
}
exports.startBackend = startBackend;
/**
 * Buidler's compile task currently calls console.logs.
 * Until they can be disabled as an option, this workaround removes them.
 */
async function _compileDisablingOutput(bre, silent, exitOnFailure = true) {
    logger_1.logBack('Compiling contracts...');
    const consoleCache = console;
    if (silent) {
        // eslint-disable-next-line no-console
        console = new console.Console(new stream_1.Writable());
    }
    let success = true;
    await bre.run(task_names_1.TASK_COMPILE).catch(err => {
        logger_1.logBack(err.message);
        success = false;
        if (exitOnFailure) {
            process.exit(1);
        }
    });
    console = consoleCache;
    if (success) {
        logger_1.logBack('Contracts compiled.');
    }
    return success;
}
//# sourceMappingURL=start-backend.js.map