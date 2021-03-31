"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namehash = void 0;
const ethers_1 = require("ethers");
/**
 * Returns the ENS namehash of a domain
 * @param name
 */
exports.namehash = (name) => ethers_1.ethers.utils.namehash(name);
//# sourceMappingURL=namehash.js.map