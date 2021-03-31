"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPossibleGatewayUrls = exports.guessGatewayUrl = void 0;
const lodash_1 = require("lodash");
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("~/src/utils/url");
/**
 * Returns a URL that may have a given content hash already available
 * Use after publish to guess at which gateway URL the recently uploaded
 * content is already available
 *
 * Possible gateway routes given a URL exposing an IPFS node are
 * - mynode.io/ipfs/Qm...
 * - mynode.io:8080/ipfs/Qm...
 * - mynode.io:5001/ipfs/Qm...
 */
async function guessGatewayUrl({ ipfsApiUrl, contentHash, ipfsGateway }) {
    const urls = getPossibleGatewayUrls({ ipfsApiUrl, ipfsGateway });
    try {
        return await oneSuccess(urls.map(async (url) => {
            const testUrl = url_1.urlJoin(url, 'ipfs', contentHash);
            const res = await node_fetch_1.default(testUrl, { timeout: 3000 });
            // node-fetch does not throw on error status codes
            if (!res.ok)
                throw Error(`Not ok ${res.statusText}`);
            await res.text();
            // If the request succeeds, return the url to be used as gateway
            return url;
        }));
    }
    catch (e) {
        // No Gateway URL works
        return null;
    }
}
exports.guessGatewayUrl = guessGatewayUrl;
/**
 * Aggregate a list of possible available gateway URLs given an API url and gateway
 * - Some gateways are exposed in port 80 or 8080
 * - The IPFS API has a gateway route, but it is closed in Infura's for example
 * @return possibleGatewayUrls = [
 *   'http://mynode.io/',
 *   'http://mynode.io:5001/',
 *   'http://mynode.io:6001/',
 *   'http://mynode.io:8080/',
 *   'https://ipfs.io'
 * ]
 */
function getPossibleGatewayUrls({ ipfsApiUrl, ipfsGateway }) {
    const possibleUrls = [];
    const ipfsApiUrlParsed = url_1.parseUrlSafe(ipfsApiUrl);
    // Add after parsing to ensure same formating
    possibleUrls.push(ipfsApiUrlParsed.toString());
    for (const port of ['', '5001', '8080']) {
        ipfsApiUrlParsed.port = port;
        possibleUrls.push(ipfsApiUrlParsed.toString());
    }
    if (ipfsGateway)
        possibleUrls.push(ipfsGateway);
    return lodash_1.uniq(possibleUrls).sort();
}
exports.getPossibleGatewayUrls = getPossibleGatewayUrls;
/**
 * From https://stackoverflow.com/questions/37234191/how-do-you-implement-a-racetosuccess-helper-given-a-list-of-promises
 * @param promises
 */
function oneSuccess(promises) {
    return Promise.all(promises.map(async (p) => {
        // If a request fails, count that as a resolution so it will keep
        // waiting for other possible successes. If a request succeeds,
        // treat it as a rejection so Promise.all immediately bails out.
        return p.then(val => Promise.reject(val), err => Promise.resolve(err));
    })).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors), 
    // If '.all' rejected, we've got the result we wanted.
    val => Promise.resolve(val));
}
//# sourceMappingURL=guessGatewayUrl.js.map