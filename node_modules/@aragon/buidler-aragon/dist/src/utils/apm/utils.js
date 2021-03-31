"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8ToHex = exports.isAddress = exports.toContentUri = exports.contentUriToFetchUrl = exports.joinIpfsLocation = exports.stipIpfsPrefix = exports.toApmVersionArray = exports.parseApmVersionReturn = exports.toUtf8IfHex = void 0;
const ethers_1 = require("ethers");
const semver_1 = __importDefault(require("semver"));
const url_1 = require("~/src/utils/url");
/**
 * Parses hex string if it's a hex string, otherwise returns it
 * @param hex "0xaa6161" | "hello"
 */
function toUtf8IfHex(hex) {
    return ethers_1.ethers.utils.isHexString(hex)
        ? ethers_1.ethers.utils.toUtf8String(hex, true)
        : hex;
}
exports.toUtf8IfHex = toUtf8IfHex;
/**
 * Parse a raw version response from an APM repo
 */
function parseApmVersionReturn(res) {
    return {
        version: res.semanticVersion.join('.'),
        contractAddress: res.contractAddress,
        // toUtf8String(, true) to ignore UTF8 errors parsing and let downstream
        // components identify faulty content URIs
        contentUri: ethers_1.ethers.utils.toUtf8String(res.contentURI, true)
    };
}
exports.parseApmVersionReturn = parseApmVersionReturn;
/**
 * Return a semantic version string into the APM version array format
 * @param version "0.2.4"
 */
function toApmVersionArray(version) {
    const semverObj = semver_1.default.parse(version);
    if (!semverObj)
        throw Error(`Invalid semver ${version}`);
    return [semverObj.major, semverObj.minor, semverObj.patch];
}
exports.toApmVersionArray = toApmVersionArray;
/**
 * Clean an IPFS hash of prefixes and suffixes commonly found
 * in both gateway URLs and content URLs
 * @param ipfsDirtyHash
 */
function stipIpfsPrefix(ipfsDirtyHash) {
    return (ipfsDirtyHash
        // Trim ending /ipfs/ tag
        // "site.io:8080//ipfs//" => "site.io:8080"
        .replace(/\/*ipfs\/*$/, '')
        // Trim starting /ipfs/, ipfs: tag
        // "/ipfs/Qm" => "Qm"
        .replace(/^\/*ipfs[/:]*/, ''));
}
exports.stipIpfsPrefix = stipIpfsPrefix;
/**
 * Returns a joined IPFS location given an IPFS gateway and an IPFS path
 * This util makes sure the url is properly joined, and that it contains
 * the "ipfs" route only once, stripping it from the gateway and the location
 * @param ipfsGateway "https://ipfs.io"
 * @param location "Qmzz"
 * @return "https://ipfs.io/ipfs/Qmzz/artifact.json"
 */
function joinIpfsLocation(ipfsGateway, location) {
    return url_1.urlJoin(stipIpfsPrefix(ipfsGateway), 'ipfs', stipIpfsPrefix(location));
}
exports.joinIpfsLocation = joinIpfsLocation;
/**
 * Return a fetchable URL to get the resources of a contentURI
 * @param contentUri "ipfs:QmaT4Eef..."
 * @param options
 */
function contentUriToFetchUrl(contentUri, options) {
    if (!contentUri)
        throw Error(`contentUri is empty`);
    const [protocol, location] = contentUri.split(/[/:](.+)/);
    switch (protocol) {
        case 'http':
        case 'https':
            if (!location)
                throw Error(`contentUri location not set: ${contentUri}`);
            return location.includes('://') ? location : contentUri;
        case 'ipfs':
            if (!options || !options.ipfsGateway)
                throw Error(`Must provide an ipfsGateway for protocol 'ipfs'`);
            return joinIpfsLocation(options.ipfsGateway, location);
        default:
            throw Error(`Protocol '${protocol}' not supported`);
    }
}
exports.contentUriToFetchUrl = contentUriToFetchUrl;
/**
 * Returns contentURI in Aragon's protocol:location format as hex
 * @param protocol "ipfs"
 * @param location "QmbNG8dVgi363popKyCrojMNj3wRczxjEoSv27J8tvFgwQ"
 */
function toContentUri(protocol, location) {
    if (!protocol)
        throw Error('contentURI protocol must be defined');
    if (!location)
        throw Error('contentURI location must be defined');
    return utf8ToHex([protocol, location].join(':'));
}
exports.toContentUri = toContentUri;
/**
 * Returns true if is an address
 * @param address
 */
function isAddress(address) {
    try {
        ethers_1.ethers.utils.getAddress(address);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isAddress = isAddress;
/**
 * Return hex format of data with 0x prefix
 * @param data
 */
function utf8ToHex(data) {
    return '0x' + Buffer.from(data, 'utf8').toString('hex');
}
exports.utf8ToHex = utf8ToHex;
//# sourceMappingURL=utils.js.map