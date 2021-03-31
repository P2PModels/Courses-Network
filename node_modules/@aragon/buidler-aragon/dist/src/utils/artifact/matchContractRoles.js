"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchContractRoles = void 0;
const lodash_1 = require("lodash");
/**
 * Verifies that the roles used in the contract match the ones
 * defined in a roles array, from arapp.json.
 * Returns JSON data so the consumer can choose to show a warning or throw
 * @param functions
 * @param roles
 */
function matchContractRoles(functions, roles) {
    const errors = [];
    const addError = (id, message) => {
        errors.push({ id, message });
    };
    const contractRoles = lodash_1.uniqBy(lodash_1.flatten(functions.map(fn => fn.roles)), role => role.id);
    for (const role of roles) {
        const paramCount = (role.params || []).length;
        const contractRole = contractRoles.find(({ id }) => id === role.id);
        if (!contractRole)
            addError(role.id, 'Role not used in contract');
        else if (paramCount !== contractRole.paramCount)
            addError(role.id, `Role has ${paramCount} declared params but contract uses ${contractRole.paramCount}`);
    }
    for (const contractRole of contractRoles) {
        const role = roles.find(({ id }) => id === contractRole.id);
        if (!role)
            addError(contractRole.id, 'Role not declared in arapp');
    }
    return errors;
}
exports.matchContractRoles = matchContractRoles;
//# sourceMappingURL=matchContractRoles.js.map