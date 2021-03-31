"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExtender = void 0;
const params_1 = require("~/src/params");
const arappUtils_1 = require("~/src/utils/arappUtils");
const aragonRpc = (network) => `https://${network}.eth.aragon.network`;
const localRpc = 'http://localhost:8545';
const coverageRpc = 'http://localhost:8555';
const frameRpc = 'http://localhost:1248';
const frameOrigin = 'BuidlerAragon';
const aragenNetwork = {
    url: localRpc,
    gas: 6.9e6,
    ensAddress: params_1.defaultLocalAragonBases.ensAddress,
    accounts: { mnemonic: params_1.aragenMnemonic }
};
const defaultNetworks = {
    // Local networks
    development: aragenNetwork,
    localhost: aragenNetwork,
    aragen: aragenNetwork,
    rpc: aragenNetwork,
    devnet: aragenNetwork,
    // External networks
    mainnet: {
        chainId: 1,
        url: aragonRpc('mainnet'),
        gas: 7.9e6,
        gasPrice: 3000000001
    },
    ropsten: {
        chainId: 3,
        url: aragonRpc('ropsten'),
        gas: 4.712e6
    },
    rinkeby: {
        chainId: 4,
        url: aragonRpc('rinkeby'),
        gas: 6.9e6,
        gasPrice: 15000000001
    },
    coverage: {
        url: coverageRpc,
        gas: 0xffffffffff,
        gasPrice: 0x01
    },
    frame: {
        url: frameRpc,
        httpHeaders: { origin: frameOrigin }
    }
};
exports.configExtender = (finalConfig, userConfig) => {
    // Apply defaults. Note networks may not exists in finalConfig
    for (const [networkName, network] of Object.entries(defaultNetworks)) {
        finalConfig.networks[networkName] = Object.assign(Object.assign(Object.assign({}, network), ((userConfig.networks || {})[networkName] || {})), ((finalConfig.networks || {})[networkName] || {}));
    }
    const mutateNetwork = (aragonEnvironment, buidlerNetwork) => {
        const mutatedNetwork = Object.assign({}, buidlerNetwork);
        // Append registry address
        if (aragonEnvironment.registry) {
            mutatedNetwork.ensAddress = aragonEnvironment.registry;
        }
        return mutatedNetwork;
    };
    // Apply networks from arapp.json
    const arapp = arappUtils_1.readArappIfExists();
    if (arapp && typeof arapp.environments === 'object') {
        for (const [envName, environment] of Object.entries(arapp.environments)) {
            if (environment.network) {
                if (finalConfig.networks[envName]) {
                    finalConfig.networks[envName] = mutateNetwork(environment, finalConfig.networks[envName]);
                }
                else if (finalConfig.networks[environment.network]) {
                    // Add missing network from arapp.json
                    finalConfig.networks[envName] = mutateNetwork(environment, finalConfig.networks[environment.network]);
                }
            }
        }
    }
};
//# sourceMappingURL=networks.js.map