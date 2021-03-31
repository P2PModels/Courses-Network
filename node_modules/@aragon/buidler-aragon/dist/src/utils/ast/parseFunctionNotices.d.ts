/**
 * Extracts relevant function information from their source code
 * Only returns functions that are state modifying
 * @param sourceCode Full solidity source code
 * @return [{
 *   signature: "baz(uint32,bool)",
 *   notice: "Sample radspec documentation..."
 * }, ... ]
 */
export declare function parseFunctionsNotices(sourceCode: string): {
    /**
     * signature: "baz(uint32,bool)"
     */
    signature: string;
    /**
     * notice: "Sample radspec documentation..."
     */
    notice: string;
}[];
//# sourceMappingURL=parseFunctionNotices.d.ts.map