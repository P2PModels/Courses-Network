"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startClient = void 0;
const logger_1 = require("~/src/ui/logger");
const aragon_client_1 = require("./client/aragon-client");
/**
 * Retrieves the Aragon client using git, builds it, builds the app's frontend and serves the build.
 * Starts the Aragon client pointed at a Dao and an app, and watches for changes on the app's sources.
 */
async function startClient(bre, daoAddress, appAddress, openBrowser) {
    const config = bre.config.aragon;
    logger_1.logFront('Checking Aragon client...');
    await aragon_client_1.installAragonClientIfNeeded();
    // Start Aragon client at the deployed address.
    const appServePort = config.appServePort;
    const appURL = `http://localhost:${appServePort}`;
    const { url: clientURL, close: closeStaticServer } = await aragon_client_1.startAragonClient(config.clientServePort, `${daoAddress}/${appAddress}`, openBrowser);
    logger_1.logFront(`You can now view the Aragon client in the browser.
App content: ${appURL}
Client:  ${clientURL}`);
    return {
        close: () => {
            closeStaticServer();
        }
    };
}
exports.startClient = startClient;
//# sourceMappingURL=start-client.js.map