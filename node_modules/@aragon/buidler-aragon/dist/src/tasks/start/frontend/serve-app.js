"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveAppAndResolveWhenBuilt = void 0;
const execa_1 = __importDefault(require("execa"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Starts the app's front end sever.
 */
async function serveAppAndResolveWhenBuilt(appSrcPath, appServePort) {
    // Trigger serving in app/.
    const serveAppIndexProcess = execa_1.default('npm', ['run', 'serve', '--', '--port', `${appServePort}`], { cwd: appSrcPath });
    // Query the server for an index.html file.
    // and resolve only when the file is found (with a timeout).
    const maxWaitingTime = 60 * 1000;
    const startingTime = Date.now();
    while (Date.now() - startingTime < maxWaitingTime) {
        try {
            await node_fetch_1.default(`http://localhost:${appServePort}`, { timeout: 10 * 1000 });
            // Server is active and serving, resolve.
            break;
        }
        catch (e) {
            // Ignore errors, at worse after maxWaitingTime this will resolve.
            // Pause for a bit to prevent performing requests too fast.
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return {
        close: () => {
            serveAppIndexProcess.kill('SIGTERM');
        }
    };
}
exports.serveAppAndResolveWhenBuilt = serveAppAndResolveWhenBuilt;
//# sourceMappingURL=serve-app.js.map