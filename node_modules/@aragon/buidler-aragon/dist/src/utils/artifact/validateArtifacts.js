"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArtifacts = void 0;
const path_1 = __importDefault(require("path"));
const plugins_1 = require("@nomiclabs/buidler/plugins");
const params_1 = require("~/src/params");
const ast_1 = require("~/src/utils/ast");
const fsUtils_1 = require("~/src/utils/fsUtils");
const findMissingManifestFiles_1 = require("./findMissingManifestFiles");
const matchContractRoles_1 = require("./matchContractRoles");
/**
 * Validates a release directory. Throws if there are issues
 * - Make sure contract roles match arapp.json roles
 * - Make sure filepaths in the manifest exist
 */
function validateArtifacts(distPath, hasFrontend) {
    // Load files straight from the dist directory
    const artifact = fsUtils_1.readJson(path_1.default.join(distPath, params_1.artifactName));
    const manifest = fsUtils_1.readJson(path_1.default.join(distPath, params_1.manifestName));
    const flatCode = fsUtils_1.readFile(path_1.default.join(distPath, params_1.flatCodeName));
    const functions = ast_1.parseContractFunctions(flatCode, artifact.path);
    // Make sure all declared files in the manifest are there
    const missingFiles = findMissingManifestFiles_1.findMissingManifestFiles(manifest, distPath, hasFrontend);
    if (missingFiles.length)
        throw new plugins_1.BuidlerPluginError(`
Some files declared in manifest.json are not found in dist dir: ${distPath}
${missingFiles.map(file => ` - ${file.id}: ${file.path}`).join('\n')}
      
Make sure your app build process includes them in the dist directory on
every run of the designated NPM build script.

If you are sure you want to publish anyway, use the flag "--skip-validation".
`);
    // Make sure that the roles in the contract match the ones in arapp.json
    const roleMatchErrors = matchContractRoles_1.matchContractRoles(functions, artifact.roles);
    if (roleMatchErrors.length)
        throw new plugins_1.BuidlerPluginError(`
Some contract roles do not match declared roles in ${params_1.arappName}:
${roleMatchErrors.map(err => ` - ${err.id}: ${err.message}`).join('\n')}

If you are sure you want to publish anyway, use the flag "--skip-validation".
`);
}
exports.validateArtifacts = validateArtifacts;
//# sourceMappingURL=validateArtifacts.js.map