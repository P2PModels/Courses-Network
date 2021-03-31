"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHook = exports.logBack = exports.logFront = exports.logMain = exports._prependTag = void 0;
const chalk_1 = __importDefault(require("chalk"));
const mainTag = chalk_1.default.gray('main     | ');
const frontTag = chalk_1.default.yellow('frontend | ');
const backTag = chalk_1.default.blue('backend  | ');
function _prependTag(lines, tag, color) {
    if (color)
        tag = chalk_1.default[color](tag);
    return lines
        .split('\n')
        .map(line => tag + line)
        .join('\n');
}
exports._prependTag = _prependTag;
function logMain(data) {
    // eslint-disable-next-line no-console
    console.log(_prependTag(data, mainTag));
}
exports.logMain = logMain;
function logFront(data) {
    // eslint-disable-next-line no-console
    console.log(_prependTag(data, frontTag));
}
exports.logFront = logFront;
function logBack(data) {
    // eslint-disable-next-line no-console
    console.log(_prependTag(data, backTag));
}
exports.logBack = logBack;
exports.logHook = (tag) => (data) => logBack(_prependTag(data, `${tag} | `, 'blueBright'));
//# sourceMappingURL=logger.js.map