import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Events
import mainEvents from './events/main';

const production = true;

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

  if (!production) {
    mainWindow.setMenuBarVisibility(true);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenuBarVisibility(false);
  }

  mainEvents(mainWindow);
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
