"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDirToIpfs = void 0;
const ipfs_http_client_1 = __importDefault(require("ipfs-http-client"));
const path_1 = __importDefault(require("path"));
const { globSource } = ipfs_http_client_1.default;
/**
 * Uploads dist folder to IPFS
 * Applies various ignore patterns:
 * - .ipfsignore
 * - .gitignore
 */
async function uploadDirToIpfs({ dirPath, ipfsApiUrl, ignore, progress }) {
    var e_1, _a;
    const ipfs = ipfs_http_client_1.default(ipfsApiUrl);
    const results = [];
    try {
        for (var _b = __asyncValues(ipfs.add(globSource(dirPath, { recursive: true, ignore }), { progress })), _c; _c = await _b.next(), !_c.done;) {
            const entry = _c.value;
            results.push(entry);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Warning! Infura does not allow uploading files with many files
    // - directory with 80 files of 10 bytes fails
    // - directory with 12 files of 46014 bytes fails
    // If that happens the list of results will not contain the last entry
    // with corresponds to the root directory, the hash we need
    const rootName = path_1.default.parse(dirPath).name;
    const rootResult = results.find(r => r.path === rootName);
    if (!rootResult)
        throw Error(`root ${rootName} not found in results: \n${results
            .map(r => r.path)
            .join('\n')}`);
    return rootResult.cid.toString();
}
exports.uploadDirToIpfs = uploadDirToIpfs;
//# sourceMappingURL=uploadDirToIpfs.js.map