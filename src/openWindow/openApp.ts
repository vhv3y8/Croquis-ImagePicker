const { BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
import { appName } from "../types/main";
import { setId, appIds } from "../communication/appId";

function createWindow(
  appName: appName,
  delay: number,
  parent?: appName,
  data?
) {
  console.log(
    "Starting createWindow Function: " + appName + " " + delay + " " + parent
  );
  // cannot use screen module before app.on("ready")
  let appWindowData = import("./appWindowData").then((module) => {
    var [appWindowValueList, getAppUrl, getPreloadPath] = [
      module.appWindowValueList,
      module.getAppUrl,
      module.getPreloadPath,
    ];

    let windowParams = {
      width: appWindowValueList[appName].width ?? 800,
      height: appWindowValueList[appName].height ?? 600,
      resizable: appWindowValueList[appName].resizable ?? false,
      parent: undefined,
      modal: appWindowValueList[appName].modal ?? false,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        enableRemoteModule: false,
        contextIsolation: true,
        preload: getPreloadPath(appName),
      },
    };

    if (parent !== undefined) {
      windowParams.parent = BrowserWindow.fromId(appIds[parent]);
    }

    console.log(windowParams);
    console.log(`delay is ${delay} milliseconds.`);

    // flow start
    const win = new BrowserWindow(windowParams);
    console.log(win);
    setTimeout(() => {
      win.loadFile(path.join(__dirname, getAppUrl[appName]));
      // win.webContents.openDevTools({ mode: "undocked" });
      setId(appName, win.id);

      // give app initial data
      win.webContents.once("did-finish-load", () => {
        console.dir(data);
        win.webContents.send("getInitialData", data);
      });

      // BrowserWindow.fromId(appIds[appName]).once("close", () => {
      //   console.log(`${appName} App is closed.`);
      //   console.log("hihihihihihihihihiihihiihihihhi");
      // });
    }, delay);
  });
}

// flow start
ipcMain.on("openApp", (event, appName, delay, parent?, data?) => {
  createWindow(appName, delay, parent, data);
  console.log(`Main: Opening ${appName} App.`);
});

export { createWindow };
