"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAppWatcher = void 0;
const execa_1 = __importDefault(require("execa"));
/**
 * Calls the app's front end build watcher.
 */
async function startAppWatcher(appSrcPath) {
    const watchScriptApp = execa_1.default('npm', ['run', 'watch'], { cwd: appSrcPath });
    return {
        close: () => {
            watchScriptApp.kill('SIGTERM');
        }
    };
}
exports.startAppWatcher = startAppWatcher;
//# sourceMappingURL=watch-app.js.map