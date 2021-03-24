// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();
// export {};

function goclone(source) {
  // https://stackoverflow.com/a/12690145
  if (Object.prototype.toString.call(source) === "[object Array]") {
    let cloneArr = [];
    for (var i = 0; i < source.length; i++) {
      cloneArr[i] = goclone(source[i]);
    }
    return cloneArr;
  } else if (typeof source == "object") {
    let cloneObj = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        cloneObj[prop] = goclone(source[prop]);
      }
    }
    return cloneObj;
  } else {
    return source;
  }
}

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
  fileArr: undefined,
  tagObj: undefined,
  tagArr: undefined,
  loadFile: () => {
    let file = (window as any).api.getDataWithUpdate();
    ftsGlobalData.fileArr = file.files;
    ftsGlobalData.tagObj = file.tags;
    ftsGlobalData.tagArr = [];
    Object.keys(ftsGlobalData.tagObj).forEach((group) => {
      ftsGlobalData.tagObj[group].forEach((tag) => {
        ftsGlobalData.tagArr.push(tag);
      });
    });
    console.log("from loadFile: ");
    console.log(file);
    console.log(ftsGlobalData.fileArr);
    console.log(ftsGlobalData.tagObj);
  },

  createTag: (tagName) => {
    ftsGlobalData.tagObj.else.push(tagName);
  },
  deleteTag: (tagName) => {
    let tagObj = ftsGlobalData.tagObj;
    let tagArr = ftsGlobalData.tagArr;
    for (let key of Object.keys(tagObj)) {
      for (let tag of tagObj[key]) {
        if (tag == tagName) {
          // remove from tag array
          tagObj[key] = tagObj[key].filter((t) => t !== tagName);
          tagArr = tagArr.filter((t) => t !== tagName);

          // delete tag at files
          let fileArr = ftsGlobalData.fileArr;
          for (let j = 0; j < fileArr.length; j++) {
            for (let k = 0; k < fileArr[j].tags.length; k++) {
              if (fileArr[j].tags[k] == tagName) {
                fileArr[j].tags = fileArr[j].tags.filter((t) => t !== tagName);
              }
            }
          }
        }
      }
    }
  },
  moveTag: (tagName, groupTo) => {
    ftsGlobalData.deleteTag(tagName);
    ftsGlobalData.tagObj[groupTo].push(tagName);
  },
  renameTag: (tagName, changeNameTo) => {
    let tagObj = ftsGlobalData.tagObj;
    let tagArr = ftsGlobalData.tagArr;
    for (let key of Object.keys(tagObj)) {
      for (let i = 0; i < tagObj[key].length; i++) {
        if (tagObj[key][i] == tagName) {
          // change name
          tagObj[key][i] = changeNameTo;
          tagArr = tagArr.filter((t) => t !== tagName);
          tagArr.push(changeNameTo);

          // change all files that have this tag
          let fileArr = ftsGlobalData.fileArr;
          for (let j = 0; j < fileArr.length; j++) {
            for (let k = 0; k < fileArr[j].tags.length; k++) {
              if (fileArr[j].tags[k] == tagName) {
                fileArr[j].tags[k] = changeNameTo;
              }
            }
          }
        }
      }
    }
  },

  createGroup: () => {},

  changeImgItem: (address, tagArr) => {
    let fileArr = ftsGlobalData.fileArr;
    for (let i = 0; i < fileArr.length; i++) {
      if (fileArr[i].address == address) {
        fileArr[i].tags = tagArr;
        break;
      }
    }
  },
  deleteImgItem: (address) => {
    let fileArr = ftsGlobalData.fileArr;
    for (let i = 0; i < fileArr.length; i++) {
      if (fileArr[i].address == address) {
        fileArr.splice(i, 1);
        break;
      }
    }
  },

  get: (address) => {
    let fileArr = ftsGlobalData.fileArr;
    for (let i = 0; i < fileArr.length; i++) {
      if (fileArr[i].address == address) {
        return fileArr[i];
      }
    }
    return null;
  },

  tagIncluding: (string) => {
    return ftsGlobalData.tagArr.filter((tag) => tag.includes(string));
  },
  flushFile: () => {
    (window as any).api.flushConfigFile({
      files: ftsGlobalData.fileArr,
      tags: ftsGlobalData.tagObj,
    });
  },
};

