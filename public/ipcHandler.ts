// ipcHandlers.ts

import { ipcMain, IpcMainEvent } from "electron";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";

// React 앱으로부터 Java 설치 요청 수신
ipcMain.on("install-java", (event, version) => {
  // 여기서 version을 사용하여 실행할 파일 경로를 결정합니다.
  let filePath;
  console.log(version);

  let versionNum = version.match(/\d+/)?.[0] || "";

  if (!isNaN(Number(versionNum))) {
    filePath = path.join(
      __dirname,
      `resources/java/${versionNum}/java${versionNum}-installer.exe`
    );
    console.log(filePath);
  } else {
    console.error("지원하지 않는 Java 버전입니다.");
    return;
  }

  const installProcess = exec(filePath);

  installProcess.stdout.on("data", (data: string) => {
    console.log(`stdout: ${data}`);
    event.sender.send("install-java-response", data);
  });

  installProcess.stderr.on("data", (data: string) => {
    console.error(`stderr: ${data}`);
    event.sender.send("install-java-response", data);
  });

  installProcess.on("close", (code: number) => {
    console.log(`설치 프로세스 종료 코드: ${code}`);
    if (code === 0) {
      console.log("Java 설치가 완료되었습니다.");
    } else {
      console.error("Java 설치 중 오류가 발생했습니다.");
    }
    event.sender.send("install-java-response", { code });
  });
});

// React 앱으로부터 환경변수 설정 요청 수신
ipcMain.on("set-env", () => {
  // 환경변수 설정 작업 수행
  // 필요한 경우 Java 버전 등을 설정
});

// 자바 버전 체크
const directoryPath = "C:\\Program Files\\Java";
const dirList = [];

ipcMain.on("check-version", (event, version) => {
  const javaHome = process.env.JAVA_HOME || undefined;
  const classPath = process.env.CLASSPATH || undefined;

  const envPath = process.env.path
    ?.split(";")
    .find(
      (item) =>
        item.startsWith("%JAVA_HOME") ||
        item.startsWith("C:\\Program Files\\Common Files\\Oracle\\Java")
    );

  const dirList: string[] = [];

  try {
    const files = fs.readdirSync(directoryPath);

    // 폴더 목록만 필터링
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        dirList.push(file);
      }
    });
  } catch (err) {
    console.log(err);
  }

  const response = {
    javaHome: javaHome,
    classPath: classPath,
    envPath: envPath,
    dirList: dirList,
  };

  console.log(response);
  event.sender.send("ipc-test", response);
});
