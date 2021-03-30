const { ipcMain, BrowserWindow } = require("electron");
import { appName } from "../types/main";
import { appIds } from "./appId";
import { selectedFilesTags } from "./appInitialData";

/** startingCroquis <-> fileSelecter */
function st() {
  console.log("st");
}
// ipcMain.on(
//   "toFileSelecter",
//   (event, from: appName, data: selectedFilesTags) => {
//     if (from == "startingCroquis") {
//       webContents.fromId(appIds["fileSelecter"]).send("selectedFiles", data);
//     }
//   }
// );

ipcMain.on("toStartingCroquis", (event, from: appName, data) => {
  console.log(data);
  console.log("############$#$#$#$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log(from);
  if (from == "fileSelecter") {
    BrowserWindow.fromId(appIds["startingCroquis"]).send("selectedFiles", data);
    console.log(
      "######################################################################"
    );
    console.log(data);
  }
});

export { st };
