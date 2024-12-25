import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';

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
      const backgrounds = await readdir(path.join(__dirname, "assets", "img", "backgrounds"));
      const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      event.reply("fromMain:background", selectedBackground);

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
            "banner": "Placeholder.jpg",
            "category": "None"
          });
        }
      }

      const newDataString = JSON.stringify(newData, null, 4);

      await writeFile(path.join(__dirname, "apps.config.json"), newDataString);

      event.reply("fromMain:apps", newData);
    } catch (error) {
      dialog.showErrorBox("Error", (error as Error).message);
    }
  });

  ipcMain.on("fromRenderer:openApp", (event, name:string, shortcut: string) => {
    const shortcutPath = path.join(__dirname, "shortcuts", shortcut);
    exec(`start "${name}" "${shortcutPath}"`, (err) => {
      if (err) {
        return dialog.showErrorBox("Error", err.message);
      }
    });
  });

  ipcMain.on("fromRenderer:openLink", (event, url: string) => {
    shell.openExternal(url);
  });

  ipcMain.on("fromRenderer:selectBanner", async (event, shortcut: string) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'] }
        ]
      });
      if (result.canceled) { return; }

      const jsonFile = await readFile(path.join(__dirname, "apps.config.json"), { encoding: "utf-8" });
      const jsonData: App[] = JSON.parse(jsonFile);

      const item = jsonData.find(value => value.shortcut === shortcut);
      if (item) {
        item.banner = "HELO WORLD!";
      }

      console.log(JSON.stringify(jsonData, null, 4));

      // event.reply("fromMain:selectedBanner", result.filePaths[0]);
    } catch (error) {
      dialog.showErrorBox("Error", (error as Error).message);
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

export interface App {
  "name": string,
  "description": string,
  "shortcut": string,
  "banner": string,
  // Category: "None", "OnlineGames", "OfflineGames", "Apps"
  "category": string
}
