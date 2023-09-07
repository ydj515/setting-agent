import * as path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';

const { exec } = require('child_process');

const BASE_URL = 'http://localhost:3000';

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
    console.log("=======================");
    console.log(path.join(__dirname, "preload.js"));
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow !== null) {
      mainWindow.show();
    }
  });

  if (isDev) {
    console.log("-----dev-----");
    mainWindow.loadURL(BASE_URL);

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.on('ready', (): void => {
  createMainWindow();
});

app.on('window-all-closed', (): void => {
  app.quit();
});

app.on('activate', (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// React 앱으로부터 Java 설치 요청 수신
ipcMain.on('install-java', (event, version) => {
  // 여기서 version을 사용하여 실행할 파일 경로를 결정합니다.
  let filePath;
  console.log(version);

  let versionNum = version.match(/\d+/)?.[0] || '';

  if (!isNaN(Number(versionNum))) {
    filePath = path.join(__dirname, `resources/java/${versionNum}/java${versionNum}-installer.exe`);
    console.log(filePath);
  } else {
    console.error('지원하지 않는 Java 버전입니다.');
    return;
  }

  const installProcess = exec(filePath);

  installProcess.stdout.on('data', (data: string) => {
    console.log(`stdout: ${data}`);
    event.sender.send('install-java-response', data);
  });

  installProcess.stderr.on('data', (data: string) => {
    console.error(`stderr: ${data}`);
    event.sender.send('install-java-response', data);
  });

  installProcess.on('close', (code: number) => {
    console.log(`설치 프로세스 종료 코드: ${code}`);
    if (code === 0) {
      console.log('Java 설치가 완료되었습니다.');
    } else {
      console.error('Java 설치 중 오류가 발생했습니다.');
    }
    event.sender.send('install-java-response', { code });
  });
});

// React 앱으로부터 환경변수 설정 요청 수신
ipcMain.on('set-env', () => {
  // 환경변수 설정 작업 수행
  // 필요한 경우 Java 버전 등을 설정
});
