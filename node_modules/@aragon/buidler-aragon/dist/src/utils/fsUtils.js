"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.ensureDir = exports.writeJson = exports.readJsonIfExists = exports.readJson = exports.writeFile = exports.readFileIfExists = exports.readFile = exports.pathExists = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * tests whether or not the given path exists by checking with the file system.
 * @param filepath path
 */
exports.pathExists = (filepath) => fs_extra_1.default.existsSync(filepath);
/**
 * Read file contents as a string (UTF-8)
 * @param filepath path
 */
exports.readFile = (filepath) => fs_extra_1.default.readFileSync(filepath, 'utf8');
/**
 * Read file contents as string or if the path doesn't exists returns undefined
 * @param filepath path
 */
exports.readFileIfExists = (filepath) => exports.pathExists(filepath) ? exports.readFile(filepath) : undefined;
/**
 * Write string data to file
 * @param filepath
 */
exports.writeFile = (filepath, data) => fs_extra_1.default.writeFileSync(filepath, data);
/**
 * Read file contents as JSON
 * @param filepath path
 */
exports.readJson = (filepath) => fs_extra_1.default.readJsonSync(filepath);
/**
 * Read file contents as JSON or if the path doesn't exists returns undefined
 * @param filepath path
 */
exports.readJsonIfExists = (filepath) => exports.pathExists(filepath) ? exports.readJson(filepath) : undefined;
/**
 * Write JSON data to file
 * @param filepath path
 * @param data
 */
exports.writeJson = (filepath, data) => fs_extra_1.default.writeJsonSync(filepath, data);
/**
 * If given path does not exists, creates a directory recursively
 * @param filepath path
 */
exports.ensureDir = (filepath) => fs_extra_1.default.ensureDirSync(filepath);
/**
 * Removes a file or directory. The directory can have contents.
 * If the path does not exist, silently does nothing. Like rm -rf
 * @param filepath path
 */
exports.remove = (filepath) => fs_extra_1.default.removeSync(filepath);
//# sourceMappingURL=fsUtils.js.map