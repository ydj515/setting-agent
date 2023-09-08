"use strict";
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
require("./ipcHandler");
var _a = require('child_process'), exec = _a.exec, spawn = _a.spawn;
var BASE_URL = 'http://localhost:3000';
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
// React 앱으로부터 Java 설치 요청 수신
electron_1.ipcMain.on('install-java', function (event, version) {
    var _a;
    // 여기서 version을 사용하여 실행할 파일 경로를 결정합니다.
    var filePath;
    console.log(version);
    var versionNum = ((_a = version.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
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
electron_1.ipcMain.on('set-env', function (event, version) {
    var psScriptPath = path.join(__dirname, '../test.bat');
    console.log(psScriptPath);
    var variableName = "aaa"; // 환경 변수 이름
    var variableValue = "bbb"; // 환경 변수 값
    var command = "\"".concat(psScriptPath, "\" \"").concat(variableName, "\" \"").concat(variableValue, "\""); // 두 개의 변수를 전달합니다.
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.error("Error executing PowerShell script: ".concat(error.message));
            return;
        }
        console.log("PowerShell script output: ".concat(stdout));
    });
});
