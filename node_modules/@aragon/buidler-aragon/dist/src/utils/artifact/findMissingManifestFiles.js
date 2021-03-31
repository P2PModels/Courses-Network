"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMissingManifestFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Verifies that all files declared in the manifest exist in the distPath
 * Run this verification AFTER building the app front-end
 * Returns JSON data so the consumer can choose to show a warning or throw
 * @param manifest
 * @param distPath
 */
function findMissingManifestFiles(manifest, distPath, hasFrontend) {
    const missingFiles = [];
    function assertFile(filepath, id, required) {
        if (filepath && filepath.includes('://')) {
            // filepath maybe a remote URL, ignore those cases
            const fullPath = path_1.default.join(distPath, filepath);
            if (!fs_1.default.existsSync(fullPath))
                missingFiles.push({ path: fullPath, id, required });
        }
    }
    // Assert optional metadata
    assertFile(manifest.details_url, 'details', false);
    if (manifest.icons)
        manifest.icons.forEach((icon, i) => {
            assertFile(icon.src, `icon ${i}`, false);
        });
    if (manifest.screenshots)
        manifest.screenshots.forEach((screenshot, i) => {
            assertFile(screenshot.src, `screenshot ${i}`, false);
        });
    assertFile(manifest.start_url, 'start page', hasFrontend);
    assertFile(manifest.script, 'script', hasFrontend);
    return missingFiles;
}
exports.findMissingManifestFiles = findMissingManifestFiles;
//# sourceMappingURL=findMissingManifestFiles.js.map