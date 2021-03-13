var { contextBridge, shell } = require("electron");
var path = require("path");
var {
  getConfigFile,
  flushConfigFile,
  updateFiles,
} = require("../../database/databaseFs");

contextBridge.exposeInMainWorld("api", {
  openfileExplorer: () => {
    shell.openPath(
      path.join(
        process.env.HOME || process.env.USERPROFILE,
        "Downloads",
        "Croquis"
      )
    );
  },

  getDataWithUpdate: () => {
    return updateFiles(getConfigFile());
  },

  flushConfigFile: ({ tags, files }) => {
    if (tags.every((tag) => typeof tag == "string")) {
      if (
        files.every((file) => {
          return "filename" in file && "tags" in file && "address" in file;
          // need to check more precisely...
        })
      ) {
        flushConfigFile({ tags, files });
        console.log("flush file.");
      }
    }
  },
});
