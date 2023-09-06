import * as path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';

const { exec } = require('child_process');

const BASE_URL = 'http://localhost:3000';

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
    console.log("=======================");
    console.log(path.join(__dirname, "preload.ts"));
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.ts"),
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
ipcMain.on('install-java', () => {

    console.log("aaaaaa");
  const installProcess = exec('path_to_your_installer.exe');

  installProcess.stdout.on('data', (data: string) => {
    console.log(`stdout: ${data}`);
  });

  installProcess.stderr.on('data', (data: string) => {
    console.error(`stderr: ${data}`);
  });

  installProcess.on('close', (code: number) => {
    console.log(`설치 프로세스 종료 코드: ${code}`);
    if (code === 0) {
      console.log('Java 설치가 완료되었습니다.');
    } else {
      console.error('Java 설치 중 오류가 발생했습니다.');
    }
  });
});

// React 앱으로부터 환경변수 설정 요청 수신
ipcMain.on('set-env', () => {
  // 환경변수 설정 작업 수행
  // 필요한 경우 Java 버전 등을 설정
});
