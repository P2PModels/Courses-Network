export declare function installAragonClientIfNeeded(repo?: string, version?: string): Promise<string>;
/**
 * Prepares and starts the aragon client
 * @return The URL at which the client is available
 */
export declare function startAragonClient(clientServePort: number, subPath?: string, autoOpen?: boolean): Promise<{
    url: string;
    close: () => void;
}>;
/**
 * Triggers a complete client refresh (not just the iFrame) by making a dummy
 * change to the client files being served.
 * Works in tandem with live-server, which is watching for changes
 * in the client files and is in charge of triggering the actual
 * page reload.
 */
export declare function refreshClient(version?: string): Promise<void>;
/**
 * Creates a static files HTTP server
 * Resolves when the server starts to listen
 * @param port 3000
 * @param rootPath Dir to serve files from
 */
export declare function _createStaticWebserver(port: number, root?: string): () => void;
//# sourceMappingURL=aragon-client.d.ts.map