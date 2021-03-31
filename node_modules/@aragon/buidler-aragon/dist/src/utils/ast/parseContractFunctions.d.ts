import { AragonContractFunction } from './types';
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
export declare function parseContractFunctions(sourceCode: string, targetContract: string, options?: {
    onlyTargetContract?: boolean;
}): AragonContractFunction[];
//# sourceMappingURL=parseContractFunctions.d.ts.map