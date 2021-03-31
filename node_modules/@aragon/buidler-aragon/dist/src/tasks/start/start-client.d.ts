import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
/**
 * Retrieves the Aragon client using git, builds it, builds the app's frontend and serves the build.
 * Starts the Aragon client pointed at a Dao and an app, and watches for changes on the app's sources.
 */
export declare function startClient(bre: BuidlerRuntimeEnvironment, daoAddress: string, appAddress: string, openBrowser: boolean): Promise<{
    /**
     * Closes open file watchers and file servers
     */
    close: () => void;
}>;
//# sourceMappingURL=start-client.d.ts.map