var ftsAppData = {
  mode: "main",
  getModeData: () => {
    return ftsAppData.mode;
  },
  changeModeDataTo: (
    mode: "main" | "newFile" | "editFile" | "tag" | "group"
  ) => {
    ftsAppData.mode = mode;
  },

  newFileTagModeData: {
    files: [],
    index: 0,
    selected: [],
    // doneStack: [],
    initFiles: () => {
      ftsAppData.newFileTagModeData.files = goclone(
        ftsGlobalData.fileArr.filter((file) => file.tags.length == 0)
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
        ftsGlobalData.changeImgItem(file.address, file.tags);
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
    current: undefined,
    setCurrent: (address) => {
      let fileArr = ftsGlobalData.fileArr;
      for (let i = 0; i < fileArr.length; i++) {
        if (fileArr[i].address == address) {
          ftsAppData.editFileModeData.current = fileArr[i];
          break;
        }
      }
    },
    addTag: (tagName) => {
      ftsAppData.editFileModeData.current.tags.push(tagName);
    },
    deleteTag: (tagName) => {
      ftsAppData.editFileModeData.current.tags = ftsAppData.editFileModeData.current.tags.filter(
        (tag) => tag !== tagName
      );
    },
  },

  tagModeData: {
    current: {
      tagName: undefined,
      group: undefined,
    },
    setCurrentData: (tagName, groupName) => {
      ftsAppData.tagModeData.current.tagName = tagName;
      ftsAppData.tagModeData.current.group = groupName;
    },
  },

  groupModeData: {},
};

/**
 *
 * UI
 *
 */

/** changing mode */

function changeModeTo(
  mode: "main" | "newFile" | "editFile" | "tag" | "group"
): void {
  let fileContentMain = document.getElementById("fileContentMain");
  let newFileTagMode = document.getElementById("newFileTagMode");
  let editTagMode = document.getElementById("editTagMode");
  let tagMode = document.getElementById("tagMode");
  let viewList = [fileContentMain, newFileTagMode, editTagMode, tagMode];
  let contentList = [
    document.getElementsByClassName("fileContent")[0],
    document.getElementsByClassName("tagContent")[0],
    document.getElementsByClassName("groupContent")[0],
  ];
  let hrFile = document.getElementById("hrFile");
  let hrTag = document.getElementById("hrTag");

  // visible invisible control
  contentList.forEach((view) => {
    view.classList.remove("_visible");
    view.classList.remove("_invisible");
  });
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

      contentList[0].classList.add("_visible");
      contentList[1].classList.add("_invisible");
      contentList[2].classList.add("_invisible");

      modeQuitButton.classList.add("_invisible");
      modeQuitButton.classList.remove("_visible");
      modeEndButton.classList.add("_invisible");
      modeEndButton.classList.remove("_visible");

      hrFile.classList.remove("_invisible");
      hrTag.classList.add("_invisible");

      // reset newFileTagMode elements
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
      refreshMainItems();
      break;
    }
    case "newFile": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_visible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_invisible");

      contentList[0].classList.add("_visible");
      contentList[1].classList.add("_invisible");
      contentList[2].classList.add("_invisible");

      hrFile.classList.remove("_invisible");
      hrTag.classList.add("_invisible");

      ftsAppData.changeModeDataTo("newFile");

      // mode end button
      addModeEndButton(mode);
      addQuitButton();
      break;
    }
    case "editFile": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_visible");
      viewList[3].classList.add("_invisible");

      contentList[0].classList.add("_visible");
      contentList[1].classList.add("_invisible");
      contentList[2].classList.add("_invisible");

      hrFile.classList.remove("_invisible");
      hrTag.classList.add("_invisible");

      ftsAppData.changeModeDataTo("editFile");

      // mode end button
      addModeEndButton(mode);

      refreshEditItems();
      break;
    }
    case "tag": {
      viewList[0].classList.add("_invisible");
      viewList[1].classList.add("_invisible");
      viewList[2].classList.add("_invisible");
      viewList[3].classList.add("_visible");

      contentList[0].classList.add("_invisible");
      contentList[1].classList.add("_visible");
      contentList[2].classList.add("_invisible");

      modeQuitButton.classList.add("_invisible");
      modeQuitButton.classList.remove("_visible");
      modeEndButton.classList.add("_invisible");
      modeEndButton.classList.remove("_visible");

      hrFile.classList.add("_invisible");
      hrTag.classList.remove("_invisible");

      ftsAppData.changeModeDataTo("tag");

      refreshTagMode();
      break;
    }
    case "group": {
    }
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

