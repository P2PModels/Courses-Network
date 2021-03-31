"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8ToHex = exports.getContentHash = void 0;
const ethers_1 = require("ethers");
const web3_utils_1 = __importDefault(require("web3-utils"));
/**
 * Returns a CID without and IPFS path
 * @param contentURI "0xab3416a5a43a4351618100011..."
 * @return "QmZ5LL015z..."
 */
exports.getContentHash = (contentURI) => ethers_1.ethers.utils.toUtf8String(contentURI, true).replace('ipfs:', '');
/**
 * Convert UTF8 string to hex with 0x prefix
 * @param utf8
 */
exports.utf8ToHex = (utf8) => web3_utils_1.default.asciiToHex(utf8);
//# sourceMappingURL=utils.js.map