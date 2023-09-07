"use strict";
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var exec = require('child_process').exec;
var BASE_URL = 'http://localhost:3000';
var mainWindow;
function createMainWindow() {
    console.log("=======================");
    console.log(path.join(__dirname, "preload.js"));
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.once('ready-to-show', function () {
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
        mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', function () {
    createMainWindow();
});
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});
// React 앱으로부터 Java 설치 요청 수신
electron_1.ipcMain.on('install-java', function (event, version) {
    var _a;
    // 여기서 version을 사용하여 실행할 파일 경로를 결정합니다.
    var filePath;
    console.log(version);
    var versionNum = ((_a = version.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || ''; // '8'
    if (!isNaN(Number(versionNum))) {
        filePath = path.join(__dirname, "resources/java/".concat(versionNum, "/java").concat(versionNum, "-installer.exe"));
        console.log(filePath);
    }
    else {
        console.error('지원하지 않는 Java 버전입니다.');
        return;
    }
    var installProcess = exec(filePath);
    installProcess.stdout.on('data', function (data) {
        console.log("stdout: ".concat(data));
        event.sender.send('install-java-response', data);
    });
    installProcess.stderr.on('data', function (data) {
        console.error("stderr: ".concat(data));
        event.sender.send('install-java-response', data);
    });
    installProcess.on('close', function (code) {
        console.log("\uC124\uCE58 \uD504\uB85C\uC138\uC2A4 \uC885\uB8CC \uCF54\uB4DC: ".concat(code));
        if (code === 0) {
            console.log('Java 설치가 완료되었습니다.');
        }
        else {
            console.error('Java 설치 중 오류가 발생했습니다.');
        }
        event.sender.send('install-java-response', { code: code });
    });
});
// React 앱으로부터 환경변수 설정 요청 수신
electron_1.ipcMain.on('set-env', function () {
    // 환경변수 설정 작업 수행
    // 필요한 경우 Java 버전 등을 설정
});
