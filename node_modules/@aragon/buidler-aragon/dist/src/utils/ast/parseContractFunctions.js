"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContractFunctions = void 0;
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const parser = __importStar(require("@solidity-parser/parser"));
const parseFunctionNotices_1 = require("./parseFunctionNotices");
const utils_1 = require("./utils");
/**
 * Helper to parse the role name from a modifier node
 * Using an isolated function to use a switch / return structure
 * @param node
 * @return "CREATE_PAYMENTS_ROLE"
 */
function parseRoleIdFromNode(node) {
    const [roleIdArg] = node.arguments || [];
    switch (roleIdArg.type) {
        case 'Identifier':
            // Common usage with a pre-defined variable
            // CREATE_PAYMENTS_ROLE = keccak256('CREATE_PAYMENTS_ROLE');
            // auth(CREATE_PAYMENTS_ROLE);
            return roleIdArg.name;
        default:
            // Unknown parsing state
            return '';
    }
}
/**
 * Helper to parse the role param count from a modifier node
 * Using an isolated function to use a switch / return structure
 * @param node
 */
function parseRoleParamCountFromNode(node, authHelperFunctions) {
    const [, paramsArg] = node.arguments || [];
    if (!paramsArg)
        return 0;
    if (paramsArg.type === 'FunctionCall' &&
        paramsArg.expression.type === 'Identifier' &&
        authHelperFunctions.has(paramsArg.expression.name)) {
        // Argument is an valid auth helper function that returns uint256[]
        // so its arguments can be considered for the role param count
        return paramsArg.arguments.length;
    }
    // Unknown parsing state
    return 0;
}
/**
 * Parse the function signature from a node to latter match it with
 * it ABI, as it's necessary for artifact.json's .functions property
 * @param node
 */
function parseFunctionSignatureFromNode(node) {
    const paramTypes = node.parameters.map(
    /**
     * Helper to parse the paramType of an argument to guess the signature
     * Using an isolated function to use a switch / return structure
     */
    (nodeParam) => {
        switch (nodeParam.typeName.type) {
            case 'ElementaryTypeName':
                return nodeParam.typeName.name;
            case 'ArrayTypeName':
                // eslint-disable-next-line no-case-declarations
                const { baseTypeName, length } = nodeParam.typeName;
                if (baseTypeName.type === 'ElementaryTypeName') {
                    if (length && length.type === 'NumberLiteral') {
                        // Known length uint[3]
                        return `${baseTypeName.name}[${length.number}]`;
                    }
                    else if (!length) {
                        // Unknown length uint[]
                        return `${baseTypeName.name}[]`;
                    }
                    else {
                        return '';
                    }
                }
                return '';
            case 'UserDefinedTypeName':
                return 'address';
        }
        return 'address';
    });
    // Don't return "fallback()" for the fallback function
    return node.name
        ? utils_1.coerceFunctionSignature(`${node.name}(${paramTypes.join(',')})`)
        : 'fallback';
}
/**
 * Parses relevant function and roles information from a contract's solidity
 * source code. Returns:
 * - All external / public state modifying functions and their roles
 * - Guesses the param count of the roles, if a normal syntax if used
 *
 * Roles are expected to be used with these two modifiers exclusively
 * - modifier auth(bytes32 _role)
 * - modifier authP(bytes32 _role, uint256[] _params)
 *
 * @param sourceCode Solidity flatten source code
 * @param targetContract "Counter" | "contract/Counter.sol"
 * @param options
 * - onlyTargetContract Only include functions from the target contract
 */
function parseContractFunctions(sourceCode, targetContract, options) {
    const { onlyTargetContract } = options || {};
    const targetContractName = path_1.default.parse(targetContract).name;
    const ast = parser.parse(sourceCode, {});
    const functions = [];
    const authHelperFunctions = new Set();
    const parsedContract = new Set();
    // Aggregate valid auth helper functions first to help count
    // the role params in a safer and more flexible way
    parser.visit(ast, {
        FunctionDefinition: node => {
            if (node.name &&
                node.visibility === 'internal' &&
                node.stateMutability === 'pure' &&
                node.returnParameters &&
                node.returnParameters.length === 1) {
                const returnParam = node.returnParameters[0];
                if (returnParam.typeName.type === 'ArrayTypeName' &&
                    returnParam.typeName.baseTypeName.type === 'ElementaryTypeName' &&
                    returnParam.typeName.baseTypeName.name === 'uint256')
                    authHelperFunctions.add(node.name);
            }
        }
    });
    // Parse contract definitions in the first ast node which should be a SourceUnit
    if (ast.type !== 'SourceUnit')
        throw Error('First block is not of expected type SourceUnit');
    // Aggregate all contracts for recursively parsing bases below
    const contracts = ast.children.filter(node => node.type === 'ContractDefinition' && node.kind === 'contract');
    function parseContract(node) {
        // Parse functions
        for (const subNode of node.subNodes) {
            if (subNode.type === 'FunctionDefinition' &&
                // Ignore constructors
                !subNode.isConstructor &&
                // Only consider functions that modify state and are public / external
                subNode.visibility !== 'internal' &&
                subNode.visibility !== 'private' &&
                subNode.stateMutability !== 'view' &&
                subNode.stateMutability !== 'pure' &&
                subNode.stateMutability !== 'constant') {
                // Check the modifiers
                functions.push({
                    name: subNode.name || '',
                    notice: '',
                    // Parse parameters for signature, some functions may be overloaded
                    sig: parseFunctionSignatureFromNode(subNode),
                    // Parse the auth modifiers
                    roles: subNode.modifiers
                        .filter(modNode => ['auth', 'authP'].includes(modNode.name))
                        .map(authModNode => ({
                        id: parseRoleIdFromNode(authModNode),
                        paramCount: parseRoleParamCountFromNode(authModNode, authHelperFunctions)
                    }))
                });
            }
        }
        // Parse base contracts
        for (const baseContract of node.baseContracts) {
            const baseName = baseContract.baseName.namePath;
            // Protect against infinite loops with a Set
            if (baseName && !parsedContract.has(baseName)) {
                parsedContract.add(node.name);
                const contract = contracts.find(node => node.name === baseName);
                if (contract && !onlyTargetContract)
                    parseContract(contract);
            }
        }
    }
    // Start the parsing from the target contract find by "contractName"
    // or if not found, start with the last contract which in
    // flatten source should be the target contract
    parseContract((targetContractName &&
        contracts.find(node => node.name === targetContractName)) ||
        contracts[contracts.length - 1]);
    // # Pending: Curent @solidity-parser/parser version does not parse notices
    // which are parsed here separately using regex against the source string
    // Functions are mapped with each other on a best effort using their
    // guessed signature, which may be wrong if complex syntax is used
    const notices = parseFunctionNotices_1.parseFunctionsNotices(sourceCode);
    const noticesBySignature = lodash_1.keyBy(notices, n => n.signature);
    for (const fn of functions)
        if (!fn.notice) {
            const extractedNotice = (noticesBySignature[fn.sig] || {}).notice;
            // notice = null if notice not found, '' if empty
            fn.notice = typeof extractedNotice === 'string' ? extractedNotice : null;
        }
    return functions;
}
exports.parseContractFunctions = parseContractFunctions;
//# sourceMappingURL=parseContractFunctions.js.map