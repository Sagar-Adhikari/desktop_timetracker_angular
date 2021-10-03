// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {
    contextBridge,
    ipcRenderer,
} = require("electron");

// const keytar = remote.require('keytar');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            let validChannels = ["startScreenshot", "closeApp", "db_insert", "db_remove", "db_get","getPassword","savePassword","deletePassword","findPassword","open-dialog-box","closed","db_update","onClose"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                "screenshotResp",
                "screenshotRespError",
                "dbInsertResp",
                "dbInsertRespError",
                "dbRemoveRespError",
                "dbRemoveResp",
                "dbGetRespError",
                "dbGetResp",
                "findCredentials",
                "dialogSession",
                "close-response",
                "closeInsertResp",
                "closeInsertRespError",
                "closeRemoveRespError",
                "closeRemoveResp",
                "closeGetRespError",
                "closeGetResp",
                "closeUpdateResp",
                "closeUpdateRespError"

            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);
