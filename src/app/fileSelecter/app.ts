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
  // /** 앱데이터의 태그 데이터에 기반하여 적용 */
  // // remove all selected
  // getSelected().forEach((elem) => {
  //   elem.classList.remove("_selected");
  //   let inEl: HTMLInputElement = elem.querySelector(".checkbox input");
  //   inEl.checked = false;
  // });
  // // apply tag
  // let filesToSelect = configFileData.files;
  // console.log(filesToSelect);
  // if (selectedDataJson.tags.must.length > 0) {
  //   filesToSelect = filesToSelect.filter((file) =>
  //     selectedDataJson.tags.must.every((tag) => file.tags.includes(tag))
  //   );
  //   console.log("has must tag. now filesToSelect is :");
  //   console.log(filesToSelect);
  // }
  // if (selectedDataJson.tags.atleast.length > 0) {
  //   filesToSelect = filesToSelect.filter((file) =>
  //     selectedDataJson.tags.atleast.some((tag) => file.tags.includes(tag))
  //   );
  //   console.log("has at least tag. now filesToSelect is :");
  //   console.log(filesToSelect);
  // }
  // filesToSelect = filesToSelect.map((file) => {
  //   return file.address;
  // });
  // if (
  //   selectedDataJson.tags.must.length === 0 &&
  //   selectedDataJson.tags.atleast.length === 0
  // ) {
  //   filesToSelect = [];
  // }
  // console.log("files to select: ");
  // console.log(filesToSelect);
  // console.log(configFileData.files);
  // filesToSelect.forEach((path) => {
  //   let input: HTMLInputElement = document
  //     .querySelector(`[data-address='${path}']`)
  //     .querySelector(".checkbox input");
  //   input.checked = true;
  //   document
  //     .querySelector(`[data-address='${path}']`)
  //     .classList.add("_selected");
  // });
  // setCount(getSelected().length);
}

///////////////////////////////////////////////////////////////////////////////

function goclonefS(source) {
  // https://stackoverflow.com/a/12690145
  if (Object.prototype.toString.call(source) === "[object Array]") {
    let cloneArr = [];
    for (var i = 0; i < source.length; i++) {
      cloneArr[i] = goclonefS(source[i]);
    }
    return cloneArr;
  } else if (typeof source == "object") {
    let cloneObj = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        cloneObj[prop] = goclonefS(source[prop]);
      }
    }
    return cloneObj;
  } else {
    return source;
  }
}

/*
 *
 * Data
 *
 */

/** fSGlobalData - global */

var fSGlobalData = {
  file: undefined,
  fileArr: undefined,
  tagObj: undefined,
  tagArr: undefined,
  loadFile: () => {
    fSGlobalData.file = (window as any).api.getDataWithUpdate();
    fSGlobalData.tagObj = fSGlobalData.file.tags;
    fSGlobalData.tagArr = [];
    fSGlobalData.fileArr = fSGlobalData.file.files;
    Object.keys(fSGlobalData.tagObj).forEach((group) => {
      fSGlobalData.tagObj[group].forEach((tag) => {
        fSGlobalData.tagArr.push(tag);
      });
    });
  },
};

/** AppData - local */

