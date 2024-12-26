import { BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import { App } from '..';

const appsConfigPath = path.join(__dirname, "../apps.config.json");
const backgroundsPath = path.join(__dirname, "../assets", "img", "backgrounds");
const shortcutsPath = path.join(__dirname, "../shortcuts");
const bannersPath = path.join(__dirname, "../assets", "img", "banners");

export default function mainEvents(mainWindow: BrowserWindow) {
  ipcMain.on("fromRenderer:onLoad", async (event) => {
    try {
      const backgrounds = await readdir(backgroundsPath);
      const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      event.reply("fromMain:background", selectedBackground);

      const jsonFile = await readFile(appsConfigPath, { encoding: "utf-8" });
      const jsonData: App[] = JSON.parse(jsonFile);
      const files = await readdir(shortcutsPath);
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

      const banners = await readdir(bannersPath);

      for (const banner of banners) {
        if (!newData.some((data) => data.banner === banner) || banner === "DO NOT DELETE!") {
          await unlink(path.join(bannersPath, banner));
        }
      }

      const newDataString = JSON.stringify(newData, null, 4);

      await writeFile(appsConfigPath, newDataString);

      event.reply("fromMain:apps", newData);
    } catch (error) {
      dialog.showErrorBox("Error", (error as Error).message);
    }
  });

  ipcMain.on("fromRenderer:openApp", (event, name: string, shortcut: string) => {
    const shortcutPath = path.join(shortcutsPath, shortcut);
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

      const jsonFile = await readFile(appsConfigPath, { encoding: "utf-8" });
      const jsonData: App[] = JSON.parse(jsonFile);

      const item = jsonData.find(value => value.shortcut === shortcut);
      if (item) {
        item.banner = path.basename(result.filePaths[0]);
      }

      await rename(result.filePaths[0], path.join(bannersPath, path.basename(result.filePaths[0])));
      await writeFile(appsConfigPath, JSON.stringify(jsonData, null, 4), { encoding: "utf-8" });

      event.reply("fromMain:selectedBanner", path.basename(result.filePaths[0]), shortcut);
    } catch (error) {
      dialog.showErrorBox("Error", (error as Error).message);
    }
  });

  ipcMain.on("fromRenderer:saveChanges", async (event, newValue: string) => {
    try {
      await writeFile(appsConfigPath, newValue, { encoding: "utf-8" });

      const result = await dialog.showMessageBox(mainWindow, {
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
    } catch (error) {
      dialog.showErrorBox("Error", (error as Error).message);
    }
  });

  ipcMain.on("fromRenderer:shortcutsFolder", (event) => {
    exec(`start "Shortcuts folder" "${shortcutsPath}"`, (err) => {
      if (err) {
        return dialog.showErrorBox("Error", err.message);
      }
    });
  });
}
