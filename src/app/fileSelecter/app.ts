var { ipcRenderer } = require("electron");
import { file } from "../../database/fileTag";

interface selectedFilesTags {
  files: file[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

/** Data */
let selecterAppData: selectedFilesTags = {
  files: [],
  tags: {
    must: [],
    atleast: [],
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

let okButton = document.getElementById("okButton");
okButton.addEventListener("click", function () {
  ipcRenderer.send("toStartingCroquis", "fileSelecter", selecterAppData);
});

ipcRenderer.on("getInitialData", (event, data: selectedFilesTags) => {
  // if data exists, get it. if does not, just show default page.
  if (data !== undefined) {
    /** apply data */
    // apply tag
    // apply selected files
  }
});
