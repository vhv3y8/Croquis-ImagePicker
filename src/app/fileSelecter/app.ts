// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();
// var path = require("path");

// var { tagNumToString } = require("../../database/fileTag");

/** initialize types */

interface file {
  filename: string;
  tags: string[];
  address: string;
}

// interface tagDB {
//   [tagNum: number]: string;
// }

interface dbFile {
  files: file[];
  tags: string[];
}

interface selectedFilesTags {
  filePaths: string[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

/** flow start */

document.querySelector(
  "#showFolder p"
).innerHTML = `${(window as any).api.getCroquisFolderPath()}`;

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

configFileData.tags.forEach((tag) => {
  document.getElementById("searchContent").appendChild(tagListItem(tag));
  // console.log(tag);
});

// configFileData.tags.atleast.forEach((tag) => {
//   document.getElementById("searchContent").appendChild(tagListItem(tag));
// });
/** define Functions */

function getCount(): number {
  return parseInt(document.querySelector("span.count").innerHTML);
}

function setCount(num: number) {
  document
    .querySelectorAll("span.count")
    .forEach((elem) => (elem.innerHTML = num.toString()));
}

/** */

function tagUI(tagname: string, where: "must" | "atleast") {
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

function selectTag(tagname: string, where: "must" | "atleast"): boolean {
  if (selectedDataJson.tags[where].includes(tagname)) {
    return false;
  } else {
    selectedDataJson.tags[where].push(tagname);
    return true;
  }
}

function removeTag(tagname: string, where: "must" | "atleast") {
  selectedDataJson.tags[where] = selectedDataJson.tags[where].filter(
    (tag) => tag !== tagname
  );
}

/**  */

/** */

function getSelected() {
  let toreturn = document.querySelectorAll(".imgItem._selected");
  console.log(toreturn);
  return toreturn;
}

function applySelectedTags(): void {
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

/** construct UI */

function tagListItem(tagName: string, checked?: boolean): HTMLElement {
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

function createItemUI(data: file): HTMLElement {
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
      setCount(getCount() + 1);
    } else {
      check.checked = false;
      elem.classList.remove("_selected");
      setCount(getCount() - 1);
    }
  });
  return elem;
}

// add UI element
let imgBody = document.getElementById("imgListBody");
configFileData.files.forEach((file) => {
  imgBody.appendChild(createItemUI(file));
});

/** */

// function selectOneFile() {}
// function unselectOneFile() {}

// function addTag() {}
// function deleteTag() {}

/** */

let mustAddButton = document.getElementById("mustAddButton");
mustAddButton.addEventListener("click", function () {
  let collect = Array.from(document.querySelectorAll(".tagItem._selected")).map(
    (elem: HTMLElement) => elem.dataset.name
  );
  console.log(collect);

  collect.forEach((tag) => {
    // selectedDataJson.tags.must.push(tag);
    if (selectTag(tag, "must")) {
      document
        .querySelector("#mustBoard .body")
        .appendChild(tagUI(tag, "must"));
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

let atleastAddButton = document.getElementById("atleastAddButton");
atleastAddButton.addEventListener("click", function () {
  let collect = Array.from(document.querySelectorAll(".tagItem._selected")).map(
    (elem: HTMLElement) => elem.dataset.name
  );
  console.log(collect);

  collect.forEach((tag) => {
    // selectedDataJson.tags.atleast.push(tag);
    if (selectTag(tag, "atleast")) {
      document
        .querySelector("#atleastBoard .body")
        .appendChild(tagUI(tag, "atleast"));
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

/** */

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

/** */

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

window.onbeforeunload = (e) => {
  // flushConfigFile(configFileData);
  (window as any).api.flushConfigFile(configFileData);

  // e.returnValue = false;
};
