var { ipcRenderer, shell } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();
const path = require("path");

interface file {
  filename: string;
  tags: number[];
  address: string;
}

interface selectedFilesTags {
  files: file[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

/** Data */
let selecterAppData: selectedFilesTags = {
  files: [
    {
      filename: "asdf.png",
      tags: [1, 3],
      address: "a/asdf.png",
    },
  ],
  tags: {
    must: ["인간"],
    atleast: ["역동적", "정적"],
  },
};
let selecterTags = selecterAppData.tags;
let selecterFiles = selecterAppData.files;

function selectOneFile() {}
function unselectOneFile() {}

function addTag() {}
function deleteTag() {}

/** */

/** */

let closeSelectBtn = document.getElementById("closeButton");
closeSelectBtn.addEventListener("click", function () {
  ipcRenderer.send("toStartingCroquis", "fileSelecter", null);
  win.close();
});

let okButton = document.getElementById("okButton");
okButton.addEventListener("click", function () {
  ipcRenderer.send("toStartingCroquis", "fileSelecter", selecterAppData);
  console.log("sent.");
  win.close();
});

let folderExplorerButton = document.getElementById("openExplorer");
folderExplorerButton.addEventListener("click", function () {
  // window.open(path.join("file:///", process.env.HOME, "Downloads", "Croquis"));
  shell.openPath(path.join(process.env.HOME, "Downloads", "Croquis"));
  // window.open("file:///home/vhv3y8/Downloads/Croquis");
});

/** flow start */
document.querySelector("#showFolder p").innerHTML = `폴더: ${path.join(
  process.env.HOME,
  "Downloads",
  "Croquis"
)}`;

ipcRenderer.on("getInitialData", (event, data: selectedFilesTags) => {
  // if data exists, get it. if does not, just show default page.
  if (data !== undefined) {
    /** apply data */
    // apply tag
    // apply selected files
  }
});
