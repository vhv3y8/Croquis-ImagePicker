const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  webContents,
  Notification,
} = require("electron");
import { appName } from "./types/main";
import { startingCroqiusFileData } from "./mainCommunication";
import { setId, appIds } from "./communication/appId";
import { createWindow } from "./openWindow/openApp";
import {
  initialCheckCroquisfolder,
  initialCheckConfigFile,
} from "./database/databaseFs";
import { st } from "./communication/appToApp";
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

st();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// app.whenReady().then(() => setTimeout(createWindow("initPage"), 500));
app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
  // new Notification({
  //   title: "Croquis Image Picker",
  //   body: app.getVersion(),
  // }).show();
  // console.log(app.getVersion());
  // console.log(app.getVersion().version);
  // console.log(app.app.getVersion());

  setTimeout(() => {
    createWindow("initPage", 0, undefined);

    // initial file checking
    initialCheckCroquisfolder();
    initialCheckConfigFile();

    // setTimeout(() => {
    //   Object.values(appIds)
    //     .filter((id) => id !== undefined)
    //     .forEach((id) => {
    //       BrowserWindow.fromId(id).send("log", "log testing");
    //     });
    //   console.log("hi!!!!!!!!!!!!!!!!!!!!!!!!");
    // }, 5000);
  }, 500);

  // console.log(screen.getPrimaryDisplay());

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

/** autoUpdater */

autoUpdater.on("checking-for-update", () => {
  // sendStatusToWindow("Checking for update...");
  // new Notification({
  //   title: "Croquis Image Picker " + app.getVersion(),
  //   body: "앱 업데이트 확인 중",
  // }).show();
});
autoUpdater.on("update-available", (info) => {
  // sendStatusToWindow("Update available.");
  new Notification({
    title: "Croquis Image Picker v" + app.getVersion(),
    body:
      "앱 업데이트가 출시되었습니다. 다운로드를 시작합니다. 앱을 닫지 마세요...",
  }).show();
});
autoUpdater.on("update-not-available", (info) => {
  // sendStatusToWindow("Update not available.");
  // new Notification({
  //   title: "Croquis Image Picker " + app.getVersion(),
  //   body: "앱 업데이트 없음",
  // }).show();
  log.info("업데이트 없음");
});
autoUpdater.on("error", (err) => {
  // sendStatusToWindow("Error in auto-updater. " + err);
  new Notification({
    title: "Croquis Image Picker v" + app.getVersion(),
    body: "앱 업데이트 도중 에러가 발생했습니다.",
  }).show();
  // new Notification({
  //   title: "Error Message",
  //   body: err,
  // }).show();
  Object.values(appIds)
    .filter((id) => id !== undefined)
    .forEach((id) => {
      BrowserWindow.fromId(id).send("log", err);
    });
  log.info(err);
});
autoUpdater.on("update-downloaded", (info) => {
  // sendStatusToWindow("Update downloaded");
  // new Notification({
  //   title: "Croquis Image Picker",
  //   body: "업데이트가 다운로드되었습니다. 앱 종료 시 설치가 진행됩니다.",
  // }).show();
});

let percentArr = [90, 75, 50, 25, 0];
let curr = percentArr.pop();
autoUpdater.on("download-progress", (progressObj) => {
  // let log_message = "Download 속도: " + progressObj.bytesPerSecond;
  // log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  // log_message =
  //   log_message +
  //   " (" +
  //   progressObj.transferred +
  //   "/" +
  //   progressObj.total +
  //   ")";
  // sendStatusToWindow(log_message);
  if (percentArr.length > 0 && progressObj.percent > curr) {
    new Notification({
      title: "Croquis Image Picker",
      body: "앱 업데이트 " + Math.floor(progressObj.percent) + "% 진행중...",
    }).show();
    curr = percentArr.pop();
  }
  if (BrowserWindow.fromId(appIds["initPage"]) !== null) {
    BrowserWindow.fromId(appIds["initPage"]).send("log", {
      percent: progressObj.percent,
      percentArr: percentArr,
      curr: curr,
      len: percentArr.length,
      bigThanCurr: progressObj.percent > curr,
    });
  }
  // else {
  //   new Notification({
  //     title: "plz",
  //     body: "initPage is null",
  //   });
  // }
});