function addQuitButton(): void {
  let elem = document.getElementById("modeQuitButton");
  elem.classList.remove("_invisible");
  elem.classList.add("_visible");
}

/** Main */

function initMain() {
  // let fileList = Array.from(document.getElementsByClassName("fileList"));
  refreshMainItems();

  document.querySelector(
    "#fileContentMain .list .li .left p"
  ).innerHTML = (window as any).api.getCroquisFolderPath();
}

function refreshMainItems() {
  let fileListMain = document.getElementById("fileListMain");
  while (fileListMain.firstChild) {
    fileListMain.firstChild.remove();
  }
  ftsGlobalData.fileArr.forEach((file) => {
    fileListMain.appendChild(createTagListItem(file, "main"));
  });
}

function createTagListItem(fileData: file, mode: "main" | "edit"): HTMLElement {
  let elem = document.createElement("div");
  elem.classList.add("item");
  elem.classList.add("fl-cen-cen");
  elem.dataset.address = fileData.address;

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

  let tagtxt = document.createElement("span");
  tagtxt.innerHTML = fileData.tags.join(", ");

  tagInner.appendChild(tagtxt);

  tagDiv.appendChild(tagInner);

  inner.appendChild(imgDiv);
  inner.appendChild(tagDiv);

  elem.appendChild(inner);

  if (mode == "edit") {
    elem.addEventListener("click", function () {
      Array.from(
        document.querySelectorAll("#fileListEdit .item._selected")
      ).forEach((elem) => {
        elem.classList.remove("_selected");
      });

      elem.classList.add("_selected");
      editfileModeShowBoard(fileData.address);
    });
  }

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

/** editFile */

function refreshEditItems() {
  let fileListEdit = document.getElementById("fileListEdit");
  while (fileListEdit.firstChild) {
    fileListEdit.firstChild.remove();
  }
  ftsGlobalData.fileArr.forEach((file) => {
    fileListEdit.appendChild(createTagListItem(file, "edit"));
  });
}

function editfileModeShowBoard(address) {
  function createCurrTagItem(tagName) {
    let elem = document.createElement("div");
    elem.classList.add("item");
    elem.classList.add("fl-cen-cen");
    elem.dataset.tagName = tagName;

    let inner = document.createElement("div");
    inner.classList.add("inner");
    inner.classList.add("fl-row-st");

    let txt = document.createElement("span");
    txt.innerHTML = tagName;

    let btnDiv = document.createElement("div");
    btnDiv.classList.add("button");
    btnDiv.classList.add("fl-cen-cen");
    btnDiv.addEventListener("click", function () {
      elem.remove();
      ftsAppData.editFileModeData.deleteTag(elem.dataset.tagName);
      updateItem(ftsAppData.editFileModeData.current.address);
      console.log("now current is :");
      console.log(ftsAppData.editFileModeData.current);
    });

    let img = document.createElement("img");
    img.src = "../../../assets/icons/close.svg";

    btnDiv.appendChild(img);

    inner.appendChild(txt);
    inner.appendChild(btnDiv);

    elem.appendChild(inner);

    return elem;
  }

  // flow start
  let img = <HTMLImageElement>document.getElementById("editModeImg");
  img.src = address;

  let currTagList = document.getElementById("editModeCurrTagList");
  // remove existing tags
  while (currTagList.firstChild) {
    currTagList.firstChild.remove();
  }
  ftsAppData.editFileModeData.setCurrent(address);
  console.log("now current is :");
  console.dir(ftsAppData.editFileModeData.current);
  ftsAppData.editFileModeData.current.tags.forEach((tag) => {
    currTagList.appendChild(createCurrTagItem(tag));
  });
}

function updateItem(address) {
  let list = document.getElementById("fileListEdit");
  let curr = ftsAppData.editFileModeData.current;
  console.log("path: ");
  console.log(address);
  console.log("joined path:");
  console.log((window as any).api.joinPath(address));
  let elems = document.querySelectorAll("#fileListEdit .item");
  for (let i = 0; i < elems.length; i++) {
    let currElem = <HTMLElement>elems[i];
    if (currElem.dataset.address == address) {
      currElem.querySelector(
        ".inner .tag .inner span"
      ).innerHTML = curr.tags.join(", ");
      break;
    }
  }
}

/** tag */

function initTagMode() {
  function createOptionItem(groupName) {
    let opt = document.createElement("option");
    opt.value = groupName;
    opt.innerHTML = groupName;
    return opt;
  }

  // flow start
  let select = document.getElementById("groupSelect");
  Object.keys(ftsGlobalData.tagObj).forEach((groupName) => {
    select.appendChild(createOptionItem(groupName));
  });
}

function refreshTagMode() {
  let list = document.getElementById("tagModeList");
  while (list.firstChild) {
    list.firstChild.remove();
  }
  Object.keys(ftsGlobalData.tagObj).forEach((key) => {
    list.appendChild(createTagModeGroupItem(key, ftsGlobalData.tagObj[key]));
  });
}

function createTagModeGroupItem(groupName, tagArr) {
  let elem = document.createElement("details");
  elem.classList.add("groupItem");
  elem.dataset.groupName = groupName;

  let summ = document.createElement("summary");
  summ.classList.add("fl-row-st");

  let groupImg = document.createElement("img");
  groupImg.src = "../../../assets/icons/group.svg";

  let groupNameSpan = document.createElement("span");
  groupNameSpan.classList.add("groupName");
  groupNameSpan.classList.add("fl-row-st");
  groupNameSpan.appendChild(document.createTextNode(groupName + "  "));

  let count = document.createElement("div");
  count.classList.add("count");
  count.innerHTML = `- ${ftsGlobalData.tagObj[groupName].length} tags`;

  groupNameSpan.appendChild(count);

  let arrowImg = document.createElement("img");
  arrowImg.src = "../../../assets/icons/arrowDown.svg";

  summ.appendChild(groupImg);
  summ.appendChild(groupNameSpan);
  summ.appendChild(arrowImg);

  elem.appendChild(summ);

  ftsGlobalData.tagObj[groupName].forEach((tag) => {
    elem.appendChild(createTagModeTagItem(tag));
  });

  return elem;
}

function createTagModeTagItem(tagName) {
  let elem = document.createElement("div");
  elem.classList.add("tagItem");
  elem.classList.add("fl-row-st");
  elem.dataset.tagName = tagName;

  let span = document.createElement("span");
  span.classList.add("tagName");
  span.innerHTML = tagName;

  elem.appendChild(span);

  elem.addEventListener("click", function () {
    let parent = <HTMLElement>elem.parentNode;
    let [tagName, groupName] = [elem.dataset.tagName, parent.dataset.groupName];
    changeTagModeCurrBoard(tagName, groupName);
    ftsAppData.tagModeData.setCurrentData(tagName, groupName);
  });

  return elem;
}

function changeTagModeCurrBoard(tagName, groupName) {
  console.log("from changeTagModeCurrboard : tagName and groupName is =>");
  console.log(tagName + ", " + groupName);
  currentTagSpan.innerHTML = tagName;
  let select: HTMLSelectElement = document.querySelector("select#groupSelect");
  select.value = groupName;
  console.log("now value is : " + select.value);
}

function changeGroupCount(groupName, count) {}

/** group */

/**
 *
 * Initial
 *
 */

ftsGlobalData.loadFile();
initMain();
initTagMode();

/**
 *
 * Event Listeners
 *
 */

/** window listeners */

window.onbeforeunload = (e) => {
  // flush datas
  // (window as any).api.flushConfigFile({
  //   files: ftsGlobalData.fileArr,
  //   tags: ftsGlobalData.tagObj,
  // });
  ftsGlobalData.flushFile();

  // console.log("Flushed.");
  // console.dir({
  //   files: ftsGlobalData.fileArr,
  //   tags: ftsGlobalData.tagObj,
  // });

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
  let searchResult = ftsGlobalData.tagIncluding(newfiletagInput.value);
  // remove all childs
  let parent = document.getElementById("tagList");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  // add selected tags to tagList
  let selectedArr = ftsAppData.newFileTagModeData.selected;
  selectedArr.forEach((tag) => {
    parent.appendChild(createNewFileModeTagListItem(tag, true));
  });
  // add input matching tags to tagList
  searchResult
    .filter((tag) => !selectedArr.includes(tag))
    .forEach((tag) => {
      parent.appendChild(createNewFileModeTagListItem(tag));
    });
});

