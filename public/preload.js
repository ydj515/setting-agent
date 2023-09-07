const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    'electron',
    {
      doThing: (channelName, version) => ipcRenderer.send(channelName, version)
    }
  )