const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
import { appName } from "./types/main";

function createWindow(appName: appName, delay: number) {
  // cannot use screen module before app.on("ready")
  let appWindowData = import("./appWindowData").then((module) => {
    var [appWindowValueList, getAppUrl] = [
      module.appWindowValueList,
      module.getAppUrl,
    ];

    let windowParams = {
      width: appWindowValueList[appName].width ?? 800,
      height: appWindowValueList[appName].height ?? 600,
      resizable: appWindowValueList[appName].resizable ?? false,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    };

    // if (appName == "Croquis") {
    //   windowParams.width = screen.getPrimaryDisplay().workAreaSize.width;
    //   windowParams.height = screen.getPrimaryDisplay().workAreaSize.height;
    // }

    console.log(windowParams);
    console.log(`delay is ${delay} milliseconds.`);

    // flow start
    const win = new BrowserWindow(windowParams);
    setTimeout(() => {
      win.loadFile(path.join(__dirname, getAppUrl[appName]));
      win.webContents.openDevTools({ mode: "undocked" });
    }, delay);
  });
}

ipcMain.on("openApp", (event, appName, delay) => {
  createWindow(appName, delay);
  console.log(`Main: Opening ${appName} App.`);
});

// app.whenReady().then(() => setTimeout(createWindow("initPage"), 500));
app.on("ready", () => {
  setTimeout(() => {
    createWindow("initPage", 0);
  }, 500);

  console.log(screen.getPrimaryDisplay());
});

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow("initPage");
//   }
// });
