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
// const datas = (window as any).api.getDataWithUpdate();
// let [tags, files] = [datas.tags, datas.files];

// console.log("hi this is const require");
// console.log(datas);

//////////////////////////////////////////

/**
 *
 * Data
 *
 */

var ftsGlobalData = {
  file: undefined,
  fileArr: undefined,
  tagObj: undefined,
  tagArr: undefined,
  loadFile: () => {
    ftsGlobalData.file = (window as any).api.getDataWithUpdate();
    ftsGlobalData.fileArr = ftsGlobalData.file.files;
    ftsGlobalData.tagObj = ftsGlobalData.file.tags;
    ftsGlobalData.tagArr = [];
    Object.keys(ftsGlobalData.tagObj).forEach((group) => {
      ftsGlobalData.tagObj[group].forEach((tag) => {
        ftsGlobalData.tagArr.push(tag);
      });
    });
    console.log("from loadFile: ");
    console.log(ftsGlobalData.file);
    console.log(ftsGlobalData.fileArr);
    console.log(ftsGlobalData.tagObj);
  },
  createGroup: () => {},
  createTag: () => {},

  changeFile: (address, fileObj) => {},
  deleteFile: (address) => {},

  tagIncluding: (string) => {
    // let arr = [];

    // Object.keys(ftsGlobalData.tagObj).forEach((group) => {
    //   ftsGlobalData.tagObj[group].forEach((tag) => {
    //     if (tag.includes(string)) {
    //       arr.push(tag);
    //     }
    //   });
    // });

    // return arr;
    return ftsGlobalData.tagArr.filter((tag) => tag.includes(string));
  },
};

var ftsAppData = {
  mode: "main",
  getModeData: () => {
    return ftsAppData.mode;
  },
  changeModeDataTo: (mode: "main" | "newFile" | "editFile" | "tag") => {
    ftsAppData.mode = mode;
  },

  newFileTagModeData: {
    files: [],
    index: 0,
    selected: [],
    // doneStack: [],
    initFiles: () => {
      ftsAppData.newFileTagModeData.files = ftsGlobalData.fileArr.filter(
        (file) => file.tags.length == 0
      );
      console.log("new Files array :");
      console.log(ftsAppData.newFileTagModeData.files);
    },
    getCurrent: () => {
      return ftsAppData.newFileTagModeData.files[
        ftsAppData.newFileTagModeData.index
      ];
    },
    hasTag: (tagName) => {
      return ftsAppData.newFileTagModeData.getCurrent().tags.includes(tagName);
    },
    addTag: (tagName) => {
      ftsAppData.newFileTagModeData.getCurrent().tags.push(tagName);
      console.log("from addTag: ");
      console.log(ftsGlobalData.fileArr);
      console.log(ftsGlobalData.tagObj);
    },
    deleteTag: (tagName) => {
      ftsAppData.newFileTagModeData.getCurrent().tags = ftsAppData.newFileTagModeData
        .getCurrent()
        .tags.filter((tag) => tag !== tagName);
    },
    selectTag: (tagName) => {
      ftsAppData.newFileTagModeData.selected.push(tagName);
    },
    unselectTag: (tagName) => {
      ftsAppData.newFileTagModeData.selected = ftsAppData.newFileTagModeData.selected.filter(
        (tag) => tag !== tagName
      );
    },
    refreshSelected: () => {
      ftsAppData.newFileTagModeData.selected = [];
    },
    apply: () => {
      ftsAppData.newFileTagModeData.files.forEach((file) => {
        ftsGlobalData.changeFile(file.address, file);
      });
    },
    discard: () => {
      ftsAppData.newFileTagModeData.files = [];
      ftsAppData.newFileTagModeData.index = 0;
      console.log("from discard: ");
      console.log(ftsGlobalData.fileArr);
      console.log(ftsGlobalData.tagObj);
    },
  },

  editFileModeData: {
    // apply: () => {},
    // discard: () => {},
  },

  tagModeData: {
    data: {
      tag: {
        new: {},
        delete: {},
        rename: [],
      },
      group: {
        new: {},
        delete: {},
        rename: [],
      },
    },
    // apply: () => {},
    // discard: () => {},
  },
};

