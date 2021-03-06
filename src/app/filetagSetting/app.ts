import { dbFile } from "../../database/fileTag";

var { ipcRenderer } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();
const { getConfigFile, flushConfigFile } = require("../../database/databaseFs");

/** flow start */
const datas: dbFile = getConfigFile();
let [tags, files] = [datas.tags, datas.files];

console.log("hi this is const require");
console.log(datas);

tags = {
  0: "hihi",
  1: "hellohello",
};
files = [
  {
    filename: "hell.png",
    tags: [1, 3],
    address: "greetings/hell.png",
  },
];

/** set event listeners */

let settingCloseButton = document.getElementById("closeButton");
settingCloseButton.addEventListener("click", function () {
  // close
  win.close();
});

window.onbeforeunload = (e) => {
  // flush datas
  flushConfigFile({ tags, files });
  console.log("Flushed.");
  console.log(getConfigFile());
  // ipcRenderer.send("openApp", "Croquis", 25);
  e.returnValue = false;
};
