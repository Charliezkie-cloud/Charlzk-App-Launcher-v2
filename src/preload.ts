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

function openApp(name: string, shortcut: string) {
  ipcRenderer.send("fromRenderer:openApp", name, shortcut);
}

function background(callback: (name: string) => void) {
  ipcRenderer.on("fromMain:background", (event, name: string) => {
    callback(name);
  });
}

function openLink(url: string) {
  ipcRenderer.send("fromRenderer:openLink", url);
}

function selectBanner() {
  ipcRenderer.send("fromRenderer:selectBanner")
}

function selectedBanner(callback: (filepath: string) => void) {
  ipcRenderer.on("fromMain:selectedBanner", (event, filepath: string) => {
    callback(filepath);
  });
}


contextBridge.exposeInMainWorld("electron", {
  onLoad,
  apps,
  openApp,
  background,
  openLink,
  selectBanner,
  selectedBanner
});
