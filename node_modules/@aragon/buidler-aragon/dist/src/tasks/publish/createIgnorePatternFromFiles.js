"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fsUtils_1 = require("~/src/utils/fsUtils");
/**
 * Reads ignore files from disk and aggregates their glob patterns
 * into a single array
 * @param rootPath Dir to find ignore files
 */
function createIgnorePatternFromFiles(rootPath) {
    const ignorePatterns = [];
    for (const filename of ['.ipfsignore', '.gitignore']) {
        const data = fsUtils_1.readFileIfExists(path_1.default.join(rootPath, filename));
        if (data) {
            const ignoreLines = data
                .trim()
                .split('\n')
                .filter(l => l.trim());
            ignorePatterns.push(...ignoreLines);
        }
    }
    return ignorePatterns;
}
exports.default = createIgnorePatternFromFiles;
//# sourceMappingURL=createIgnorePatternFromFiles.js.map