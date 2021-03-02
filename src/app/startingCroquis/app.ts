var { ipcRenderer } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();

let fileView = document.getElementById("fileView");
fileView.addEventListener("click", function () {
  // add class to show effect
});

let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("click", function () {
  win.close();
});

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
  ipcRenderer.send("openApp", "Croquis", 25);
  win.close();
});

let openFileSelect = document.getElementById("openFileSelect");
openFileSelect.addEventListener("click", function () {
  ipcRenderer.send("openApp", "fileSelecter", 25);
  // win.close();
});

// flow start
// let appData = {};
ipcRenderer.on("fileData", (event, data) => {
  console.log(data);
  alert(data);
});
