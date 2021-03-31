"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsconfig_json_1 = require("./tsconfig.json");
const tsconfig_paths_1 = require("tsconfig-paths");
const path_1 = require("path");
const baseUrl = path_1.join(__dirname, './');
tsconfig_paths_1.register({
    baseUrl,
    paths: tsconfig_json_1.compilerOptions.paths
});
//# sourceMappingURL=bootstrap-paths.js.map