//

let tagEditModeBtn = document.getElementById("tagEditModeBtn");
tagEditModeBtn.addEventListener("click", function () {
  changeModeTo("editFile");
});

// tag Mode

let currentTagSpan = document.querySelector("#currentTag .inner .txt span");
let currentTagInput: HTMLInputElement = document.querySelector(
  "#currentTag .inner .txt input"
);
let groupSelect = <HTMLSelectElement>document.getElementById("groupSelect");

let editTagName = document.getElementById("editTagName");
editTagName.addEventListener("click", function () {
  editTagName.classList.remove("_visible");
  editTagName.classList.add("_invisible");
  editTagNameSubmit.classList.remove("_invisible");
  editTagNameSubmit.classList.add("_visible");
  currentTagSpan.classList.remove("_visible");
  currentTagSpan.classList.add("_invisible");
  currentTagInput.classList.remove("_invisible");
  currentTagInput.classList.add("_visible");
  currentTagInput.value = currentTagSpan.innerHTML;
});

let editTagNameSubmit = document.getElementById("editTagNameSubmit");
editTagNameSubmit.addEventListener("click", function () {
  editTagName.classList.remove("_invisible");
  editTagName.classList.add("_visible");
  editTagNameSubmit.classList.remove("_visible");
  editTagNameSubmit.classList.add("_invisible");
  currentTagSpan.classList.remove("_invisible");
  currentTagSpan.classList.add("_visible");
  currentTagInput.classList.remove("_visible");
  currentTagInput.classList.add("_invisible");
  ftsGlobalData.renameTag(
    ftsAppData.tagModeData.current.tagName,
    currentTagInput.value
  );
  ftsAppData.tagModeData.current.tagName = currentTagInput.value;
  currentTagSpan.innerHTML = currentTagInput.value;
  refreshTagMode();
});

