export interface App {
  "name": string,
  "description": string,
  "shortcut": string,
  "banner": string,

  // Category: "OnlineGames", "OfflineGames", "Apps"
  "category": string
}

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { readdir, readFile, writeFile } from 'node:fs/promises';

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();

  ipcMain.on("fromRenderer:onLoad", async (event) => {
    try {
      const jsonFile = await readFile(path.join(__dirname, "apps.config.json"), { encoding: "utf-8" });
      const jsonData: App[] = JSON.parse(jsonFile);
      const files = await readdir(path.join(__dirname, "shortcuts"));
      const newData: App[] = [];

      for (const file of files) {
        const filteredData = jsonData.filter(app => app.shortcut === file);
        newData.push(...filteredData);
      }

      const removeDuplicates = newData.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.shortcut === value.shortcut
        ))
      );

      for (const file of files) {
        if (!(removeDuplicates.some(({ shortcut }) => shortcut === file))) {
          newData.push({
            "name": file.split(".")[0],
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus nulla vel ligula aliquet, vel suscipit metus mollis. Nullam facilisis libero vehicula nibh placerat finibus.",
            "shortcut": file,
            "banner": "#",
            "category": "OnlineGames"
          });
        }
      }

      const newDataString = JSON.stringify(newData, null, 4);

      await writeFile(path.join(__dirname, "apps.config.json"), newDataString);

      event.reply("fromMain:apps", newData);
    } catch (error) {
      console.error(error);
    }
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
