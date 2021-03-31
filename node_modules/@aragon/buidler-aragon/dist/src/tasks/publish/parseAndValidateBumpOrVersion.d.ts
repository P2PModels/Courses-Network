declare type SemverBump = 'patch' | 'minor' | 'major';
/**
 * Parse and validate a string that may be a semver bump or version
 * given a previous version returns the bump type and next version
 * or throws an error if the combination is not valid
 * For first releases, set prevVersion to undefined
 * @param bumpOrVersion
 * @param prevVersion
 */
export default function parseAndValidateBumpOrVersion(bumpOrVersion: string, prevVersion?: string): {
    bump: SemverBump;
    nextVersion: string;
};
export {};
//# sourceMappingURL=parseAndValidateBumpOrVersion.d.ts.map