let tagMoveGroup = document.getElementById("tagMoveGroup");
tagMoveGroup.addEventListener("click", function () {
  ftsGlobalData.moveTag(
    ftsAppData.tagModeData.current.tagName,
    groupSelect.value
  );
  console.log("from tagMoveGroup:");
  console.log(
    `change group from ${ftsAppData.tagModeData.current.tagName} to ${groupSelect.value}`
  );
  ftsAppData.tagModeData.current.group = groupSelect.value;
  refreshTagMode();
});

let deleteTag = document.getElementById("deleteTag");
deleteTag.addEventListener("click", function () {
  ftsGlobalData.deleteTag(ftsAppData.tagModeData.current.tagName);
  ftsAppData.tagModeData.current = {
    tagName: undefined,
    group: undefined,
  };

  changeTagModeCurrBoard("없음", "else");
  refreshTagMode();
});

let tagModeInput: HTMLInputElement = document.querySelector(
  "input#tagModeInput"
);
tagModeInput.addEventListener("input", function () {
  console.log("inputchanged!!!");
  if (tagModeInput.value == "") {
    refreshTagMode();
  } else {
    let tagModeList = document.getElementById("tagModeList");
    while (tagModeList.firstChild) {
      tagModeList.firstChild.remove();
    }
    ftsGlobalData.tagIncluding(tagModeInput.value).forEach((tag) => {
      tagModeList.appendChild(createTagModeTagItem(tag));
    });
  }
});

let addTag = document.getElementById("addTag");
addTag.addEventListener("click", function () {
  ftsGlobalData.createTag(tagModeInput.value);

  refreshTagMode();
});

//

let fileTab = document.getElementById("fileTab");
fileTab.addEventListener("click", function () {
  changeModeTo("main");
});

let tagTab = document.getElementById("tagTab");
tagTab.addEventListener("click", function () {
  changeModeTo("tag");
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
  // (window as any).api.flushConfigFile({
  //   files: ftsGlobalData.fileArr,
  //   tags: ftsGlobalData.tagObj,
  // });
  // ftsGlobalData.flushFile();
  // console.log("Flushed.");
  // console.dir({
  //   files: ftsGlobalData.fileArr,
  //   tags: ftsGlobalData.tagObj,
  // });
  if (ftsAppData.getModeData() == "newFile") {
    ftsAppData.newFileTagModeData.apply();
    console.log("new files applied.");
  }
  (window as any).api.openApp("initPage", 25);
  window.close();
});
