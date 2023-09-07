import { ipcMain } from "electron";

import * as fs from "fs";
import * as path from "path";

const directoryPath = "C:\\Program Files\\Java";
const dirList = [];

ipcMain.on("check-version", (event, version) => {
  const javaHome = process.env.JAVA_HOME || undefined;
  const classPath = process.env.CLASSPATH || undefined;
  let dirList = 0;
  const envPath = process.env.path
    ?.split(";")
    .find(
      (item) =>
        item.startsWith("%JAVA_HOME") ||
        item.startsWith(
          "C:\\Program Files\\Common Files\\Oracle\\Java\\javapath"
        )
    );

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("폴더를 읽을 수 없습니다:", err);
      return;
    }

    // 폴더 목록만 필터링
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        dirList.push(file);
      }
    });

    console.log("폴더 목록:", dirList);
  });

  const response = {
    javaHome: javaHome,
    classPath: classPath,
    envPath: envPath,
  };

  console.log(response);
  event.sender.send("ipc-test", response);
});
