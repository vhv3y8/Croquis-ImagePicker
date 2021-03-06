const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  webContents,
} = require("electron");
const path = require("path");
import { appName } from "./types/main";
import { startingCroqiusFileData } from "./mainCommunication";
import { setId, appIds } from "./communication/appId";
import { createWindow } from "./communication/openApp";
import {
  initializeCroquisfolder,
  initializeConfigFile,
} from "./database/databaseFs";
import { st } from "./communication/appToApp";

st();

// app.whenReady().then(() => setTimeout(createWindow("initPage"), 500));
app.on("ready", () => {
  setTimeout(() => {
    createWindow("initPage", 0, undefined, {
      testing: "hi",
    });

    // initial file checking
    initializeCroquisfolder();
    initializeConfigFile();
  }, 500);

  console.log(screen.getPrimaryDisplay());

  // ipcMain.on(
  //   "fileSelecter-to-startingCroquis",
  //   (event, data: startingCroqiusFileData) => {
  //     console.log("asdf");
  //     console.log(event);
  //     console.log("this is web content startingCroquis :");
  //     console.log(webContents.getAllWebContents());
  //     console.log(appIds["startingCroquis"]);
  //     console.log(webContents.fromId(appIds["startingCroquis"]));
  //     console.log(data);
  //     console.log(appIds);
  //     webContents.fromId(appIds["startingCroquis"]).send("fileData", data);
  //   }
  // );
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
