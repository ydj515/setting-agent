# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).






[nvm install]
https://github.com/coreybutler/nvm-windows/releases/tag/1.1.11

[node install]
nvm install 16
nvm install 12

nvm ls

nvm use 16.20.2

nvm ls



[module install]
npx create-react-app [project-name] --template typescript
cd [project-name]
npm i -D concurrently cross-env electron electron-builder wait-on
npm i electron-is-dev



[배포]
npm run make

npm init


[package.json]
...
"main": "./public/electron.js",
"homepage": "./",
...
"scripts": {
	"react-start": "react-scripts start",
	"react-build": "react-scripts build",
	"react-test": "react-scripts test",
	"react-eject": "react-scripts eject",
	"start-renderer": "cross-env BROWSER=none npm run react-start",
	"start-main": "electron .",
	"compile-main": "tsc ./public/electron.ts",
	"start-main-after-renderer": "wait-on http://localhost:3000 && npm run start-main",
	"dev": "npm run compile-main && concurrently -n renderer, main 'npm:start-renderer' 'npm:start-main-after-renderer'",
	"pack": "npm run compile-main && npm run react-build && electron-builder --dir",
	"build": "npm run compile-main && npm run react-build && electron-builder build",
	"build:osx": "npm run build -- --mac",
	"build:linux": "npm run build -- --linux",
	"build:win": "npm run build -- --win",
	"predist": "npm run compile-main"
}
...
"build": {
    "productName": {프로젝트 명},
    "appId": {App ID},
    "asar": true,
    "protocols": { // 딥링크 시 사용 됨
      "name": {프로젝트 명},
      "schemes": [
        {App name}
      ]
    },
    "mac": {
      "target": [
        "default"
      ]
    },
    "dmg": {
      "title": "tournant"
    },
    "win": {
      "target": [
        "zip",
        "nsis"
      ]
    },
    "linux": {
      "target": [
        "AppImage",
        "deb",
        "rpm",
        "zip",
        "tar.gz"
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": false,
      "installerLanguages": [
        "en_US",
        "ko_KR"
      ],
      "language": "1042"
    },
    "directories": {
      "output": "dist/",
      "app": "."
    }
  }



 npm run dev





[빌드 파일만 생성]
npm run pack

[필드 후 패킹까지 진행]
npm run build

[os별 빌드 script - dist폴더에 생성]

```sh
npm run build:osx

npm run build:linux

npm run build:win
```