"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const electron_squirrel_startup_1 = __importDefault(require("electron-squirrel-startup"));
const promises_1 = require("node:fs/promises");
const node_child_process_1 = require("node:child_process");
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
    mainWindow.webContents.openDevTools();
    electron_1.ipcMain.on("fromRenderer:onLoad", (event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const backgrounds = yield (0, promises_1.readdir)(node_path_1.default.join(__dirname, "assets", "img", "backgrounds"));
            const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            event.reply("fromMain:background", selectedBackground);
            const jsonFile = yield (0, promises_1.readFile)(node_path_1.default.join(__dirname, "apps.config.json"), { encoding: "utf-8" });
            const jsonData = JSON.parse(jsonFile);
            const files = yield (0, promises_1.readdir)(node_path_1.default.join(__dirname, "shortcuts"));
            const newData = [];
            for (const file of files) {
                const filteredData = jsonData.filter(app => app.shortcut === file);
                newData.push(...filteredData);
            }
            const removeDuplicates = newData.filter((value, index, self) => index === self.findIndex((t) => (t.shortcut === value.shortcut)));
            for (const file of files) {
                if (!(removeDuplicates.some(({ shortcut }) => shortcut === file))) {
                    newData.push({
                        "name": file.split(".")[0],
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus nulla vel ligula aliquet, vel suscipit metus mollis. Nullam facilisis libero vehicula nibh placerat finibus.",
                        "shortcut": file,
                        "banner": "Placeholder.jpg",
                        "category": "None"
                    });
                }
            }
            const banners = yield (0, promises_1.readdir)(node_path_1.default.join(__dirname, "assets", "img", "banners"));
            for (const banner of banners) {
                if (!newData.some((data) => data.banner === banner)) {
                    yield (0, promises_1.unlink)(node_path_1.default.join(__dirname, "assets", "img", "banners", banner));
                }
            }
            const newDataString = JSON.stringify(newData, null, 4);
            yield (0, promises_1.writeFile)(node_path_1.default.join(__dirname, "apps.config.json"), newDataString);
            event.reply("fromMain:apps", newData);
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
    electron_1.ipcMain.on("fromRenderer:openApp", (event, name, shortcut) => {
        const shortcutPath = node_path_1.default.join(__dirname, "shortcuts", shortcut);
        (0, node_child_process_1.exec)(`start "${name}" "${shortcutPath}"`, (err) => {
            if (err) {
                return electron_1.dialog.showErrorBox("Error", err.message);
            }
        });
    });
    electron_1.ipcMain.on("fromRenderer:openLink", (event, url) => {
        electron_1.shell.openExternal(url);
    });
    electron_1.ipcMain.on("fromRenderer:selectBanner", (event, shortcut) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield electron_1.dialog.showOpenDialog(mainWindow, {
                filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'] }
                ]
            });
            if (result.canceled) {
                return;
            }
            const jsonFile = yield (0, promises_1.readFile)(node_path_1.default.join(__dirname, "apps.config.json"), { encoding: "utf-8" });
            const jsonData = JSON.parse(jsonFile);
            const item = jsonData.find(value => value.shortcut === shortcut);
            if (item) {
                item.banner = node_path_1.default.basename(result.filePaths[0]);
            }
            yield (0, promises_1.rename)(result.filePaths[0], node_path_1.default.join(__dirname, "assets", "img", "banners", node_path_1.default.basename(result.filePaths[0])));
            yield (0, promises_1.writeFile)(node_path_1.default.join(__dirname, "apps.config.json"), JSON.stringify(jsonData, null, 4), { encoding: "utf-8" });
            event.reply("fromMain:selectedBanner", node_path_1.default.basename(result.filePaths[0]), shortcut);
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
    electron_1.ipcMain.on("fromRenderer:saveChanges", (event, newValue) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, promises_1.writeFile)(node_path_1.default.join(__dirname, "apps.config.json"), newValue, { encoding: "utf-8" });
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
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
