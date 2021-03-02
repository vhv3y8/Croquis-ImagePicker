var { ipcRenderer } = require("electron");

let okButton = document.getElementById("okButton");
okButton.addEventListener("click", function () {
  ipcRenderer.sendSync("fileSelecter-to-startingCroquis", {
    must: [1, 2],
    atleast: [1, 2, 3, 4, 5],
    count: 162,
  });
});
