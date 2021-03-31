"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAppName = exports.getMainContractName = exports.getMainContractPath = exports.readArappIfExists = exports.readArapp = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const plugins_1 = require("@nomiclabs/buidler/plugins");
const fsUtils_1 = require("./fsUtils");
const arappPath = 'arapp.json';
const contractsPath = './contracts';
/**
 * Reads and parses an arapp.json file.
 * @return AragonAppJson
 */
function readArapp() {
    if (!fsUtils_1.pathExists(arappPath))
        throw new plugins_1.BuidlerPluginError(`No ${arappPath} found in current working directory\n ${process.cwd()}`);
    return fsUtils_1.readJson(arappPath);
}
exports.readArapp = readArapp;
/**
 * Reads and parses an arapp.json file only if exists
 * otherwise returns undefined
 */
function readArappIfExists() {
    return fsUtils_1.readJsonIfExists(arappPath);
}
exports.readArappIfExists = readArappIfExists;
/**
 * Returns main contract path.
 * @return "./contracts/Counter.sol"
 */
function getMainContractPath() {
    // Read the path from arapp.json.
    const arapp = readArappIfExists();
    if (arapp)
        return arapp.path;
    // Try to guess contract path.
    if (fs.existsSync(contractsPath)) {
        const contracts = fs.readdirSync(contractsPath);
        const candidates = contracts.filter(name => name.endsWith('.sol') || name !== 'Imports.sol');
        if (candidates.length === 1) {
            return path.join(contractsPath, candidates[0]);
        }
    }
    throw Error(`Unable to find main contract path.`);
}
exports.getMainContractPath = getMainContractPath;
/**
 * Returns main contract name.
 * @return "Counter"
 */
function getMainContractName() {
    const mainContractPath = getMainContractPath();
    return path.parse(mainContractPath).name;
}
exports.getMainContractName = getMainContractName;
/**
 * Parse the appName from arapp.json in a flexible manner
 * @param arapp
 * @param network
 */
function parseAppName(arapp, network) {
    if (!arapp.appName && !arapp.environments)
        throw new plugins_1.BuidlerPluginError(`No appName configured. 
Add an 'appName' property in your arapp.json with your app's ENS name`);
    // Aggreate app names from environments
    const appNameByNetwork = {};
    for (const [_network, env] of Object.entries(arapp.environments)) {
        if (env.appName)
            appNameByNetwork[_network] = env.appName;
    }
    // If there an appName for that network return it
    if (network && appNameByNetwork[network])
        return appNameByNetwork[network];
    // If there's a default appName return it
    if (arapp.appName) {
        return arapp.appName;
    }
    else {
        // Otherwise, try to guess the appName
        // Pre-compute booleans to make logic below readable
        const appNamesArr = Object.values(appNameByNetwork);
        const thereAreNames = appNamesArr.length > 0;
        const allNamesAreEqual = appNamesArr.every(name => name === appNamesArr[0]);
        if (thereAreNames && allNamesAreEqual)
            return appNamesArr[0];
        // If no guess was possible ask the user to provide it
        const networkId = network || 'development'; // Don't print "undefined" for development
        throw new plugins_1.BuidlerPluginError(`No appName configured for network ${networkId}. 
Add an 'appName' property in the environment of ${networkId} with your app's 
ENS name in your arapp.json. If your app's name is the name accross networks,
Add an 'appName' property in your arapp.json with your app's ENS name`);
    }
}
exports.parseAppName = parseAppName;
//# sourceMappingURL=arappUtils.js.map