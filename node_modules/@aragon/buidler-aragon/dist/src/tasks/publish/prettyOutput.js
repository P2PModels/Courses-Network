"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishTxOutput = exports.getPrettyPublishTxPreview = void 0;
const chalk_1 = __importDefault(require("chalk"));
const apm_1 = require("~/src/utils/apm");
const appName_1 = require("~/src/utils/appName");
const url_1 = require("~/src/utils/url");
/**
 * Returns a preview sumary of the publish tx with escape codes
 * The resulting string can be directly outputed to stdout
 */
function getPrettyPublishTxPreview({ txData, appName, nextVersion, bump, contractAddress, contentHash, ipfsGateway }) {
    const { registryName } = appName_1.getAppNameParts(appName);
    let action;
    const list = new List();
    switch (txData.methodName) {
        case 'newRepoWithVersion':
            action = `Deploy new repo to registry ${chalk_1.default.green(registryName)}`;
            list.addData('App name', appName);
            list.addData('Initial version', nextVersion);
            list.addData('Manager address', txData.params[1]);
            break;
        case 'newVersion':
            action = `Publish new version ${chalk_1.default.green(nextVersion)} (${bump})`;
            break;
        default:
            throw Error(`Unknown txData methodName ${txData.methodName}`);
    }
    list.addData('Contract address', contractAddress);
    list.addData('ContentURI', contentHash);
    return `
  ${action}

${list.print(2)}

  ${chalk_1.default.cyan(url_1.urlJoin(ipfsGateway, 'ipfs', contentHash))}
`;
}
exports.getPrettyPublishTxPreview = getPrettyPublishTxPreview;
/**
 * Returns a string with formated data about a publish version tx
 */
exports.getPublishTxOutput = {
    dryRun: ({ txData, rootAccount }) => {
        const list = new List();
        list.addData('from', rootAccount);
        list.addData('to', txData.to);
        list.addData('data', apm_1.encodePublishVersionTxData(txData));
        return `
  ${chalk_1.default.black.bgYellow('Dry run')}
  
${list.print(2)}
`;
    },
    /**
     * Display tx hash after broadcasting tx
     */
    txHash: (txHash, etherscanUrl) => {
        const list = new List();
        list.addData('Tx hash', txHash);
        return `
  ${chalk_1.default.black.bgGreen('Tx sent')}

${list.print(2)}
  ${etherscanUrl
            ? `
  ${chalk_1.default.cyan(url_1.urlJoin(etherscanUrl, 'tx', txHash))}
  `
            : ''}`;
    },
    /**
     * Display receipt after transaction is mined
     */
    receipt: (receipt) => {
        const list = new List();
        list.addData('Status', receipt.status ? 'Success' : 'Revert');
        list.addData('Block number', receipt.blockNumber);
        list.addData('Gas used', receipt.gasUsed);
        return `
  ${chalk_1.default.black.bgGreen('Tx mined')}
  
${list.print(2)}
`;
    }
};
/**
 * Utility to convert a list of key values into an equally padded list of string
 */
class List {
    constructor() {
        this.data = [];
    }
    addData(name, value) {
        this.data.push({ name, value });
    }
    print(initialPad = 0) {
        // Note: '1 +' accounts for the ':' added before padEnd
        const maxLenghtName = 1 + Math.max(...this.data.map(item => item.name.length));
        return this.data
            .map(item => `${' '.repeat(initialPad)}${`${item.name}:`.padEnd(maxLenghtName)}  ${chalk_1.default.green(item.value)}`)
            .join('\n');
    }
}
//# sourceMappingURL=prettyOutput.js.map