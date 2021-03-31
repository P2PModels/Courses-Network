"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRepoContentUriFile = exports.resolveRepoContentUri = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("~/src/utils/url");
const utils_1 = require("./utils");
/**
 * Resolve an Aragon app contentUri and return its manifest and artifact
 * @param contentUri "ipfs:Qm..."
 * @param options
 * - ipfsGateway: 'http://localhost:8080' | 'https://my-remote-ipfs.io'
 */
async function resolveRepoContentUri(contentUri, options) {
    const url = utils_1.contentUriToFetchUrl(utils_1.toUtf8IfHex(contentUri), options);
    const [manifest, artifact] = await Promise.all([
        _fetchJson(url_1.urlJoin(url, 'manifest.json')),
        _fetchJson(url_1.urlJoin(url, 'artifact.json'))
    ]);
    return { manifest, artifact };
}
exports.resolveRepoContentUri = resolveRepoContentUri;
/**
 * Resolve an Aragon app contentUri and return a single file given it's path
 * @param contentUri "ipfs:Qm..."
 * @param filepath "code.sol"
 * @param options
 * - ipfsGateway: 'http://localhost:8080' | 'https://my-remote-ipfs.io'
 */
async function resolveRepoContentUriFile(contentUri, filepath, options) {
    const url = utils_1.contentUriToFetchUrl(utils_1.toUtf8IfHex(contentUri), options);
    return await _fetchText(url_1.urlJoin(url, filepath));
}
exports.resolveRepoContentUriFile = resolveRepoContentUriFile;
/**
 * Fetch and parse JSON from an HTTP(s) URL
 * @param url
 */
async function _fetchJson(url) {
    return node_fetch_1.default(url).then(res => res.json());
}
async function _fetchText(url) {
    return node_fetch_1.default(url).then(res => res.text());
}
//# sourceMappingURL=resolveContent.js.map