var { ipcRenderer, shell } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();
var {
  getConfigFile,
  flushConfigFile,
  updateFiles,
} = require("../../database/databaseFs");
var path = require("path");

interface file {
  filename: string;
  tags: string[];
  address: string;
}

// interface tagDB {
//   [tagNum: number]: string;
// }

// interface dbFile {
//   files: file[];
//   tags: tagDB;
// }

/** set event listeners */

let openExplorer = document.getElementById("openExplorer");
openExplorer.addEventListener("click", function () {
  shell.openPath(
    path.join(
      process.env.HOME || process.env.USERPROFILE,
      "Downloads",
      "Croquis"
    )
  );
});

let settingCloseButton = document.getElementById("closeButton");
settingCloseButton.addEventListener("click", function () {
  // close
  win.close();
});

/** mode changing functions */

function addModeEndButton(modeName: "new" | "edit"): void {
  let elem = document.createElement("div");
  elem.addEventListener("click", function () {
    changeModeTo("main");
  });
  document.getElementById("tabBar").appendChild(elem);
}

function deleteModeEndButton() {
  // when change tab
  // if exists delete button
}

function changeModeTo(mode: "main" | "new" | "edit" | "tag"): void {
  let fileContentMain = document.getElementById("fileContentMain");
  let newFileTagMode = document.getElementById("newFileTagMode");
  let editTagMode = document.getElementById("editTagMode");
  let tagContent = document.getElementById("tagContent");
  let viewList = [fileContentMain, newFileTagMode, editTagMode, tagContent];

  // visible invisible control
  viewList.forEach((view) => {
    view.classList.remove("_visible");
    view.classList.remove("_invisible");
  });

  switch (mode) {
    case "main": {
      viewList[0].classList.add("_visible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_invisible");
      break;
    }
    case "new": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_visible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_invisible");
      break;
    }
    case "edit": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_visible");
      viewList[3].classList.add("_invisible");
      break;
    }
    case "tag": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_visible");
      break;
    }
  }

  // mode end button
  if (mode === "new" || mode === "edit") {
    addModeEndButton(mode);
  }
}

/** New Tag Mode functions */
let newFileList;
let currFile;

// ui funcion about file
function showFile(file: file) {
  // show image
  // show tag -> delete data when click it
}

// tag Board
let tagListView = document.getElementById("tagList");
let newInputTag = document.querySelector("#tagInput input");
newInputTag.addEventListener("input", function () {});

/** Edit Tag Mode functions */

/** Tag Tab functions */

/** flow start */
const datas = updateFiles(getConfigFile());
let [tags, files] = [datas.tags, datas.files];

console.log("hi this is const require");
console.log(datas);

window.onbeforeunload = (e) => {
  // flush datas
  flushConfigFile({ tags, files });
  console.log("Flushed.");
  console.log(getConfigFile());
  // ipcRenderer.send("openApp", "Croquis", 25);
  e.returnValue = false;
};
