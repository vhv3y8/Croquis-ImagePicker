import { appName } from "../../types/main";

const { contextBridge, ipcRenderer } = require("electron");

let fileSelected: boolean = false;
let selectedData: selectedFilesTags = {
  filePaths: [],
  tags: {
    must: [],
    atleast: [],
  },
};

contextBridge.exposeInMainWorld("api", {
  openApp: (appName: appName, delay: number, parent: appName, data: object) => {
    if (
      (appName == "initPage" ||
        appName == "Croquis" ||
        appName == "fileSelecter" ||
        appName == "fileSetting" ||
        appName == "startingCroquis") &&
      (parent == "initPage" ||
        parent == "Croquis" ||
        parent == "fileSelecter" ||
        parent == "fileSetting" ||
        parent == "startingCroquis" ||
        parent == undefined)
    ) {
      ipcRenderer.send("openApp", appName, delay, parent, data);
    } else {
      console.log("not a existing appname.");
    }
  },

  setSelectedData: (data) => {
    selectedData = data;
  },
  getSelectedData: () => {
    return selectedData;
  },

  setFileSelected: (bool) => {
    if (typeof bool == "boolean") {
      fileSelected = bool;
    }
  },
  getFileSelected: () => {
    return fileSelected;
  },
});

window.addEventListener("DOMContentLoaded", function () {
  /** usage : when opening fileSelecter, if this value is true, than give selected file data that is already existing. */

  // ipcRenderer functions
  ipcRenderer.on("selectedFiles", (event, data: selectedFilesTags) => {
    if (data === null) {
      // closed with X button
      // closing value null is needed to change opacity to 1..
    } else {
      console.log("selectedFiles:");
      console.log(data);
      selectedData = data;
      fileSelected = true;

      applySelectedFileUI();
    }
    document.getElementById("main").style.opacity = "1";
  });

  function applySelectedFileUI(): void {
    let [must, atleast, fileCount] = [
      document.getElementById("tagMust"),
      document.getElementById("tagAtleast"),
      document.getElementById("fileCount"),
    ];
    if (selectedData === undefined) {
      console.log("ERR at applySelectedFileUI : selectedData is undefined");
    } else {
      must.querySelector("div .text").innerHTML = selectedData.tags.must.join(
        ", "
      );
      atleast.querySelector(
        "div .text"
      ).innerHTML = selectedData.tags.atleast.join(", ");
      fileCount.querySelector(
        "div .count"
      ).innerHTML = selectedData.filePaths.length.toString();
      let goal: HTMLInputElement = document.querySelector("#goalSetting input");
      goal.value = selectedData.filePaths.length.toString();
    }
  }
});
