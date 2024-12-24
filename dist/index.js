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
                        "category": "OnlineGames"
                    });
                }
            }
            const newDataString = JSON.stringify(newData, null, 4);
            yield (0, promises_1.writeFile)(node_path_1.default.join(__dirname, "apps.config.json"), newDataString);
            event.reply("fromMain:apps", newData);
        }
        catch (error) {
            console.error(error);
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
