// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();
// export {};

interface file {
  // filename: string;
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

/** mode changing functions */

function deleteModeEndButton() {
  // when change tab
  // if exists delete button
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
const datas = (window as any).api.getDataWithUpdate();
let [tags, files] = [datas.tags, datas.files];

console.log("hi this is const require");
console.log(datas);

//////////////////////////////////////////

/**
 *
 * Data
 *
 */

var ftsGlobalData = {
  file: undefined,
  tagObj: undefined,
  loadFile: () => {
    ftsGlobalData.file = (window as any).api.getDataWithUpdate();
    ftsGlobalData.tagObj = ftsGlobalData.file.tags;
  },
  createGroup: () => {},
  createTag: () => {},
};

var ftsAppData = {
  mode: "main",
  changeModeData: (mode: "main" | "newFile") => {},
};

/**
 *
 * UI
 *
 */

/** Main */

function initMain() {
  let fileList = document.getElementById("fileList");
  ftsGlobalData.file.files.forEach((file) => {
    fileList.appendChild(createTagListItem(file));
  });
}

function createTagListItem(fileData: file): HTMLElement {
  let elem = document.createElement("div");
  elem.classList.add("item");
  elem.classList.add("fl-cen-cen");

  let inner = document.createElement("div");
  inner.classList.add("inner");

  let imgDiv = document.createElement("div");
  imgDiv.classList.add("img");
  imgDiv.classList.add("fl-cen-cen");

  let img = document.createElement("img");
  img.src = fileData.address;

  imgDiv.appendChild(img);

  let tagDiv = document.createElement("div");
  tagDiv.classList.add("tag");
  tagDiv.classList.add("fl-cen-cen");

  let tagInner = document.createElement("div");
  tagInner.classList.add("inner");

  tagDiv.appendChild(tagInner);

  inner.appendChild(imgDiv);
  inner.appendChild(tagDiv);

  elem.appendChild(inner);

  return elem;
}

/** changing mode */

function changeModeTo(mode: "main" | "newFile" | "editFile" | "tag"): void {
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
    case "newFile": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_visible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_invisible");
      break;
    }
    case "editFile": {
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
  if (mode === "newFile" || mode === "editFile") {
    addModeEndButton(mode);
  }
}

function addModeEndButton(modeName: "newFile" | "editFile"): void {
  let elem = document.createElement("div");
  elem.addEventListener("click", function () {
    changeModeTo("main");
  });
  document.getElementById("tabBar").appendChild(elem);
}

/**
 *
 * Initial
 *
 */

ftsGlobalData.loadFile();
initMain();

/**
 *
 * Event Listeners
 *
 */

/** window listeners */

window.onbeforeunload = (e) => {
  // flush datas
  (window as any).api.flushConfigFile({ tags, files });
  console.log("Flushed.");
};

/** element listeners */

let openExplorer = document.getElementById("openExplorer");
openExplorer.addEventListener("click", function () {
  (window as any).api.openfileExplorer();
});

let settingCloseButton = document.getElementById("closeButton");
settingCloseButton.addEventListener("click", function () {
  // close
  window.close();
});
