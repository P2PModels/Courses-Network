"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAppUiAssets = void 0;
const execa_1 = __importDefault(require("execa"));
/**
 * Calls the app's aragon/ui copy-aragon-ui-assets script.
 */
async function copyAppUiAssets(appSrcPath) {
    await execa_1.default('npm', ['run', 'sync-assets'], { cwd: appSrcPath });
}
exports.copyAppUiAssets = copyAppUiAssets;
//# sourceMappingURL=copy-assets.js.map