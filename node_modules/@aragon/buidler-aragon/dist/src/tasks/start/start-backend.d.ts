import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
/**
 * Starts the task's backend sub-tasks. Logic is contained in ./tasks/start/utils/backend/.
 * Creates a Dao and a Repo for the app in development and watches for changes in
 * contracts. When contracts change, it compiles the contracts, deploys them and updates the
 * proxy in the Dao.
 * @returns Promise<{ daoAddress: string, appAddress: string }> Dao and app address that can
 * be used with an Aragon client to view the app.
 */
export declare function startBackend({ appName, silent }: {
    appName: string;
    silent: boolean;
}, bre: BuidlerRuntimeEnvironment): Promise<{
    daoAddress: string;
    appAddress: string;
    /**
     * Closes open file watchers
     */
    close: () => void;
}>;
//# sourceMappingURL=start-backend.d.ts.map