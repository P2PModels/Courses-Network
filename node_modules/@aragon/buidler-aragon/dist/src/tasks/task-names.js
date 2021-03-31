"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_VERIFY_CONTRACT = exports.TASK_PUBLISH = exports.TASK_START = void 0;
// Aragon plugin tasks.
exports.TASK_START = 'start';
exports.TASK_PUBLISH = 'publish';
// Etherscan plugin tasks.
exports.TASK_VERIFY_CONTRACT = 'verify-contract';
// Buidler built-in tasks.
__exportStar(require("@nomiclabs/buidler/builtin-tasks/task-names"), exports);
//# sourceMappingURL=task-names.js.map