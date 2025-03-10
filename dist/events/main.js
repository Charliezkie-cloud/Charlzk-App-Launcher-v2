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
exports.default = mainEvents;
const electron_1 = require("electron");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const appsConfigPath = node_path_1.default.join(__dirname, "../apps.config.json");
const backgroundsPath = node_path_1.default.join(__dirname, "../assets", "img", "backgrounds");
const shortcutsPath = node_path_1.default.join(__dirname, "../shortcuts");
const bannersPath = node_path_1.default.join(__dirname, "../assets", "img", "banners");
function mainEvents(mainWindow) {
    electron_1.ipcMain.on("fromRenderer:onLoad", (event) => __awaiter(this, void 0, void 0, function* () {
        try {
            const backgrounds = yield (0, promises_1.readdir)(backgroundsPath);
            const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            event.reply("fromMain:background", selectedBackground);
            const jsonFile = yield (0, promises_1.readFile)(appsConfigPath, { encoding: "utf-8" });
            const jsonData = JSON.parse(jsonFile);
            const files = yield (0, promises_1.readdir)(shortcutsPath);
            const newData = [];
            for (const file of files) {
                const filteredData = jsonData.filter(app => app.shortcut === file);
                newData.push(...filteredData);
            }
            const removeDuplicates = newData.filter((value, index, self) => index === self.findIndex((t) => (t.shortcut === value.shortcut)));
            for (const file of files) {
                if (!(removeDuplicates.some(({ shortcut }) => shortcut === file)) && file.includes(".lnk")) {
                    newData.push({
                        "name": file.split(".")[0],
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus nulla vel ligula aliquet, vel suscipit metus mollis. Nullam facilisis libero vehicula nibh placerat finibus.",
                        "shortcut": file,
                        "banner": "Placeholder.jpg",
                        "category": "None"
                    });
                }
            }
            const banners = yield (0, promises_1.readdir)(bannersPath);
            for (const banner of banners) {
                if (!newData.some((data) => data.banner === banner) || banner === "DO NOT DELETE!") {
                    yield (0, promises_1.unlink)(node_path_1.default.join(bannersPath, banner));
                }
            }
            const newDataString = JSON.stringify(newData, null, 4);
            yield (0, promises_1.writeFile)(appsConfigPath, newDataString);
            event.reply("fromMain:apps", newData);
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
    electron_1.ipcMain.on("fromRenderer:openApp", (event, name, shortcut) => {
        const shortcutPath = node_path_1.default.join(shortcutsPath, shortcut);
        (0, node_child_process_1.exec)(`start "${name}" "${shortcutPath}"`, (err) => {
            if (err) {
                return electron_1.dialog.showErrorBox("Error", err.message);
            }
        });
    });
    electron_1.ipcMain.on("fromRenderer:openLink", (event, url) => {
        electron_1.shell.openExternal(url);
    });
    electron_1.ipcMain.on("fromRenderer:selectBanner", (event, shortcut) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield electron_1.dialog.showOpenDialog(mainWindow, {
                filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'] }
                ]
            });
            if (result.canceled) {
                return;
            }
            const jsonFile = yield (0, promises_1.readFile)(appsConfigPath, { encoding: "utf-8" });
            const jsonData = JSON.parse(jsonFile);
            const item = jsonData.find(value => value.shortcut === shortcut);
            if (item) {
                item.banner = node_path_1.default.basename(result.filePaths[0]);
            }
            yield (0, promises_1.rename)(result.filePaths[0], node_path_1.default.join(bannersPath, node_path_1.default.basename(result.filePaths[0])));
            yield (0, promises_1.writeFile)(appsConfigPath, JSON.stringify(jsonData, null, 4), { encoding: "utf-8" });
            event.reply("fromMain:selectedBanner", node_path_1.default.basename(result.filePaths[0]), shortcut);
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
    electron_1.ipcMain.on("fromRenderer:saveChanges", (event, newValue) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.writeFile)(appsConfigPath, newValue, { encoding: "utf-8" });
            const result = yield electron_1.dialog.showMessageBox(mainWindow, {
                title: "Restart Needed",
                message: "Would you like to restart the app now to apply the changes?",
                buttons: ["Yes", "No"],
                defaultId: 1,
                type: "question"
            });
            switch (result.response) {
                case 0:
                    mainWindow.webContents.reloadIgnoringCache();
                    break;
            }
        }
        catch (error) {
            electron_1.dialog.showErrorBox("Error", error.message);
        }
    }));
    electron_1.ipcMain.on("fromRenderer:shortcutsFolder", (event) => {
        (0, node_child_process_1.exec)(`start "Shortcuts folder" "${shortcutsPath}"`, (err) => {
            if (err) {
                return electron_1.dialog.showErrorBox("Error", err.message);
            }
        });
    });
}
