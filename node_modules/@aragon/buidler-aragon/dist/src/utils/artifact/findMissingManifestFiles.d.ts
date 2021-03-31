import { AragonManifest } from '~/src/types';
interface MissingFile {
    path: string;
    id: string;
    required: boolean;
}
/**
 * Verifies that all files declared in the manifest exist in the distPath
 * Run this verification AFTER building the app front-end
 * Returns JSON data so the consumer can choose to show a warning or throw
 * @param manifest
 * @param distPath
 */
export declare function findMissingManifestFiles(manifest: AragonManifest, distPath: string, hasFrontend: boolean): MissingFile[];
export {};
//# sourceMappingURL=findMissingManifestFiles.d.ts.map