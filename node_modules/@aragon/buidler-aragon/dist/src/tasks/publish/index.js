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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPublishTask = void 0;
const ethers_1 = require("ethers");
const execa_1 = __importDefault(require("execa"));
const config_1 = require("@nomiclabs/buidler/config");
const plugins_1 = require("@nomiclabs/buidler/plugins");
const params_1 = require("~/src/params");
const task_names_1 = require("~/src/tasks/task-names");
const logger_1 = require("~/src/ui/logger");
const apm = __importStar(require("~/src/utils/apm"));
const accounts_1 = require("~/src/utils/accounts");
const appName_1 = require("~/src/utils/appName");
const arappUtils_1 = require("~/src/utils/arappUtils");
const artifact_1 = require("~/src/utils/artifact");
const ipfs_1 = require("~/src/utils/ipfs");
const createIgnorePatternFromFiles_1 = __importDefault(require("./createIgnorePatternFromFiles"));
const parseAndValidateBumpOrVersion_1 = __importDefault(require("./parseAndValidateBumpOrVersion"));
const prettyOutput_1 = require("./prettyOutput");
/**
 * Sets up the publish task
 * Note: Tasks must be setup in a function. If task() is run in the
 * module body on test teardown, they will not be setup again
 */
function setupPublishTask() {
    config_1.task(task_names_1.TASK_PUBLISH, 'Publish a new app version')
        .addPositionalParam('bump', 'Type of bump (major, minor or patch) or semantic version', undefined, config_1.types.string)
        .addOptionalParam('contract', 'Contract address previously deployed.', undefined, config_1.types.string)
        .addOptionalParam('managerAddress', 'Owner of the APM repo. Must be provided in the initial release', undefined, config_1.types.string)
        .addOptionalParam('ipfsApiUrl', 'IPFS API URL to connect to an ipfs daemon API server', 'http://localhost:5001', config_1.types.string)
        .addFlag('onlyContent', 'Prevents contract compilation, deployment and artifact generation.')
        .addFlag('verify', 'Automatically verify contract on Etherscan.')
        .addFlag('skipValidation', 'Skip validation of artifacts files.')
        .addFlag('dryRun', 'Output tx data without broadcasting')
        .setAction(async (params, bre) => {
        // Do param type verification here and call publishTask with clean params
        return await publishTask({
            bumpOrVersion: params.bump,
            existingContractAddress: params.contract,
            managerAddress: params.managerAddress,
            ipfsApiUrl: params.ipfsApiUrl,
            onlyContent: params.onlyContent,
            verify: params.verify,
            skipValidation: params.skipValidation,
            dryRun: params.dryRun
        }, bre);
    });
}
exports.setupPublishTask = setupPublishTask;
async function publishTask({ bumpOrVersion, existingContractAddress, managerAddress, ipfsApiUrl: ipfsApiUrlArg, onlyContent, verify, skipValidation, dryRun }, bre) {
    const aragonConfig = bre.config.aragon;
    const appSrcPath = aragonConfig.appSrcPath;
    const distPath = aragonConfig.appBuildOutputPath;
    const ignoreFilesPath = aragonConfig.ignoreFilesPath;
    const selectedNetwork = bre.network.name;
    const ipfsApiUrl = ipfsApiUrlArg || (bre.config.aragon || {}).ipfsApi;
    const hasEtherscanKey = bre.config.etherscan && Boolean(bre.config.etherscan.apiKey);
    // TODO: Warn the user their metadata files (e.g. appName) are not correct.
    const arapp = arappUtils_1.readArapp();
    const appName = arappUtils_1.parseAppName(arapp, selectedNetwork);
    const contractName = arappUtils_1.getMainContractName();
    const rootAccount = await accounts_1.getRootAccount(bre);
    // Initialize clients
    const networkConfig = bre.network.config;
    const provider = new ethers_1.ethers.providers.Web3Provider(bre.web3.currentProvider, networkConfig.ensAddress && {
        name: bre.network.name,
        chainId: networkConfig.chainId || 5555,
        ensAddress: networkConfig.ensAddress
    });
    const prevVersion = await _getLastestVersionIfExists(appName, provider);
    const { bump, nextVersion } = parseAndValidateBumpOrVersion_1.default(bumpOrVersion, prevVersion ? prevVersion.version : undefined);
    logger_1.logMain(`Applying version bump ${bump}, next version: ${nextVersion}`);
    // Do sanity checks before compiling the contract or uploading files
    // So users do not have to wait a long time before seeing the config is not okay
    if (!rootAccount)
        throw new plugins_1.BuidlerPluginError(`No account configured. Provide a mnemonic or private key for ${selectedNetwork} in the buidler.config.json. For more information check: https://buidler.dev/config/#json-rpc-based-networks`);
    if (verify && !hasEtherscanKey)
        throw new plugins_1.BuidlerPluginError(`To verify your contracts using Etherscan you need an API Key configure in buidler.config.json. Get one at: https://etherscan.io/apis`);
    await apm.assertCanPublish(appName, rootAccount, provider);
    if (!ipfsApiUrl)
        throw new plugins_1.BuidlerPluginError(`No IPFS API url configured. Add 'aragon.ipfsApiUrl' to your buidler.config with
a valid IPFS API url that you have permissions to upload and persist content to.
Example values:

    http://your-remote-node.io:5001
    https://ipfs.infura.io

Note: if you are releasing this app in production, you are responsible for pinning
the app's content and making sure it's available to users.

If you want to quickly test an app release and you are not concerned about persistance,
you may use a public IPFS API such as

    https://ipfs.infura.io
`);
    await ipfs_1.assertIpfsApiIsAvailable(ipfsApiUrl);
    // Using let + if {} block instead of a ternary operator
    // to assign value and log status to console
    let contractAddress;
    if (onlyContent) {
        contractAddress = params_1.ZERO_ADDRESS;
        logger_1.logMain('No contract used for this version');
    }
    else if (existingContractAddress) {
        contractAddress = existingContractAddress;
        logger_1.logMain(`Using provided contract address: ${contractAddress}`);
    }
    else if (!prevVersion || bump === 'major') {
        logger_1.logMain('Deploying new implementation contract');
        contractAddress = await _deployMainContract(contractName, verify, bre);
        logger_1.logMain(`New implementation contract address: ${contractAddress}`);
    }
    else {
        contractAddress = prevVersion.contractAddress;
        logger_1.logMain(`Reusing previous version contract address: ${contractAddress}`);
    }
    if (appSrcPath) {
        logger_1.logMain(`Running app build script`);
        await execa_1.default('npm', ['run', 'build'], { cwd: appSrcPath });
    }
    // Generate and validate Aragon artifacts, release files
    logger_1.logMain(`Generating Aragon app artifacts`);
    await artifact_1.generateArtifacts(distPath, bre);
    const hasFrontend = appSrcPath ? true : false;
    if (!skipValidation)
        artifact_1.validateArtifacts(distPath, hasFrontend);
    // Upload release directory to IPFS
    logger_1.logMain('Uploading release assets to IPFS...');
    const contentHash = await ipfs_1.uploadDirToIpfs({
        dirPath: distPath,
        ipfsApiUrl,
        ignore: createIgnorePatternFromFiles_1.default(ignoreFilesPath)
    });
    logger_1.logMain(`Release assets uploaded to IPFS: ${contentHash}`);
    // Generate tx to publish new app to aragonPM
    const versionInfo = {
        version: nextVersion,
        contractAddress,
        contentUri: apm.toContentUri('ipfs', contentHash)
    };
    const network = await provider.getNetwork();
    if (!managerAddress)
        managerAddress = rootAccount;
    const txData = await apm.publishVersion(appName, versionInfo, provider, {
        managerAddress
    });
    const ipfsGateway = (bre.config.aragon || {}).ipfsGateway || params_1.defaultIpfsGateway;
    const activeIpfsGateway = await ipfs_1.guessGatewayUrl({
        ipfsApiUrl,
        ipfsGateway,
        contentHash
    });
    logger_1.logMain(prettyOutput_1.getPrettyPublishTxPreview({
        txData,
        appName,
        nextVersion,
        bump,
        contractAddress,
        contentHash,
        ipfsGateway: activeIpfsGateway || ipfsGateway
    }));
    if (dryRun) {
        logger_1.logMain(prettyOutput_1.getPublishTxOutput.dryRun({ txData, rootAccount }));
    }
    else {
        const etherscanTxUrl = params_1.etherscanChainUrls[network.chainId];
        const receipt = await bre.web3.eth
            .sendTransaction({
            from: rootAccount,
            to: txData.to,
            data: apm.encodePublishVersionTxData(txData)
        })
            .on('transactionHash', (hash) => {
            logger_1.logMain(prettyOutput_1.getPublishTxOutput.txHash(hash, etherscanTxUrl));
        });
        logger_1.logMain(prettyOutput_1.getPublishTxOutput.receipt(receipt));
    }
    // For testing
    return txData;
}
/**
 * Returns latest version given a partial or full appName
 * Returns undefined if repo does not exists
 * @param appName "finance" | "finance.aragonpm.eth"
 * @param provider
 */
