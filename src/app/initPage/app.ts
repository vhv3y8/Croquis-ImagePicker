var { ipcRenderer } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();

let addFileButton = document.getElementById("addFileButton");
addFileButton.addEventListener("click", function () {
  ipcRenderer.send("openApp", "fileSetting", 50);
  win.close();
});

let drawCroquisButton = document.getElementById("drawCroquisButton");
drawCroquisButton.addEventListener("click", function () {
  ipcRenderer.send("openApp", "startingCroquis", 25);
  win.close();
});

let closeButton = document.getElementById("closeButton");
closeButton.addEventListener("click", function () {
  win.close();
});

ipcRenderer.on("log", (event, arg) => {
  console.log("log from main process:");
  console.log(arg);
});
