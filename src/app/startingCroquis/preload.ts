import { appName } from "../../types/main";

const { contextBridge, ipcRenderer } = require("electron");

let fileSelected: boolean = false;
let selectedData = {
  files: [],
  tags: {
    have: [],
    notHave: [],
  },
};

contextBridge.exposeInMainWorld("api", {
  openApp: (appName: appName, delay: number, parent: appName, data: object) => {
    if (
      (appName == "initPage" ||
        appName == "Croquis" ||
        appName == "fileSelecter" ||
        appName == "filetagSetting" ||
        appName == "startingCroquis") &&
      (parent == "initPage" ||
        parent == "Croquis" ||
        parent == "fileSelecter" ||
        parent == "filetagSetting" ||
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
  ipcRenderer.on("selectedFiles", (event, data) => {
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
    let [have, notHave, fileCount] = [
      document.getElementById("tagHave"),
      document.getElementById("tagNotHave"),
      document.getElementById("fileCount"),
    ];
    if (selectedData === undefined) {
      console.log("ERR at applySelectedFileUI : selectedData is undefined");
    } else {
      have.querySelector("div .text").innerHTML = selectedData.tags.have.join(
        ", "
      );

      // console.log("have");
      // console.log(selectedData.tags.have);
      // console.log("notHave");
      // console.log(selectedData.tags.notHave);
      let count = selectedData.files.length;
      notHave.querySelector(
        "div .text"
      ).innerHTML = selectedData.tags.notHave.join(", ");
      fileCount.querySelector("div .count").innerHTML = count.toString();
      let goal: HTMLInputElement = document.querySelector("#goalSetting input");
      goal.value = count.toString();
      let inp: HTMLInputElement = document.querySelector(
        "#goalSetting .detail input"
      );
      inp.max = count.toString();
    }
  }
});
