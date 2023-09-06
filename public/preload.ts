const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    'electron',
    {
      doThing: () => ipcRenderer.send('install-java')
    }
  )