"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtifacts = void 0;
const path_1 = __importDefault(require("path"));
const task_names_1 = require("@nomiclabs/buidler/builtin-tasks/task-names");
const params_1 = require("~/src/params");
const arappUtils_1 = require("~/src/utils/arappUtils");
const fsUtils_1 = require("~/src/utils/fsUtils");
const generateAragonArtifact_1 = require("./generateAragonArtifact");
/**
 * Generate and write aragon artifacts to outPath
 * - artifact
 * - manifest
 * - flatCode
 * @param outPath "dist"
 * @param bre
 */
async function generateArtifacts(outPath, bre) {
    const arapp = arappUtils_1.readArapp();
    const appName = arappUtils_1.parseAppName(arapp, bre.network.name);
    const manifest = fsUtils_1.readJson(params_1.manifestName);
    const contractName = arappUtils_1.getMainContractName();
    // buidler will detect and throw for cyclic dependencies
    // any flatten task also compiles
    const flatCode = await bre.run(task_names_1.TASK_FLATTEN_GET_FLATTENED_SOURCE);
    // Get ABI from generated artifacts in compilation
    const abi = _readArtifact(contractName, bre).abi;
    const artifact = generateAragonArtifact_1.generateAragonArtifact(arapp, appName, abi, flatCode, contractName);
    fsUtils_1.ensureDir(outPath);
    fsUtils_1.writeJson(path_1.default.join(outPath, params_1.artifactName), artifact);
    fsUtils_1.writeJson(path_1.default.join(outPath, params_1.manifestName), manifest);
    fsUtils_1.writeFile(path_1.default.join(outPath, params_1.flatCodeName), flatCode);
}
exports.generateArtifacts = generateArtifacts;
/**
 * Internal util to type and encapsulate interacting with artifacts
 * @param contractName "Counter"
 * @param bre
 */
function _readArtifact(contractName, bre) {
    return bre.artifacts.require(contractName);
}
//# sourceMappingURL=generateArtifacts.js.map