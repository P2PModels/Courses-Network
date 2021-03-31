import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
/**
 * Starts the task's frontend sub-tasks. Logic is contained in ./tasks/start/utils/frontend/.
 * If changes are detected, the app's frontend is rebuilt.
 */
export declare function startFrontend(bre: BuidlerRuntimeEnvironment): Promise<{
    /**
     * Closes open file watchers and file servers
     */
    close: () => void;
}>;
//# sourceMappingURL=start-frontend.d.ts.map