/**
 *
 * UI
 *
 */

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

      modeQuitButton.classList.add("_invisible");
      modeQuitButton.classList.remove("_visible");
      modeEndButton.classList.add("_invisible");
      modeEndButton.classList.remove("_visible");
      document.getElementById("prevImg").classList.remove("_unselectable");
      document.getElementById("nextImg").classList.remove("_unselectable");
      let parent = document.getElementById("tagBoard");
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      let parent2 = document.getElementById("tagList");
      while (parent2.firstChild) {
        parent2.firstChild.remove();
      }

      ftsAppData.changeModeDataTo("main");
      break;
    }
    case "newFile": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_visible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_invisible");

      ftsAppData.changeModeDataTo("newFile");
      break;
    }
    case "editFile": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_visible");
      viewList[3].classList.add("_invisible");

      ftsAppData.changeModeDataTo("editFile");
      break;
    }
    case "tag": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_visible");

      ftsAppData.changeModeDataTo("tag");
      break;
    }
  }

  // mode end button
  if (mode === "newFile" || mode === "editFile") {
    addModeEndButton(mode);
    addQuitButton(mode);
  }
}

function addModeEndButton(modeName: "newFile" | "editFile"): void {
  let elem: HTMLElement = document.getElementById("modeEndButton");
  elem.querySelector("p").innerHTML =
    modeName == "newFile" ? "추가 완료하기" : "수정 완료하기";
  elem.dataset.mode = modeName;
  elem.classList.remove("_invisible");
  elem.classList.add("_visible");
}

function addQuitButton(modeName: "newFile" | "editFile"): void {
  let elem = document.getElementById("modeQuitButton");
  elem.classList.remove("_invisible");
  elem.classList.add("_visible");
}

/** Main */

