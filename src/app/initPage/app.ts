// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();

let addFileButton = document.getElementById("addFileButton");
addFileButton.addEventListener("click", function () {
  // (window as any).api.openApp("fileSetting", 50);
  (window as any).api.openApp("fileSetting", 50);
  window.close();
});

let drawCroquisButton = document.getElementById("drawCroquisButton");
drawCroquisButton.addEventListener("click", function () {
  (window as any).api.openApp("startingCroquis", 25);
  window.close();
});

let closeButton = document.getElementById("closeButton");
closeButton.addEventListener("click", function () {
  window.close();
});
