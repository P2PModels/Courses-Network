"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onExit(callback) {
    process.on('exit', callback);
    process.on('SIGINT', callback);
    process.on('SIGUSR1', callback);
    process.on('SIGUSR2', callback);
    process.on('uncaughtException', callback);
    process.on('uncaughtException', callback);
}
exports.default = onExit;
//# sourceMappingURL=onExit.js.map