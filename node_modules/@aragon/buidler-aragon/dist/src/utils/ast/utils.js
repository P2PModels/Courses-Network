"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceFunctionSignature = void 0;
const ethers_1 = require("ethers");
/**
 * Returns corrected function signatures
 * @param sig
 */
function coerceFunctionSignature(sig) {
    const int = new ethers_1.ethers.utils.Interface([sig]);
    return ethers_1.ethers.utils.formatSignature(int.abi[0]);
}
exports.coerceFunctionSignature = coerceFunctionSignature;
//# sourceMappingURL=utils.js.map