const { ipcMain, webContents } = require("electron");
import { appName } from "../types/main";
import { appIds } from "./appId";
import { selectedFilesTags } from "./appInitialData";

/** startingCroquis <-> fileSelecter */

// ipcMain.on(
//   "toFileSelecter",
//   (event, from: appName, data: selectedFilesTags) => {
//     if (from == "startingCroquis") {
//       webContents.fromId(appIds["fileSelecter"]).send("selectedFiles", data);
//     }
//   }
// );

ipcMain.on(
  "toStartingCroquis",
  (event, from: appName, data: selectedFilesTags) => {
    if (from == "fileSelecter") {
      webContents.fromId(appIds["startingCroquis"]).send("selectedFiles", data);
    }
  }
);
