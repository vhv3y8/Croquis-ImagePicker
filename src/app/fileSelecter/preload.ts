var { ipcRenderer, contextBridge, shell } = require("electron");
var path = require("path");
var {
  getConfigFile,
  flushConfigFile,
  updateFiles,
} = require("../../database/databaseFs");

let croquisFolderPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  "Downloads",
  "Croquis"
);

contextBridge.exposeInMainWorld("api", {
  toStartingCroquis: (data) => {
    if (data === null) {
      ipcRenderer.send("toStartingCroquis", "fileSelecter", data);
    } else if ("filePaths" in data && "tags" in data) {
      // need to check more precisely...
      ipcRenderer.send("toStartingCroquis", "fileSelecter", data);
    } else {
      console.log("not existing data");
    }
  },

  openfileExplorer: () => {
    shell.openPath(croquisFolderPath);
  },

  getCroquisFolderPath: () => {
    if (croquisFolderPath.length > 40) {
      return "..." + croquisFolderPath.slice(-37);
    } else {
      return croquisFolderPath;
    }
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

window.addEventListener("DOMContentLoaded", function () {
  let selectedDataJson = {
    tags: [],
    filePaths: [],
  };

  function getCount(): number {
    return parseInt(document.querySelector("span.count").innerHTML);
  }

  function setCount(num: number) {
    document
      .querySelectorAll("span.count")
      .forEach((elem) => (elem.innerHTML = num.toString()));
  }

  ipcRenderer.on("getInitialData", (event, data) => {
    console.log("initial data is : ");
    console.dir(data);
    // if data exists, get it. if does not, just show default page.
    if (data !== undefined) {
      /** apply data */
      selectedDataJson.tags = data.tags;
      selectedDataJson.filePaths = data.filePaths;

      console.log("selectedDataJson:");
      console.log(selectedDataJson);

      if (selectedDataJson.filePaths !== undefined) {
        let imgList: HTMLDataElement[] = Array.from(
          document.querySelectorAll(".imgItem")
        );
        selectedDataJson.filePaths
          .map((path) => {
            // return document.querySelector("[data-address='" + path + "']");
            for (let i = 0; i < imgList.length; i++) {
              if (imgList[i].dataset.address == path) {
                return imgList[i];
              }
            }
            return undefined;
          })
          .forEach((elem) => {
            if (elem !== undefined) {
              elem.classList.add("_selected");
              let check: HTMLInputElement = elem.querySelector(
                ".checkbox input"
              );
              check.checked = true;
              setCount(getCount() + 1);
            }
          });
        console.log("fileSelecter: data Applied.");
      }
      // apply tag
      // apply selected files
    }
  });
});
