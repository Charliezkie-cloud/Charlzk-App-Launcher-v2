"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function onLoad() {
    electron_1.ipcRenderer.send("fromRenderer:onLoad");
}
function apps(callback) {
    electron_1.ipcRenderer.on("fromMain:apps", (event, data) => {
        callback(data);
    });
}
function openApp(name, shortcut) {
    electron_1.ipcRenderer.send("fromRenderer:openApp", name, shortcut);
}
function background(callback) {
    electron_1.ipcRenderer.on("fromMain:background", (event, name) => {
        callback(name);
    });
}
function openLink(url) {
    electron_1.ipcRenderer.send("fromRenderer:openLink", url);
}
function selectBanner(shortcut) {
    electron_1.ipcRenderer.send("fromRenderer:selectBanner", shortcut);
}
function selectedBanner(callback) {
    electron_1.ipcRenderer.on("fromMain:selectedBanner", (event, banner, shortcut) => {
        callback(banner, shortcut);
    });
}
function saveChanges(newValue) {
    electron_1.ipcRenderer.send("fromRenderer:saveChanges", newValue);
}
function shortcutsFolder() {
    electron_1.ipcRenderer.send("fromRenderer:shortcutsFolder");
}
electron_1.contextBridge.exposeInMainWorld("electron", {
    onLoad,
    apps,
    openApp,
    background,
    openLink,
    selectBanner,
    selectedBanner,
    saveChanges,
    shortcutsFolder,
});
