"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrlSafe = exports.urlJoin = void 0;
/**
 * Joins multiple url parts safely
 * - Does not break the protocol double slash //
 * - Cleans double slashes at any point
 * @param args ("http://ipfs.io", "ipfs", "Qm")
 * @return "http://ipfs.io/ipfs/Qm"
 */
function urlJoin(...args) {
    return args.join('/').replace(/([^:]\/)\/+/g, '$1');
}
exports.urlJoin = urlJoin;
/**
 * Wrapps the URL module and accepts urls without a protocol
 * assumes HTTP
 * @param url
 */
function parseUrlSafe(url) {
    try {
        return new URL(url);
    }
    catch (e) {
        if (!url.includes('://')) {
            return new URL('http://' + url);
        }
        throw e;
    }
}
exports.parseUrlSafe = parseUrlSafe;
//# sourceMappingURL=url.js.map