async function _getLastestVersionIfExists(appName, provider) {
    const fullAppName = appName_1.getFullAppName(appName);
    // Check ENS name first since ethers causes an UnhandledPromiseRejectionWarning
    const repoAddress = await provider.resolveName(fullAppName);
    if (!repoAddress)
        return;
    // Check for latest version but expect errors
    try {
        return await apm.getRepoVersion(repoAddress, 'latest', provider);
    }
    catch (e) {
        throw e;
    }
}
/**
 * Deploys a new implementation contract and returns its address
 * @param contractName
 * @param verify
 * @param bre
 */
async function _deployMainContract(contractName, verify, bre) {
    // Compile contracts
    await bre.run(task_names_1.TASK_COMPILE);
    // Deploy contract
    const MainContract = bre.artifacts.require(contractName);
    const mainContract = await MainContract.new();
    logger_1.logMain('Implementation contract deployed');
    const chainId = await _getChainId(bre);
    if (verify && params_1.etherscanSupportedChainIds.has(chainId)) {
        try {
            logger_1.logMain('Verifying on Etherscan');
            await bre.run(task_names_1.TASK_VERIFY_CONTRACT, {
                contractName,
                address: mainContract.address
            });
            logger_1.logMain(`Successfully verified contract on Etherscan`);
        }
        catch (e) {
            logger_1.logMain(`Etherscan verification failed. ${e} `);
        }
    }
    return mainContract.address;
}
/**
 * Isolates logic to fix buidler issue that swaps web3 version when running the tests
 * It potentially loads version 1.2.1 instead of 1.2.6 where web3.eth.getChainId
 * is not a function and causes an error
 */
async function _getChainId(bre) {
    const provider = new ethers_1.ethers.providers.Web3Provider(bre.web3.currentProvider);
    const net = await provider.getNetwork();
    return net.chainId;
}
//# sourceMappingURL=index.js.map