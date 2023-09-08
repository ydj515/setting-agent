"use strict";
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
require("./ipcHandler");
var BASE_URL = "http://localhost:3000";
var mainWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.once("ready-to-show", function () {
        if (mainWindow !== null) {
            mainWindow.show();
        }
    });
    if (isDev) {
        console.log("-----dev-----");
        mainWindow.loadURL(BASE_URL);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../../build/index.html"));
    }
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}
electron_1.app.on("ready", function () {
    createMainWindow();
});
electron_1.app.on("window-all-closed", function () {
    electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});
