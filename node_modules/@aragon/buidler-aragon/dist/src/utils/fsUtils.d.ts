/**
 * tests whether or not the given path exists by checking with the file system.
 * @param filepath path
 */
export declare const pathExists: (filepath: string) => boolean;
/**
 * Read file contents as a string (UTF-8)
 * @param filepath path
 */
export declare const readFile: (filepath: string) => string;
/**
 * Read file contents as string or if the path doesn't exists returns undefined
 * @param filepath path
 */
export declare const readFileIfExists: (filepath: string) => string | undefined;
/**
 * Write string data to file
 * @param filepath
 */
export declare const writeFile: (filepath: string, data: string) => void;
/**
 * Read file contents as JSON
 * @param filepath path
 */
export declare const readJson: <T>(filepath: string) => T;
/**
 * Read file contents as JSON or if the path doesn't exists returns undefined
 * @param filepath path
 */
export declare const readJsonIfExists: <T>(filepath: string) => T | undefined;
/**
 * Write JSON data to file
 * @param filepath path
 * @param data
 */
export declare const writeJson: <T>(filepath: string, data: T) => void;
/**
 * If given path does not exists, creates a directory recursively
 * @param filepath path
 */
export declare const ensureDir: (filepath: string) => void;
/**
 * Removes a file or directory. The directory can have contents.
 * If the path does not exist, silently does nothing. Like rm -rf
 * @param filepath path
 */
export declare const remove: (filepath: string) => void;
//# sourceMappingURL=fsUtils.d.ts.map