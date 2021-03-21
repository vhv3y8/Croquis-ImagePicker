// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();
// var path = require("path");

// var { tagNumToString } = require("../../database/fileTag");

/** initialize types */

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
//   tags: string[];
// }

interface selectedFilesTags {
  filePaths: string[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

/** flow start */

/** Data */

// initialize datas to use in this app
// let configFileData = updateFiles(getConfigFile());
let configFileData = (window as any).api.getDataWithUpdate();
let tagList = configFileData.tags;
let selectedDataJson = {
  filePaths: [],
  tags: {
    must: [],
    atleast: [],
  },
};
let hideSelected: boolean = false;

console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
console.log(configFileData);
console.log(tagList);

// configFileData.tags.atleast.forEach((tag) => {
//   document.getElementById("searchContent").appendChild(tagListItem(tag));
// });

function getSelected() {
  /** 선택된 파일 UI들을 리턴 */
  let toreturn = document.querySelectorAll(".imgItem._selected");
  console.log(toreturn);
  return toreturn;
}

function applySelectedTags(): void {
  /** 앱데이터의 태그 데이터에 기반하여 적용 */
  // remove all selected
  getSelected().forEach((elem) => {
    elem.classList.remove("_selected");
    let inEl: HTMLInputElement = elem.querySelector(".checkbox input");
    inEl.checked = false;
  });

  // apply tag
  let filesToSelect = configFileData.files;
  console.log(filesToSelect);
  if (selectedDataJson.tags.must.length > 0) {
    filesToSelect = filesToSelect.filter((file) =>
      selectedDataJson.tags.must.every((tag) => file.tags.includes(tag))
    );
    console.log("has must tag. now filesToSelect is :");
    console.log(filesToSelect);
  }
  if (selectedDataJson.tags.atleast.length > 0) {
    filesToSelect = filesToSelect.filter((file) =>
      selectedDataJson.tags.atleast.some((tag) => file.tags.includes(tag))
    );
    console.log("has at least tag. now filesToSelect is :");
    console.log(filesToSelect);
  }
  filesToSelect = filesToSelect.map((file) => {
    return file.address;
  });

  if (
    selectedDataJson.tags.must.length === 0 &&
    selectedDataJson.tags.atleast.length === 0
  ) {
    filesToSelect = [];
  }
  console.log("files to select: ");
  console.log(filesToSelect);
  console.log(configFileData.files);
  filesToSelect.forEach((path) => {
    let input: HTMLInputElement = document
      .querySelector(`[data-address='${path}']`)
      .querySelector(".checkbox input");
    input.checked = true;
    document
      .querySelector(`[data-address='${path}']`)
      .classList.add("_selected");
  });
  setCount(getSelected().length);
}

///////////////////////////////////////////////////////////////////////////////

/*
 *
 * Data
 *
 */

/** GlobalData - global */

var GlobalData = {
  file: undefined,
  tagObj: undefined,
  loadFile: () => {
    GlobalData.file = (window as any).api.getDataWithUpdate();
    GlobalData.tagObj = GlobalData.file.tags;
  },
};

/** AppData - local */

let RendererData = {
  selectedTags: undefined,
  addHaveTags: (
    ...tags: {
      name: string;
      group: string;
    }[]
  ) => {
    tags.forEach((tag) => {
      RendererData.selectedTags[tag.group].have.push(tag.name);
    });
    console.log("addHaveTags: now RendererData.selectedTags is");
    console.log(RendererData.selectedTags);
  },
  addNotHaveTags: (
    ...tags: {
      name: string;
      group: string;
    }[]
  ) => {
    tags.forEach((tag) => {
      RendererData.selectedTags[tag.group].notHave.push(tag.name);
    });
    console.log("addNotHaveTags: now RendererData.selectedTags is");
    console.log(RendererData.selectedTags);
  },
  removeTags: (
    ...tags: {
      name: string;
      group: string;
    }[]
  ) => {
    tags.forEach((tag) => {
      if (RendererData.selectedTags[tag.group].have.includes(tag.name)) {
        RendererData.selectedTags[tag.group].have = RendererData.selectedTags[
          tag.group
        ].have.filter((x) => x !== tag.name);
      } else {
        RendererData.selectedTags[
          tag.group
        ].notHave = RendererData.selectedTags[tag.group].have.filter(
          (x) => x !== tag.name
        );
      }
    });
    console.log("removeTags: now RendererData.selectedTags is");
    console.log(RendererData.selectedTags);
  },

  selectedImgCount: 0,
  imgCountPlus: () => {
    RendererData.selectedImgCount++;
  },
  imgCountMinus: () => {
    RendererData.selectedImgCount--;
  },
  setImgCount: (num: number) => {
    RendererData.selectedImgCount = num;
  },
  getSelectedImgs: () => {},

  init: () => {
    /** Copy keys of tagObj, create key have, notHave to each */
    RendererData.selectedTags = {};
    Object.keys(GlobalData.tagObj).forEach(
      (key) => (RendererData.selectedTags[key] = { have: [], notHave: [] })
    );
  },
};

function getCount(): number {
  /** 선택된 파일 개수 */
  return parseInt(document.querySelector("span.count").innerHTML);
}

function setCount(num: number) {
  /** 선택된 파일 개수 출력 */
  document
    .querySelectorAll("span.count")
    .forEach((elem) => (elem.innerHTML = num.toString()));
}

////

function selectTag(tagname: string, where: "must" | "atleast"): boolean {
  /** 선택된 태그를 앱 데이터에 추가 */
  if (selectedDataJson.tags[where].includes(tagname)) {
    return false;
  } else {
    selectedDataJson.tags[where].push(tagname);
    return true;
  }
}

function removeTag(tagname: string, where: "must" | "atleast") {
  /** 선택된 태그 데이터를 앱데이터에서 삭제 */
  selectedDataJson.tags[where] = selectedDataJson.tags[where].filter(
    (tag) => tag !== tagname
  );
}

/*
 *
 * UI - create-delete-modify function for each element
 *
 */

/** folder name and open */

document.querySelector(
  "#showFolder p"
).innerHTML = `${(window as any).api.getCroquisFolderPath()}`;

/** imgList and imgItem */

let imgBody = document.getElementById("imgListBody");
configFileData.files.forEach((file) => {
  /** CroquisData.json에서 불러온 데이터를 기반으로 이미지 리스트에 이미지 아이템 모두 추가 */
  imgBody.appendChild(createImgItem(file));
});

function createImgItem(data: file): HTMLElement {
  /** 사진 리스트에 추가될 아이템 UI 생성 */
  let elem: HTMLElement = document.createElement("div");
  elem.classList.add("imgItem");
  elem.dataset.address = data.address;
  elem.classList.add("fl-cen-cen");

  let cont = document.createElement("div");
  cont.classList.add("cont");

  let checkboxDiv = document.createElement("div");
  checkboxDiv.classList.add("checkbox");
  checkboxDiv.classList.add("fl-row-st");
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = false;
  checkboxDiv.appendChild(checkbox);

  let imgDiv = document.createElement("div");
  imgDiv.classList.add("image");
  imgDiv.classList.add("fl-cen-cen");
  let img = document.createElement("img");
  img.src = data.address;
  img.style.maxHeight = "120px";
  img.style.maxWidth = "140px";
  imgDiv.appendChild(img);

  let tagsDiv = document.createElement("div");
  tagsDiv.classList.add("tags");
  tagsDiv.innerHTML = data.tags.join(", ");

  cont.appendChild(checkboxDiv);
  cont.appendChild(imgDiv);
  cont.appendChild(tagsDiv);
  elem.appendChild(cont);

  elem.addEventListener("click", function () {
    let check: HTMLInputElement = elem.querySelector(".checkbox input");
    console.log(check);
    console.log(check.checked);
    // check.checked = !check.checked;
    if (check.checked === false) {
      check.checked = true;
      elem.classList.add("_selected");
      RendererData.imgCountPlus();
    } else {
      check.checked = false;
      elem.classList.remove("_selected");
      RendererData.imgCountMinus();
    }
  });
  return elem;
}

/** tagBoard and tagBoardItem */

function createTagBoardItem(tagname: string, where: "must" | "atleast") {
  /** 태그 보드에 태그 UI 만들어서 추가 */
  let tagUiElem = document.createElement("div");
  tagUiElem.classList.add("tagItem");
  tagUiElem.classList.add("fl-row-st");

  let tagText = document.createElement("p");
  tagText.innerHTML = tagname;

  let xButton = document.createElement("div");
  xButton.classList.add("xButton");
  xButton.innerHTML = "X";

  tagUiElem.appendChild(tagText);
  tagUiElem.appendChild(xButton);

  tagUiElem.addEventListener("click", function () {
    removeTag(tagname, where);
    tagUiElem.remove();
    applySelectedTags();
  });

  return tagUiElem;
}

/** tagSelectList and tagSelectItem */

function tagListItem(tagName: string, checked?: boolean): HTMLElement {
  /** 태그 리스트에 추가될 태그 아이템 생성 */
  let tagItem = document.createElement("div");
  tagItem.classList.add("tagItem");
  tagItem.dataset.name = tagName;
  tagItem.classList.add("fl-cen-cen");

  let cont = document.createElement("div");

  let inputElem = document.createElement("input");
  inputElem.setAttribute("type", "checkbox");
  if (checked) {
    inputElem.checked = true;
    tagItem.classList.add("_selected");
  } else {
    inputElem.checked = false;
  }

  let spanElem = document.createElement("span");
  spanElem.innerHTML = tagName;

  tagItem.appendChild(inputElem);
  tagItem.appendChild(spanElem);

  tagItem.addEventListener("click", function () {
    let check = tagItem.querySelector("input");
    if (check.checked) {
      check.checked = false;
      tagItem.classList.remove("_selected");
    } else {
      check.checked = true;
      tagItem.classList.add("_selected");
    }
  });

  return tagItem;
}

/*
 *
 * Initial
 *
 */

GlobalData.loadFile();
RendererData.init();

configFileData.tags.forEach((tag) => {
  /** 태그 리스트에 모든 태그 추가 */
  document.getElementById("searchContent").appendChild(tagListItem(tag));
  // console.log(tag);
});

/*
 *
 * Event Listeners
 *
 */

/** window event listeners */

window.onbeforeunload = (e) => {
  (window as any).api.flushConfigFile(configFileData);
};

/** element event listeners */

let haveButton = document.getElementById("haveButton");
haveButton.addEventListener("click", function () {
  let collect = Array.from(document.querySelectorAll(".tagItem._selected")).map(
    (elem: HTMLElement) => elem.dataset.name
  );
  console.log(collect);

  collect.forEach((tag) => {
    // selectedDataJson.tags.must.push(tag);
    if (selectTag(tag, "must")) {
      document
        .querySelector("#mustBoard .body")
        .appendChild(createTagBoardItem(tag, "must"));
    }
  });
  Array.from(document.querySelectorAll(".tagItem._selected")).forEach(
    (elem) => {
      console.log(elem);
      elem.classList.remove("_selected");
      elem.querySelector("input").checked = false;
    }
  );

  // selectedDataJson.tags.must.push(collect);
  applySelectedTags();
});

let notHaveButton = document.getElementById("notHaveButton");
notHaveButton.addEventListener("click", function () {
  let collect = Array.from(document.querySelectorAll(".tagItem._selected")).map(
    (elem: HTMLElement) => elem.dataset.name
  );
  console.log(collect);

  collect.forEach((tag) => {
    // selectedDataJson.tags.atleast.push(tag);
    if (selectTag(tag, "atleast")) {
      document
        .querySelector("#atleastBoard .body")
        .appendChild(createTagBoardItem(tag, "atleast"));
    }
  });
  Array.from(document.querySelectorAll(".tagItem._selected")).forEach(
    (elem) => {
      console.log(elem);
      elem.classList.remove("_selected");
      elem.querySelector("input").checked = false;
    }
  );

  // selectedDataJson.tags.must.push(collect);
  applySelectedTags();
});

let tagInputText: HTMLInputElement = document.querySelector("#inputDiv input");
tagInputText.addEventListener("input", function () {
  // clear tag list
  let searchContent = document.getElementById("searchContent");
  searchContent.innerHTML = "";

  // selected tags
  selectedDataJson.tags.must.forEach((tag) => {
    searchContent.appendChild(tagListItem(tag, true));
  });
  selectedDataJson.tags.atleast.forEach((tag) => {
    searchContent.appendChild(tagListItem(tag, true));
  });
  // input values
  configFileData.tags
    .filter((tag) => tag.includes(tagInputText.value))
    .forEach((tag) => {
      searchContent.appendChild(tagListItem(tag));
    });
});

let hideButton = document.getElementById("hideButton");
hideButton.addEventListener("click", function () {
  getSelected().forEach((elem) => elem.classList.add("_invisible"));
});

let showButton = document.getElementById("showButton");
showButton.addEventListener("click", function () {
  getSelected().forEach((elem) => elem.classList.remove("_invisible"));
});

let closeSelectBtn = document.getElementById("closeButton");
closeSelectBtn.addEventListener("click", function () {
  // ipcRenderer.send("toStartingCroquis", "fileSelecter", null);
  (window as any).api.toStartingCroquis(null);
  window.close();
});

let okButton = document.getElementById("okButton");
okButton.addEventListener("click", function () {
  let collect = {
    filePaths: Array.from(getSelected()).map((elem) =>
      elem.getAttribute("data-address")
    ),
    tags: selectedDataJson.tags,
  };
  // console.log();
  // ipcRenderer.send("toStartingCroquis", "fileSelecter", collect);
  (window as any).api.toStartingCroquis(collect);
  console.log("sent.");
  window.close();
});

let folderExplorerButton = document.getElementById("openExplorer");
folderExplorerButton.addEventListener("click", function () {
  (window as any).api.openfileExplorer();
});
