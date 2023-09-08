import * as path from "path";
import { app, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import "./ipcHandler";

const BASE_URL = "http://localhost:3000";

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.once("ready-to-show", () => {
    if (mainWindow !== null) {
      mainWindow.show();
    }
  });

  if (isDev) {
    console.log("-----dev-----");
    mainWindow.loadURL(BASE_URL);

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../build/index.html"));
  }

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });
}

app.on("ready", (): void => {
  createMainWindow();
});

app.on("window-all-closed", (): void => {
  app.quit();
});

app.on("activate", (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});