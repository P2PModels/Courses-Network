import { ForegroundColor } from 'chalk';
export declare function _prependTag(lines: string, tag: string, color?: typeof ForegroundColor): string;
export declare function logMain(data: string): void;
export declare function logFront(data: string): void;
export declare function logBack(data: string): void;
export declare const logHook: (tag: string) => (data: string) => void;
//# sourceMappingURL=logger.d.ts.map