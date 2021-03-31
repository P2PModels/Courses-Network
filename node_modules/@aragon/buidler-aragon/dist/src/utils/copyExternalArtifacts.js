"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyExternalArtifacts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Copy external artifacts to the local artifacts folder
 * This is a temporary hack until multiple artifacts paths are allowed
 * @param externalArtifactsPath 'node_modules/@aragon/abis/os/artifacts'
 */
function copyExternalArtifacts(externalArtifactsPath, localArtifactsPath = 'artifacts') {
    const fromDir = path_1.default.resolve(externalArtifactsPath);
    const toDir = path_1.default.resolve(localArtifactsPath);
    if (!fs_1.default.existsSync(fromDir))
        return; //fail silently
    for (const file of fs_1.default.readdirSync(fromDir)) {
        const from = path_1.default.join(fromDir, file);
        const to = path_1.default.join(toDir, file);
        if (!fs_1.default.existsSync(to))
            fs_1.default.copyFileSync(from, to);
    }
}
exports.copyExternalArtifacts = copyExternalArtifacts;
//# sourceMappingURL=copyExternalArtifacts.js.map