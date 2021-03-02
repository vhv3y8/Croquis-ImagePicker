const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  webContents,
} = require("electron");
const path = require("path");
import { appName } from "./types/main";
import { setId, appIds, startingCroqiusFileData } from "./mainCommunication";

function createWindow(appName: appName, delay: number, parent?: appName) {
  console.log(
    "Starting createWindow Function: " + appName + " " + delay + " " + parent
  );
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
      parent: undefined,
      modal: appWindowValueList[appName].modal ?? false,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    };

    if (parent !== undefined) {
      console.log("parent is ");
      console.log(parent);
      // console.log("parent is not undefined.");
      // // console.log(BrowserWindow);
      let parentw = BrowserWindow.fromId(appIds[parent]);
      console.log("***********************************8");
      console.log(parentw);
      console.log(BrowserWindow.fromId(3));
      // // console.log(webContents.fromId(appIds[windowParams.parent]));
      // let parentWindow = BrowserWindow.fromWebConents(parent);
      // console.log("parent window is :");
      // console.log(parentWindow);
      windowParams.parent = parentw;
    }

    console.log(windowParams);
    console.log(`delay is ${delay} milliseconds.`);
    // console.log(parent);
    // console.log()

    // flow start
    const win = new BrowserWindow(windowParams);
    console.log(win);
    setTimeout(() => {
      win.loadFile(path.join(__dirname, getAppUrl[appName]));
      win.webContents.openDevTools({ mode: "undocked" });
      // setId(appName, win.webContents.id);
      setId(appName, win.id);
      console.log("this is win");
      console.log(win);
      console.log(win.webContents);
    }, delay);
  });
}

ipcMain.on("openApp", (event, appName, delay, parent?) => {
  createWindow(appName, delay, parent);
  console.log(`Main: Opening ${appName} App.`);
});

// app.whenReady().then(() => setTimeout(createWindow("initPage"), 500));
app.on("ready", () => {
  setTimeout(() => {
    createWindow("initPage", 0);
  }, 500);

  console.log(screen.getPrimaryDisplay());

  ipcMain.on(
    "fileSelecter-to-startingCroquis",
    (event, data: startingCroqiusFileData) => {
      console.log("asdf");
      console.log(event);
      console.log("this is web content startingCroquis :");
      console.log(webContents.getAllWebContents());
      console.log(appIds["startingCroquis"]);
      console.log(webContents.fromId(appIds["startingCroquis"]));
      console.log(data);
      console.log(appIds);
      webContents.fromId(appIds["startingCroquis"]).send("fileData", data);
    }
  );
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
