import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
export declare function startGanache(bre: BuidlerRuntimeEnvironment): Promise<{
    networkId: number;
    close?: () => void;
}>;
export declare function stopGanache(): void;
//# sourceMappingURL=start-ganache.d.ts.map