"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const electron_squirrel_startup_1 = __importDefault(require("electron-squirrel-startup"));
// Events
const main_1 = __importDefault(require("./events/main"));
const production = true;
if (electron_squirrel_startup_1.default) {
    electron_1.app.quit();
}
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadFile(node_path_1.default.join(__dirname, 'index.html'));
    if (!production) {
        mainWindow.setMenuBarVisibility(true);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.setMenuBarVisibility(false);
    }
    (0, main_1.default)(mainWindow);
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
