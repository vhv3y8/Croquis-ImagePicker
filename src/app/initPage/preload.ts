import { appName } from "../../types/main";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  openApp: (appName: appName, delay: number) => {
    if (
      appName == "initPage" ||
      appName == "Croquis" ||
      appName == "fileSelecter" ||
      appName == "fileSetting" ||
      appName == "startingCroquis"
    ) {
      ipcRenderer.send("openApp", appName, delay);
    } else {
      console.log("not a existing appname.");
    }
  },
});

window.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.on("log", (event, arg) => {
    console.log("log from main process:");
    console.log(arg);
    // window.close();
  });
});
