"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFrontend = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const logger_1 = require("~/src/ui/logger");
const artifact_1 = require("~/src/utils/artifact");
const aragon_client_1 = require("./client/aragon-client");
const copy_assets_1 = require("./frontend/copy-assets");
const serve_app_1 = require("./frontend/serve-app");
const watch_app_1 = require("./frontend/watch-app");
/**
 * Starts the task's frontend sub-tasks. Logic is contained in ./tasks/start/utils/frontend/.
 * If changes are detected, the app's frontend is rebuilt.
 */
async function startFrontend(bre) {
    const config = bre.config.aragon;
    logger_1.logFront('Generating app artifacts...');
    const appBuildOutputPath = config.appBuildOutputPath;
    await artifact_1.generateArtifacts(appBuildOutputPath, bre);
    logger_1.logFront('Building front end (takes a minute)...');
    const appSrcPath = config.appSrcPath;
    const appServePort = config.appServePort;
    await copy_assets_1.copyAppUiAssets(appSrcPath);
    const { close: closeServerApp } = await serve_app_1.serveAppAndResolveWhenBuilt(appSrcPath, appServePort);
    // Watch changes to app/src/script.js.
    const srcWatcher = chokidar_1.default
        .watch('./app/src/script.js', {
        awaitWriteFinish: { stabilityThreshold: 1000 }
    })
        .on('change', async () => {
        logger_1.logFront(`script.js changed`);
        await aragon_client_1.refreshClient();
    });
    // Watch changes to artifact files.
    const artifactWatcher = chokidar_1.default
        .watch(['./arapp.json', './manifest.json'], {
        awaitWriteFinish: { stabilityThreshold: 1000 }
    })
        .on('change', path => {
        logger_1.logFront(`Warning: Changes detected on ${path}. Hot reloading is not supported on this file. Please re-run the "start" task to load these changes.`);
    });
    logger_1.logFront('Watching changes on front end...');
    const { close: closeWatchScript } = await watch_app_1.startAppWatcher(appSrcPath);
    return {
        close: () => {
            srcWatcher.close();
            artifactWatcher.close();
            closeServerApp();
            closeWatchScript();
        }
    };
}
exports.startFrontend = startFrontend;
//# sourceMappingURL=start-frontend.js.map