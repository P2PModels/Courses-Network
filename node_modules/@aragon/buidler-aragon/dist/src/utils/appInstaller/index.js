"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const params_1 = require("~/src/params");
const apm_1 = require("~/src/utils/apm");
const appName_1 = require("~/src/utils/appName");
const getLog_1 = require("~/src/utils/getLog");
const namehash_1 = require("~/src/utils/namehash");
const assertEnsDomain_1 = __importDefault(require("./assertEnsDomain"));
const getAbiFromContentUri_1 = __importDefault(require("./getAbiFromContentUri"));
const getRepoVersion_1 = __importDefault(require("./getRepoVersion"));
const utils_1 = require("./utils");
/**
 * Get an initialized instance of appInstaller
 * @param installerOptions
 * @param bre
 */
/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function AppInstaller(installerOptions, bre) {
    /**
     * @param name "finance"
     */
    return function appInstaller(name, appOptions) {
        return _installExternalApp(Object.assign(Object.assign({ name }, (appOptions || {})), installerOptions), bre);
    };
}
exports.default = AppInstaller;
/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
async function _installExternalApp({ name, version, network = 'homestead', initializeArgs, skipInitialize, apmAddress, dao, ipfsGateway }, bre) {
    const networkConfig = bre.network.config;
    const ethersWeb3Provider = new ethers_1.ethers.providers.Web3Provider(bre.web3.currentProvider, networkConfig.ensAddress && {
        name: bre.network.name,
        chainId: networkConfig.chainId || 8545,
        ensAddress: networkConfig.ensAddress
    });
    const rootAccount = (await bre.web3.eth.getAccounts())[0];
    const fullName = appName_1.getFullAppName(name);
    // We try to resolve ENS name in case of more than one app installation
    const repoAddress = await ethersWeb3Provider.resolveName(fullName);
    // If no repo for the app we publish first version otherwise we fetch previous version
    const { contractAddress, contentUri } = repoAddress
        ? await apm_1.getRepoVersion(fullName, 'latest', ethersWeb3Provider)
        : await _publishApp(network, fullName, rootAccount, version);
    // Install app instance and retrieve proxy address
    const proxyAddress = await dao
        .newAppInstance(namehash_1.namehash(fullName), contractAddress, '0x', false)
        .then(txResponse => getLog_1.getLog(txResponse, 'NewAppProxy', 'proxy'));
    let proxy;
    let acl;
    async function _getProxyInstance() {
        if (!proxy) {
            const appAbi = await getAbiFromContentUri_1.default(contentUri, { ipfsGateway });
            proxy = new bre.web3.eth.Contract(appAbi, proxyAddress);
        }
        return proxy;
    }
    async function _getAclInstance() {
        if (!acl) {
            const aclAddress = await dao.acl();
            const ACL = bre.artifacts.require('ACL');
            acl = await ACL.at(aclAddress);
        }
        return acl;
    }
    async function _publishApp(network, fullName, rootAccount, version) {
        const infuraProvider = new ethers_1.ethers.providers.InfuraProvider(network);
        const etherscanProvider = new ethers_1.ethers.providers.EtherscanProvider(network);
        // Fetch version from external network
        const versionData = await getRepoVersion_1.default(fullName, version, infuraProvider);
        const { contractAddress, contentURI } = versionData;
        // Fetch the deploy transaction from etherscan
        const history = await etherscanProvider.getHistory(contractAddress, 0);
        const deployTx = history[0];
        const newDeployTx = await bre.web3.eth.sendTransaction({
            from: rootAccount,
            data: deployTx.data
        });
        const newContractAddress = newDeployTx.contractAddress;
        // Todo: construct valid deploy TX from the source code
        // Make sure the contract code is correct before continuing
        const codeNew = await bre.web3.eth.getCode(newContractAddress);
        const codeReal = await infuraProvider.getCode(contractAddress);
        if (codeNew !== codeReal)
            throw Error('Error re-deploying contract code, it is not equal');
        // Create new repo and publish its version
        // Force the client to fetch from this specific ipfsGateway instead of localhost:8080
        const shortName = name.split('.')[0];
        const initialVersionArray = apm_1.toApmVersionArray('1.0.0');
        const contentUriHttpFromPublicGateway = utils_1.utf8ToHex('http:' + apm_1.joinIpfsLocation(ipfsGateway, utils_1.getContentHash(contentURI)));
        const APMRegistry = bre.artifacts.require('APMRegistry');
        const apmRegistry = await APMRegistry.at(apmAddress);
        const repoAddress = await apmRegistry
            .newRepoWithVersion(shortName, rootAccount, initialVersionArray, newContractAddress, contentUriHttpFromPublicGateway)
            .then(txResponse => getLog_1.getLog(txResponse, 'NewRepo', 'repo'));
        // Make sure the resulting repoAddress is accessible from the client
        await assertEnsDomain_1.default(fullName, repoAddress);
        return {
            contractAddress: newContractAddress,
            contentUri: contentURI
        };
    }
    /**
     * Initialize this proxy instance
     */
    async function initialize(_initializeArgs) {
        const _proxy = await _getProxyInstance();
        await _proxy.methods
            .initialize(..._initializeArgs)
            .send({ from: rootAccount });
    }
    /**
     * Assign a permission of this app to an entity
     * @param roleName 'TRANSFER_ROLE'
     * @param entity "0x615..." if unspecified defaults to ANY_ADDRESS
     */
    async function createPermission(roleName, entity = params_1.ANY_ADDRESS) {
        const _proxy = await _getProxyInstance();
        const _acl = await _getAclInstance();
        const roleId = await _proxy.methods[roleName]().call();
        await _acl.createPermission(entity, proxyAddress, roleId, rootAccount, {
            from: rootAccount
        });
    }
    if (!skipInitialize) {
        await initialize(initializeArgs || []);
    }
    return {
        initialize,
        createPermission,
        address: proxyAddress
    };
}
//# sourceMappingURL=index.js.map