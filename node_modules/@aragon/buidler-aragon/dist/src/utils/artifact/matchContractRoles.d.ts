import { Role } from '~/src/types';
import { AragonContractFunction } from '~/src/utils/ast';
interface RoleMatchError {
    id: string;
    message: string;
}
/**
 * Verifies that the roles used in the contract match the ones
 * defined in a roles array, from arapp.json.
 * Returns JSON data so the consumer can choose to show a warning or throw
 * @param functions
 * @param roles
 */
export declare function matchContractRoles(functions: AragonContractFunction[], roles: Role[]): RoleMatchError[];
export {};
//# sourceMappingURL=matchContractRoles.d.ts.map