import { contextBridge, ipcRenderer } from "electron";

import { App } from ".";

function onLoad() {
  ipcRenderer.send("fromRenderer:onLoad");
}

function apps(callback: (data: App[]) => void) {
  ipcRenderer.on("fromMain:apps", (event, data: App[]) => {
    callback(data);
  });
}

contextBridge.exposeInMainWorld("electron", {
  onLoad,
  apps 
});
