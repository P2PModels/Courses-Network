"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const bumps = ['patch', 'minor', 'major'];
/**
 * Parse and validate a string that may be a semver bump or version
 * given a previous version returns the bump type and next version
 * or throws an error if the combination is not valid
 * For first releases, set prevVersion to undefined
 * @param bumpOrVersion
 * @param prevVersion
 */
function parseAndValidateBumpOrVersion(bumpOrVersion, prevVersion = '0.0.0') {
    if (!semver_1.default.valid(prevVersion))
        throw Error('Previous version must be valid');
    if (bumps.includes(bumpOrVersion)) {
        // case bumpOrVersion = bump
        const bump = bumpOrVersion;
        const nextVersion = semver_1.default.inc(prevVersion, bump);
        if (!nextVersion)
            throw Error(`Invalid bump ${bump}`);
        return {
            bump,
            nextVersion
        };
    }
    else if (semver_1.default.valid(bumpOrVersion)) {
        // case bumpOrVersion = version
        const nextVersion = bumpOrVersion;
        // Make sure nextVersion is clean, forbid "v0.2.0-beta.1"
        if (!isSemverClean(nextVersion))
            throw Error(`next version must be a simple semver: ${nextVersion}`);
        // No need to call the APM Repo smart contract isValidBump function
        // since it does exactly the same logic as below
        for (const bump of bumps)
            if (semver_1.default.inc(prevVersion, bump) === nextVersion)
                return {
                    bump,
                    nextVersion
                };
        throw Error(`Invalid bump from ${prevVersion} to ${nextVersion}`);
    }
    else {
        // invalid case
        throw Error(`Must provide a valid bump or valid semantic version: ${bumpOrVersion}`);
    }
}
exports.default = parseAndValidateBumpOrVersion;
/**
 * Return true if version is a simple semver: "0.2.0"
 * Versions: "v0.2.0", "0.2.0-beta.1", "0.2.0.1" will return false
 * @param version
 */
function isSemverClean(version) {
    const coercedSemver = semver_1.default.coerce(version);
    return Boolean(coercedSemver && coercedSemver.version === version);
}
//# sourceMappingURL=parseAndValidateBumpOrVersion.js.map