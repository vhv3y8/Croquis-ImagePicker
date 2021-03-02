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
    console.log(win);
    setTimeout(() => {
      win.loadFile(path.join(__dirname, getAppUrl[appName]));
      win.webContents.openDevTools({ mode: "undocked" });
      setId(appName, win.webContents.id);
      console.log("this is win");
      console.log(win);
      console.log(win.webContents);
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