let fSAppData = {
  boardTags: {
    have: {},
    notHave: {},
  },
  selectedTags: [],
  // selectedImgs: [],
  selectedImgCount: 0,

  boardIncludes: (tagName, where: "have" | "notHave"): boolean => {
    let arr =
      where == "have"
        ? goclonefS(fSAppData.boardTags.have)
        : goclonefS(fSAppData.boardTags.notHave);
    for (let group of Object.keys(arr)) {
      if (arr[group].includes(tagName)) {
        return true;
      }
    }
    return false;
  },
  addHaveTag: (tagName, groupName) => {
    if (fSAppData.boardTags.have[groupName] == undefined) {
      fSAppData.boardTags.have[groupName] = [];
    }
    fSAppData.boardTags.have[groupName].push(tagName);
  },
  removeHaveTag: (tagName, groupName) => {
    fSAppData.boardTags.have[groupName] = fSAppData.boardTags.have[
      groupName
    ].filter((t) => t !== tagName);
  },
  addNotHaveTag: (tagName, groupName) => {
    if (fSAppData.boardTags.notHave[groupName] == undefined) {
      fSAppData.boardTags.notHave[groupName] = [];
    }
    fSAppData.boardTags.notHave[groupName].push(tagName);
  },
  removeNotHaveTag: (tagName, groupName) => {
    fSAppData.boardTags.notHave[groupName] = fSAppData.boardTags.notHave[
      groupName
    ].filter((t) => t !== tagName);
  },

  getGroup: (tagName) => {
    for (let group of Object.keys(fSGlobalData.tagObj)) {
      for (let i = 0; i < fSGlobalData.tagObj[group].length; i++) {
        if (fSGlobalData.tagObj[group][i] == tagName) {
          return group;
        }
      }
    }
    return undefined;
  },

  selectTag: (tagName) => {
    fSAppData.selectedTags.push(tagName);
  },
  unselectTag: (tagName) => {
    fSAppData.selectedTags = fSAppData.selectedTags.filter((tag) => {
      tag !== tagName;
    });
  },

  setImgCount: (num: number) => {
    fSAppData.selectedImgCount = num;
  },
  getSelectedImgs: () => {
    return Array.from(document.querySelectorAll(".imgItem._selected")).map(
      (elem: HTMLElement) => elem.dataset.address
    );
  },

  filterImgs: (): string[] => {
    // return address array
    let arr = goclonefS(fSGlobalData.fileArr);
    for (let group of Object.keys(fSAppData.boardTags.have)) {
      if (fSAppData.boardTags.have[group].length > 0) {
        arr = arr.filter((file) => {
          return fSAppData.boardTags.have[group].some((tag) => {
            return file.tags.includes(tag);
          });
        });
      }
    }
    for (let group of Object.keys(fSAppData.boardTags.notHave)) {
      if (fSAppData.boardTags.notHave[group].length > 0) {
        arr = arr.filter((file) => {
          return fSAppData.boardTags.notHave[group].every((tag) => {
            return !file.tags.includes(tag);
          });
        });
      }
    }

    return arr.map((file) => file.address);
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

let fS: any = {
  // UI: {},
};

fS.UI = {
  imgList: {},
  board: {},
  tagList: {},
};

/** folder name and open */

function initUI() {
  // show folder name
  document.querySelector(
    "#showFolder p"
  ).innerHTML = `${(window as any).api.getCroquisFolderPath()}`;

  // add imgs to imgList
  let imgBody = document.getElementById("imgListBody");
  fSGlobalData.fileArr.forEach((file) => {
    /** CroquisData.json에서 불러온 데이터를 기반으로 이미지 리스트에 이미지 아이템 모두 추가 */
    imgBody.appendChild(fS.UI.imgList.create.imgItem(file));
  });

  // init tagList
  Object.keys(fSGlobalData.tagObj).forEach((group) => {
    /** 태그 리스트에 모든 태그 추가 */
    document
      .getElementById("searchContent")
      .appendChild(fS.UI.tagList.create.groupItem(group));
    // console.log(tag);
  });

  // console.log("fS.UI.board.applyInitial();");
  // fS.UI.board.applyInitial();

  // // initial data apply
  // console.log(
  //   'fSAppData.setImgCount(document.querySelectorAll(".imgItem._selected").length)'
  // );
  // fSAppData.setImgCount(document.querySelectorAll(".imgItem._selected").length);
  // applyCount();
}

function applyCount() {
  document.querySelectorAll("span.count").forEach((elem) => {
    elem.innerHTML = fSAppData.selectedImgCount.toString();
  });
}

/** imgList and imgItem */

fS.UI.imgList = {
  create: {
    imgItem: (data: file): HTMLElement => {
      // <div
      //   class="imgItem fl-cen-cen _selected"
      //   data-address="/home/vhv3y8/Downloads/Croquis/Jump stock image_ Image of jumper, dancing, female, exercizing - 6006165.jpeg"
      // >
      //   <div class="cont">
      //     <div class="checkbox fl-row-st">
      //       <input type="checkbox" />
      //     </div>
      //     <div class="image fl-cen-cen">
      //       <img
      //         src="/home/vhv3y8/Downloads/Croquis/Jump stock image_ Image of jumper, dancing, female, exercizing - 6006165.jpeg"
      //       />
      //     </div>
      //   </div>
      // </div>

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
      // img.style.maxHeight = "120px";
      // img.style.maxWidth = "140px";
      imgDiv.appendChild(img);

      let tagsDiv = document.createElement("div");
      tagsDiv.classList.add("tags");
      tagsDiv.innerHTML = data.tags.join(", ");

      cont.appendChild(checkboxDiv);
      cont.appendChild(imgDiv);
      // cont.appendChild(tagsDiv);
      elem.appendChild(cont);

      elem.addEventListener("click", function () {
        let check: HTMLInputElement = elem.querySelector(".checkbox input");
        // console.log(check);
        // console.log(check.checked);
        check.checked = !check.checked;
        if (check.checked) {
          // check.checked = false;
          elem.classList.add("_selected");
          fSAppData.selectedImgCount++;
          applyCount();
        } else {
          // check.checked = true;
          elem.classList.remove("_selected");
          // fSAppData.imgCountMinus();
          fSAppData.selectedImgCount--;
          applyCount();
        }
      });
      return elem;
    },
  },

  applyFilter: () => {
    let arr = fSAppData.filterImgs();
    // .forEach((address) => {
    //   (document.querySelector(
    //     `[data-address='${address}']`
    //   ) as HTMLElement).click();
    // });
    (Array.from(
      document.querySelectorAll(".imgItem")
    ) as HTMLElement[]).forEach((elem) => {
      let check: HTMLInputElement = elem.querySelector(".cont .checkbox input");
      if (arr.includes(elem.dataset.address)) {
        // elem.click();
        check.checked = true;
      } else {
        check.checked = false;
      }

      if (check.checked) {
        // check.checked = false;
        elem.classList.add("_selected");
        // fSAppData.selectedImgCount++;
        // applyCount();
      } else {
        // check.checked = true;
        elem.classList.remove("_selected");
        // fSAppData.imgCountMinus();
        // fSAppData.selectedImgCount--;
      }
      fSAppData.setImgCount(
        document.querySelectorAll(".imgItem._selected").length
      );
      applyCount();
    });
  },
};

/** tagBoard and tagBoardItem */

fS.UI.board = {
  create: {
    groupItem: (groupName) => {
      let elem = document.createElement("div");
      elem.classList.add("selectGroupItem");
      elem.classList.add("fl-cen-cen");
      elem.dataset.groupName = groupName;

      let inner = document.createElement("div");
      inner.classList.add("inner");
      inner.classList.add("fl-row-st");

      let left = document.createElement("div");
      left.classList.add("left");
      left.classList.add("fl-cen-cen");

      let groupNameDiv = document.createElement("div");
      groupNameDiv.classList.add("groupName");
      groupNameDiv.classList.add("fl-col-st");

      let groupImg = document.createElement("img");
      groupImg.src = "../../../assets/icons/groupSmall.svg";

      let groupTxt = document.createElement("span");
      groupTxt.innerHTML = groupName;

      groupNameDiv.appendChild(groupImg);
      groupNameDiv.appendChild(groupTxt);
      left.appendChild(groupNameDiv);

      let right = document.createElement("right");
      right.classList.add("right");
      right.classList.add("fl-row-st-st-wrap");

      // fSGlobalData.tagObj[groupName].forEach((tag) => {
      //   right.appendChild(fS.UI.board.create.tagItem(tag));
      // });

      inner.appendChild(left);
      inner.appendChild(right);

      elem.appendChild(inner);

      return elem;
    },
    tagItem: (tagName, groupName) => {
      // <div class="selectTagItem fl-row-st">
      //   <span>태그이름</span>
      //   <img src="../../../assets/icons/close.svg" alt="" />
      // </div>
      let elem = document.createElement("div");
      elem.classList.add("selectTagItem");
      elem.classList.add("fl-row-st");
      elem.dataset.tagName = tagName;
      elem.dataset.groupName = groupName;

      let txt = document.createElement("span");
      txt.innerHTML = tagName;

      let img = document.createElement("img");
      img.src = "../../../assets/icons/close.svg";

      elem.appendChild(txt);
      elem.appendChild(img);

      elem.addEventListener("click", function () {
        // TODO: remove data
        if (fSAppData.boardTags.have[groupName] !== undefined) {
          fSAppData.boardTags.have[groupName] = fSAppData.boardTags.have[
            groupName
          ].filter((tag) => tag !== tagName);
        }
        if (fSAppData.boardTags.notHave[groupName] !== undefined) {
          fSAppData.boardTags.notHave[groupName] = fSAppData.boardTags.notHave[
            groupName
          ].filter((tag) => tag !== tagName);
        }
        // TODO : if parent has 0 child, remove selectGroupItem
        if (elem.parentElement.childElementCount == 1) {
          elem.parentElement.parentElement.parentElement.remove();
        } else {
          elem.remove();
        }

        fS.UI.imgList.applyFilter();
      });

      return elem;
    },
  },

  // addTagItem: (tagName, to: "have" | "notHave") => {
  //   let body =
  //     to == "have"
  //       ? document.querySelector("#haveBoard .body")
  //       : document.querySelector("#notHaveBoard .body");
  //   let groupName = fSAppData.getGroup(tagName);

  //   if (fS.UI.board.haveGroupItem(groupName)) {
  //     let groups = Array.from(
  //       body.querySelectorAll(".selectGroupItem")
  //     ) as HTMLElement[];

  //     for (let i = 0; i < groups.length; i++) {
  //       if (groups[i].dataset.groupName == groupName) {
  //         groups[i]
  //           .querySelector(".inner .right")
  //           .appendChild(fS.UI.board.create.tagItem(tagName));
  //       }
  //     }
  //   } else {
  //     let groupItem = fS.UI.board.create.groupItem(groupName);
  //     groupItem
  //       .querySelector(".inner .right")
  //       .appendChild(fS.UI.board.create.tagItem(tagName));
  //     body.appendChild(groupItem);
  //   }
  // },

  addTagItem: (tagName, to: "have" | "notHave") => {
    let body =
      to == "have"
        ? document.querySelector("#haveBoard .body")
        : document.querySelector("#notHaveBoard .body");

    let groupName = fSAppData.getGroup(tagName);
    let groupItems = body.querySelectorAll(
      `.selectGroupItem[data-group-name='${groupName}']`
    );
    // let groupItem = groupItems[0];
    console.log(groupItems);
    if (groupItems.length > 0) {
      groupItems[0]
        .querySelector(".inner .right")
        .appendChild(fS.UI.board.create.tagItem(tagName, groupName));
    } else {
      let groupItem = fS.UI.board.create.groupItem(groupName);
      groupItem
        .querySelector(".inner .right")
        .appendChild(fS.UI.board.create.tagItem(tagName, groupName));
      body.appendChild(groupItem);
    }
  },

  applyInitial: () => {
    let tagObj = (window as any).api.getTagArr();
    console.log("tagObj is ");
    console.log(tagObj);
    tagObj.notHave.forEach((tag) => {
      let group = fSAppData.getGroup(tag);
      fSAppData.addNotHaveTag(tag, group);
      fS.UI.board.addTagItem(tag, "notHave");
    });
    tagObj.notHave.forEach((tag) => {
      let group = fSAppData.getGroup(tag);
      fSAppData.addNotHaveTag(tag, group);
      fS.UI.board.addTagItem(tag, "notHave");
    });
  },

  // haveGroupItem: (groupName, where: "have" | "notHave"): boolean => {
  //   let body =
  //     where == "have"
  //       ? document.querySelector("#haveBoard .body")
  //       : document.querySelector("#notHaveBoard .body");
  //   let groups = Array.from(
  //     body.querySelectorAll(".selectGroupItem")
  //   ) as HTMLElement[];

  //   for (let i = 0; i < groups.length; i++) {
  //     if (groups[i].dataset.groupName == groupName) {
  //       return true;
  //     }
  //   }
  //   return false;
  // },
};

/** tagSelectList and tagSelectItem */

fS.UI.tagList = {
  create: {
    groupItem: (groupName) => {
      let elem = document.createElement("details");
      elem.classList.add("groupItem");

      let summ = document.createElement("summary");
      summ.classList.add("fl-row-st");

      let groupImg = document.createElement("img");
      groupImg.src = "../../../assets/icons/groupSmall.svg";

      let groupNameDiv = document.createElement("div");
      groupNameDiv.classList.add("name");
      groupNameDiv.classList.add("fl-row-st");

      let pTag = document.createElement("p");

      let spanName = document.createElement("span");
      spanName.classList.add("groupName");
      spanName.innerHTML = groupName;

      let count = fSGlobalData.tagObj[groupName].length;
      let spanCount = document.createElement("span");
      spanCount.classList.add("groupCount");
      spanCount.innerHTML = `${count} tags`;

      pTag.appendChild(spanName);
      pTag.appendChild(document.createTextNode(" - "));
      pTag.appendChild(spanCount);

      groupNameDiv.appendChild(pTag);

      let groupOpenClose = document.createElement("img");
      groupOpenClose.src = "../../../assets/icons/arrowDown.svg";

      summ.appendChild(groupImg);
      summ.appendChild(groupNameDiv);
      summ.appendChild(groupOpenClose);

      elem.appendChild(summ);

      fSGlobalData.tagObj[groupName].forEach((tag) => {
        elem.appendChild(fS.UI.tagList.create.tagItem(tag));
      });

      elem.addEventListener("toggle", function () {
        if (elem.open) {
          groupOpenClose.src = "../../../assets/icons/arrowUp.svg";
        } else {
          groupOpenClose.src = "../../../assets/icons/arrowDown.svg";
        }
      });

      return elem;
    },
    tagItem: (tagName) => {
      // <div class="tagItem fl-row-st">
      //   <input type="checkbox" />
      //   <p class="tagName">
      //     역동적이다 <span class="itemCount">(13 items)</span>
      //   </p>
      // </div>
      let elem = document.createElement("div");
      elem.classList.add("tagItem");
      elem.classList.add("fl-row-st");

      let input = document.createElement("input");
      input.type = "checkbox";
      input.checked = false;

      let pTag = document.createElement("p");
      pTag.classList.add("tagName");
      pTag.innerHTML = tagName;

      // let countSpan = document.createElement("span");
      // countSpan.classList.add("itemCount");
      // countSpan.innerHTML = `(${} items)`;

      elem.appendChild(input);
      elem.appendChild(pTag);

      elem.addEventListener("click", function () {
        input.checked = !input.checked;
        if (input.checked) {
          fSAppData.selectTag(tagName);
        } else {
          fSAppData.unselectTag(tagName);
        }
      });

      return elem;
    },
  },

  uncheckAllTagItems: () => {
    Array.from(document.querySelectorAll("#searchContent .tagItem")).forEach(
      (elem) => {
        elem.querySelector("input").checked = false;
      }
    );
  },
};

/*
 *
 * Initial
 *
 */

window.addEventListener("DOMContentLoaded", function () {
  fSGlobalData.loadFile();
  // fSAppData.init();
  initUI();
  // setTimeout(() => {
  // }, 3000);
});

/*
 *
 * Event Listeners
 *
 */

/** window event listeners */

window.onbeforeunload = (e) => {
  // (window as any).api.flushConfigFile({
  //   tags: fSAppData.boardTags,
  //   files: 1,
  // });
};

/** element event listeners */

let haveButton = document.getElementById("haveButton");
haveButton.addEventListener("click", function () {
  fSAppData.selectedTags.forEach((tag) => {
    //   if (!fSAppData.boardTags.have.includes(tag)) {
    //     fSAppData.boardTags.have.push(tag);
    //     fS.UI.board.addTagItem(tag, "have");
    //   }
    let [inHave, inNotHave] = [
      fSAppData.boardIncludes(tag, "have"),
      fSAppData.boardIncludes(tag, "notHave"),
    ];
    let groupName = fSAppData.getGroup(tag);
    if (inHave) {
      // do nothing
    } else if (inNotHave) {
      // remove data and element from have
      fSAppData.boardTags.notHave[groupName] = fSAppData.boardTags.notHave[
        groupName
      ].filter((t) => t != tag);
      (document.querySelector(
        `[data-tag-name='${tag}']`
      ) as HTMLElement).click();
      if (fSAppData.boardTags.have[groupName] == undefined) {
        fSAppData.boardTags.have[groupName] = [];
      }
      fSAppData.boardTags.have[groupName].push(tag);
      fS.UI.board.addTagItem(tag, "have");
    } else {
      // add to have
      if (fSAppData.boardTags.have[groupName] == undefined) {
        fSAppData.boardTags.have[groupName] = [];
      }
      fSAppData.boardTags.have[groupName].push(tag);
      fS.UI.board.addTagItem(tag, "have");
    }
  });

  fS.UI.tagList.uncheckAllTagItems();
  fSAppData.selectedTags = [];
  fS.UI.imgList.applyFilter();
});

let notHaveButton = document.getElementById("notHaveButton");
notHaveButton.addEventListener("click", function () {
  fSAppData.selectedTags.forEach((tag) => {
    let [inHave, inNotHave] = [
      fSAppData.boardIncludes(tag, "have"),
      fSAppData.boardIncludes(tag, "notHave"),
    ];
    let groupName = fSAppData.getGroup(tag);
    if (inNotHave) {
      // do nothing
    } else if (inHave) {
      // remove data and element from have
      fSAppData.boardTags.have[groupName] = fSAppData.boardTags.have[
        groupName
      ].filter((t) => t != tag);
      (document.querySelector(
        `[data-tag-name='${tag}']`
      ) as HTMLElement).click();
      if (fSAppData.boardTags.notHave[groupName] == undefined) {
        fSAppData.boardTags.notHave[groupName] = [];
      }
      fSAppData.boardTags.notHave[groupName].push(tag);
      fS.UI.board.addTagItem(tag, "notHave");
    } else {
      // add to notHave
      if (fSAppData.boardTags.notHave[groupName] == undefined) {
        fSAppData.boardTags.notHave[groupName] = [];
      }
      fSAppData.boardTags.notHave[groupName].push(tag);
      fS.UI.board.addTagItem(tag, "notHave");
    }

    // fSAppData.boardTags.notHave.push(tag);
  });
  fS.UI.tagList.uncheckAllTagItems();
  fSAppData.selectedTags = [];
  fS.UI.imgList.applyFilter();
});

let tagInputText: HTMLInputElement = document.querySelector("#inputDiv input");
tagInputText.addEventListener("input", function () {
  // // clear tag list
  // let searchContent = document.getElementById("searchContent");
  // searchContent.innerHTML = "";
  // // selected tags
  // selectedDataJson.tags.must.forEach((tag) => {
  //   searchContent.appendChild(tagListItem(tag, true));
  // });
  // selectedDataJson.tags.atleast.forEach((tag) => {
  //   searchContent.appendChild(tagListItem(tag, true));
  // });
  // // input values
  // configFileData.tags
  //   .filter((tag) => tag.includes(tagInputText.value))
  //   .forEach((tag) => {
  //     searchContent.appendChild(tagListItem(tag));
  //   });
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
  // let collect = {
  //   filePaths: Array.from(getSelected()).map((elem) =>
  //     elem.getAttribute("data-address")
  //   ),
  //   tags: selectedDataJson.tags,
  // };
  // console.log();
  // ipcRenderer.send("toStartingCroquis", "fileSelecter", collect);
  let have = [];
  Object.keys(fSAppData.boardTags.have).forEach((key) => {
    have.push(...fSAppData.boardTags.have[key]);
  });
  let notHave = [];
  Object.keys(fSAppData.boardTags.notHave).forEach((key) => {
    notHave.push(...fSAppData.boardTags.notHave[key]);
  });
  (window as any).api.toStartingCroquis({
    files: fSAppData.getSelectedImgs(),
    tags: {
      have,
      notHave,
    },
  });
  console.log("sent.");
  window.close();
});

let folderExplorerButton = document.getElementById("openExplorer");
folderExplorerButton.addEventListener("click", function () {
  (window as any).api.openfileExplorer();
});
