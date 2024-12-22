import { contextBridge, ipcRenderer } from "electron";

function onLoad() {
  ipcRenderer.send("fromRenderer:onLoad");
}

function onLoadReply(callback: (message: string) => void) {
  ipcRenderer.on("fromMain:onLoadReply", (event, message: string) => {
    callback(message);
  });
}

contextBridge.exposeInMainWorld("electron", {
  onLoad,
  onLoadReply 
});
