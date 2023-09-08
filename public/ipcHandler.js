"use strict";
// ipcHandlers.ts
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var child_process_1 = require("child_process");
// React 앱으로부터 Java 설치 요청 수신
electron_1.ipcMain.on("install-java", function (event, version) {
    var _a;
    // 여기서 version을 사용하여 실행할 파일 경로를 결정합니다.
    var filePath;
    console.log(version);
    var versionNum = ((_a = version.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || "";
    if (!isNaN(Number(versionNum))) {
        filePath = path.join(__dirname, "resources/java/".concat(versionNum, "/java").concat(versionNum, "-installer.exe"));
        console.log(filePath);
    }
    else {
        console.error("지원하지 않는 Java 버전입니다.");
        return;
    }
    var installProcess = (0, child_process_1.exec)(filePath);
    installProcess.stdout.on("data", function (data) {
        console.log("stdout: ".concat(data));
        event.sender.send("install-java-response", data);
    });
    installProcess.stderr.on("data", function (data) {
        console.error("stderr: ".concat(data));
        event.sender.send("install-java-response", data);
    });
    installProcess.on("close", function (code) {
        console.log("\uC124\uCE58 \uD504\uB85C\uC138\uC2A4 \uC885\uB8CC \uCF54\uB4DC: ".concat(code));
        if (code === 0) {
            console.log("Java 설치가 완료되었습니다.");
        }
        else {
            console.error("Java 설치 중 오류가 발생했습니다.");
        }
        event.sender.send("install-java-response", { code: code });
    });
});
// React 앱으로부터 환경변수 설정 요청 수신
electron_1.ipcMain.on("set-env", function () {
    // 환경변수 설정 작업 수행
    // 필요한 경우 Java 버전 등을 설정
});
// 자바 버전 체크
var directoryPath = "C:\\Program Files\\Java";
var dirList = [];
electron_1.ipcMain.on("check-version", function (event, version) {
    var _a;
    var javaHome = process.env.JAVA_HOME || undefined;
    var classPath = process.env.CLASSPATH || undefined;
    var envPath = (_a = process.env.path) === null || _a === void 0 ? void 0 : _a.split(";").find(function (item) {
        return item.startsWith("%JAVA_HOME") ||
            item.startsWith("C:\\Program Files\\Common Files\\Oracle\\Java");
    });
    var dirList = [];
    try {
        var files = fs.readdirSync(directoryPath);
        // 폴더 목록만 필터링
        files.forEach(function (file) {
            var filePath = path.join(directoryPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                dirList.push(file);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    var response = {
        javaHome: javaHome,
        classPath: classPath,
        envPath: envPath,
        dirList: dirList
    };
    console.log(response);
    event.sender.send("ipc-test", response);
});