function initMain() {
  let fileList = document.getElementById("fileList");
  ftsGlobalData.fileArr.forEach((file) => {
    fileList.appendChild(createTagListItem(file));
  });

  document.querySelector(
    "#fileContentMain .list .li .left p"
  ).innerHTML = (window as any).api.getCroquisFolderPath();
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

/** newFileTag */

function initNewFileTagMode() {
  ftsAppData.newFileTagModeData.initFiles();

  let img = <HTMLImageElement>document.getElementById("newFileImg");
  img.src = ftsAppData.newFileTagModeData.files[0].address;
  // img.dataset.index = "0";
  document.getElementById("prevImg").classList.add("_unselectable");

  // show all tags
  let parent = document.getElementById("tagList");
  ftsGlobalData.tagArr.forEach((tag) => {
    parent.appendChild(createNewFileModeTagListItem(tag));
  });
}

function newfiletagImgTo(to: "prev" | "next") {
  let img = <HTMLImageElement>document.getElementById("newFileImg");
  // let idx = parseInt(img.dataset.index);
  let idx = ftsAppData.newFileTagModeData.index;

  console.log("newFileTagImg to : " + to);

  if (to == "prev" && idx > 0) {
    idx--;
    ftsAppData.newFileTagModeData.index--;
  } else if (
    to == "next" &&
    idx < ftsAppData.newFileTagModeData.files.length - 1
  ) {
    idx++;
    ftsAppData.newFileTagModeData.index++;
  }

  img.src = ftsAppData.newFileTagModeData.files[idx].address;
  // img.dataset.index = idx.toString();
  // show tags
  let parent = document.getElementById("tagBoard");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
  ftsAppData.newFileTagModeData.files[idx].tags.forEach((tag) => {
    parent.appendChild(createNewFileTagItem(tag));
  });

  if (idx == 0) {
    document.getElementById("prevImg").classList.add("_unselectable");
  } else if (idx == ftsAppData.newFileTagModeData.files.length - 1) {
    document.getElementById("nextImg").classList.add("_unselectable");
  }

  console.log("now index is :" + ftsAppData.newFileTagModeData.index);
}

function createNewFileTagItem(tagName): HTMLElement {
  let elem = document.createElement("div");
  elem.dataset.tagName = tagName;
  elem.classList.add("item");
  elem.classList.add("fl-row-st");

  let txt = document.createElement("span");
  txt.innerHTML = tagName;

  let img = document.createElement("img");
  img.src = "../../../assets/icons/close.svg";

  elem.appendChild(txt);
  elem.appendChild(img);

  elem.addEventListener("click", function () {
    ftsAppData.newFileTagModeData.deleteTag(elem.dataset.tagName);
    console.log("deleted tag. now current is : ");
    console.dir(ftsAppData.newFileTagModeData.getCurrent());
    elem.remove();
  });

  return elem;
}

function createNewFileModeTagListItem(
  tagName: string,
  checked: boolean = false
): HTMLElement {
  let elem = document.createElement("div");
  elem.classList.add("item");
  elem.classList.add("fl-row-st");
  elem.dataset.tagName = tagName;

  let input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.checked = checked;

  let txt = document.createElement("span");
  txt.innerHTML = tagName;

  elem.appendChild(input);
  elem.appendChild(txt);

  elem.addEventListener("click", function () {
    let input = elem.querySelector("input");
    input.checked = !input.checked;

    if (input.checked) {
      ftsAppData.newFileTagModeData.selectTag(elem.dataset.tagName);
      elem.classList.add("_selected");
    } else {
      ftsAppData.newFileTagModeData.unselectTag(elem.dataset.tagName);
      elem.classList.remove("_selected");
    }
  });

  return elem;
}

function newFileModeUncheckAllTagItem(): void {
  document.querySelectorAll("#tagList ._selected").forEach((elem) => {
    elem.querySelector("input").checked = false;
    elem.classList.remove("_selected");
  });
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
  if (ftsAppData.getModeData() == "newFile") {
    ftsAppData.newFileTagModeData.apply();
    console.log("new files applied.");
  }
  // flush datas
  (window as any).api.flushConfigFile({
    files: ftsGlobalData.fileArr,
    tags: ftsGlobalData.tagObj,
  });
  console.log("Flushed.");
  console.dir({
    files: ftsGlobalData.fileArr,
    tags: ftsGlobalData.tagObj,
  });

  // e.returnValue = false;
  return null;
};

/** element listeners */

let modeQuitButton = document.getElementById("modeQuitButton");
modeQuitButton.addEventListener("click", function () {
  console.log("modeQuitButton clicked.");
  if (ftsAppData.getModeData() == "newFile") {
    ftsAppData.newFileTagModeData.discard();
  }
  changeModeTo("main");
});

let modeEndButton = document.getElementById("modeEndButton");
modeEndButton.addEventListener("click", function () {
  console.log("modeEndButton clicked.");
  if (ftsAppData.getModeData() == "newFile") {
    ftsAppData.newFileTagModeData.apply();
  }
  changeModeTo("main");
});

// new File Tag Mode

let newFileTagModeBtn = document.getElementById("newFileTagModeBtn");
newFileTagModeBtn.addEventListener("click", function () {
  changeModeTo("newFile");
  initNewFileTagMode();
});

let prevImg = document.getElementById("prevImg");
prevImg.addEventListener("click", function () {
  prevImg.classList.remove("_unselectable");
  nextImg.classList.remove("_unselectable");
  newfiletagImgTo("prev");
  newFileModeUncheckAllTagItem();
});

let nextImg = document.getElementById("nextImg");
nextImg.addEventListener("click", function () {
  prevImg.classList.remove("_unselectable");
  nextImg.classList.remove("_unselectable");
  newfiletagImgTo("next");
  newFileModeUncheckAllTagItem();
});

let tagAddButton = document.getElementById("tagAddButton");
tagAddButton.addEventListener("click", function () {
  let selectedTags = ftsAppData.newFileTagModeData.selected;

  selectedTags.forEach((tag) => {
    if (!ftsAppData.newFileTagModeData.hasTag(tag)) {
      // push data
      ftsAppData.newFileTagModeData.addTag(tag);
      // apply ui
      document
        .getElementById("tagBoard")
        .appendChild(createNewFileTagItem(tag));
    }
  });
  console.log("from tag Add Button: now current data from new-.files is => ");
  console.dir(ftsAppData.newFileTagModeData.getCurrent());
  console.dir(ftsAppData.newFileTagModeData.files);

  ftsAppData.newFileTagModeData.refreshSelected();
  newFileModeUncheckAllTagItem();
});

let newfiletagInput: HTMLInputElement = document.querySelector(
  "#tagInput input"
);
newfiletagInput.addEventListener("input", function () {
  let result = ftsGlobalData.tagIncluding(newfiletagInput.value);
  // remove all childs
  let parent = document.getElementById("tagList");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  // add selected tags to tagList
  ftsAppData.newFileTagModeData.selected.forEach((tag) => {
    parent.appendChild(createNewFileModeTagListItem(tag, true));
  });
  // add input matching tags to tagList
  result.forEach((tag) => {
    parent.appendChild(createNewFileModeTagListItem(tag));
  });
});

//

let tagEditModeBtn = document.getElementById("tagEditModeBtn");
tagEditModeBtn.addEventListener("click", function () {
  changeModeTo("editFile");
});

let openExplorer = document.getElementById("openExplorer");
openExplorer.addEventListener("click", function () {
  (window as any).api.openfileExplorer();
});

let settingCloseButton = document.getElementById("closeButton");
settingCloseButton.addEventListener("click", function () {
  // close
  window.close();
});

let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function () {
  // if (ftsAppData.getModeData() == "newFile") {
  //   ftsAppData.newFileTagModeData.apply();
  //   console.log("new files applied.");
  // }
  // flush datas
  (window as any).api.flushConfigFile({
    files: ftsGlobalData.fileArr,
    tags: ftsGlobalData.tagObj,
  });
  console.log("Flushed.");
  console.dir({
    files: ftsGlobalData.fileArr,
    tags: ftsGlobalData.tagObj,
  });

  // (window as any).api.openApp("initPage", 25);
  // window.close();
});
