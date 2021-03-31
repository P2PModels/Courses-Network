"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnsName = void 0;
function validateEnsName(ensName) {
    let isValid = true;
    const comps = ensName.split('.');
    const name = comps[0];
    const domain = comps[1];
    const ext = comps[2];
    // Enforces ens names in the form <name>.aragonpm.eth.
    isValid = comps.length !== 3 ? false : isValid;
    isValid = name.toLowerCase() !== name ? false : isValid;
    isValid = domain !== 'aragonpm' ? false : isValid;
    isValid = ext !== 'eth' ? false : isValid;
    return isValid;
}
exports.validateEnsName = validateEnsName;
//# sourceMappingURL=validateEnsName.js.map