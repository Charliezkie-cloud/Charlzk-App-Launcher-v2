"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function onLoad() {
    electron_1.ipcRenderer.send("fromRenderer:onLoad");
}
function onLoadReply(callback) {
    electron_1.ipcRenderer.on("fromMain:onLoadReply", (event, message) => {
        callback(message);
    });
}
electron_1.contextBridge.exposeInMainWorld("electron", {
    onLoad,
    onLoadReply
});
