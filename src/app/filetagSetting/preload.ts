var { contextBridge, shell, ipcRenderer } = require("electron");
var path = require("path");
var {
  getConfigFile,
  flushConfigFile,
  updateFiles,
} = require("../../database/databaseFs");
import { appName } from "../../types/main";

let croquisFolderPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  "Downloads",
  "Croquis"
);

contextBridge.exposeInMainWorld("api", {
  openApp: (appName: appName, delay: number) => {
    if (
      appName == "initPage" ||
      appName == "Croquis" ||
      appName == "fileSelecter" ||
      appName == "filetagSetting" ||
      appName == "startingCroquis"
    ) {
      ipcRenderer.send("openApp", appName, delay);
    } else {
      console.log("not a existing appname.");
    }
  },

  getCroquisFolderPath: () => {
    console.log(
      "from getCroquisFolderPath: length is " + croquisFolderPath.length
    );
    if (croquisFolderPath.length > 33) {
      return "..." + croquisFolderPath.slice(-30);
    } else {
      return croquisFolderPath;
    }
  },

  openfileExplorer: () => {
    shell.openPath(
      path.join(
        process.env.HOME || process.env.USERPROFILE,
        "Downloads",
        "Croquis"
      )
    );
  },

  joinPath: (address) => {
    return path.join(address);
  },

  getDataWithUpdate: () => {
    return updateFiles(getConfigFile());
  },

  flushConfigFile: ({ tags, files }) => {
    // tags.every((tag) => typeof tag == "string")

    if (
      Object.keys(tags).every((group) => {
        return tags[group].every((tag) => typeof tag == "string");
      })
    ) {
      if (
        files.every((file) => {
          return "tags" in file && "address" in file;
          // need to check more precisely...
        })
      ) {
        flushConfigFile({ tags, files });
        console.log("flush file.");
      }
    }
  },
});
