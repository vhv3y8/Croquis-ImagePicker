var { ipcRenderer } = require("electron");
var remote = require("electron").remote;
var win = remote.getCurrentWindow();
// import {
//   CroquisInitial,
//   selectedFilesTags,
// } from "../../communication/appInitialData";

interface file {
  filename: string;
  tags: string[];
  address: string;
}

interface selectedFilesTags {
  filePaths: string[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

interface CroquisInitial {
  filePaths: string[];
  tags: {
    must: string[];
    atleast: string[];
  };
  config: {
    time: number;
    goal?: number;
    autopass: boolean;
  };
}

/** usage : when opening fileSelecter, if this value is true, than give selected file data that is already existing. */
let fileSelected: boolean = false;
let selectedData: selectedFilesTags = {
  filePaths: [],
  tags: {
    must: [],
    atleast: [],
  },
};

function applySelectedFileUI(): void {
  let [must, atleast, fileCount] = [
    document.getElementById("tagMust"),
    document.getElementById("tagAtleast"),
    document.getElementById("fileCount"),
  ];
  if (selectedData === undefined) {
    console.log("ERR at applySelectedFileUI : selectedData is undefined");
  } else {
    must.querySelector("div .text").innerHTML = selectedData.tags.must.join(
      ", "
    );
    atleast.querySelector(
      "div .text"
    ).innerHTML = selectedData.tags.atleast.join(", ");
    fileCount.querySelector(
      "div .count"
    ).innerHTML = selectedData.filePaths.length.toString();
    let goal: HTMLInputElement = document.querySelector("#goalSetting input");
    goal.value = selectedData.filePaths.length.toString();
  }
}

function configData(): CroquisInitial {
  function convertSelectValue(val: string): number {
    // need to * 1000 to get milliseconds
    switch (val) {
      case "15sec":
        return 15;
      case "30sec":
        return 30;
      case "1min":
        return 60;
      case "2min":
        return 120;
      case "3min":
        return 180;
      case "5min":
        return 300;
      case "10min":
        return 600;
      case "15min":
        return 900;
      case "20min":
        return 1200;
      case "30min":
        return 1800;
    }
  }

  // flow start
  let [time, goal, autopass] = [
    document.getElementById("timeSetting"),
    document.getElementById("goalSetting"),
    document.getElementById("autopassSetting"),
  ];

  let goalElem: HTMLInputElement = goal.querySelector("input");

  let croquisData: CroquisInitial = {
    filePaths: selectedData.filePaths,
    tags: selectedData.tags,
    config: {
      time: convertSelectValue(time.querySelector("select").value),
      goal: parseInt(goalElem.value), // if value is undefined, goal is NaN
      autopass: autopass.querySelector("input").checked,
    },
  };

  return croquisData;
}

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
  if (selectedData.filePaths.length > 0) {
    ipcRenderer.send("openApp", "Croquis", 25, undefined, configData());
    console.log(configData());
    win.close();
  }
});

let openFileSelect = document.getElementById("openFileSelect");
openFileSelect.addEventListener("click", function () {
  console.log(fileSelected);
  console.log(selectedData);

  ipcRenderer.send(
    "openApp",
    "fileSelecter",
    25,
    "startingCroquis",
    fileSelected == true ? selectedData : undefined
  );

  setTimeout(() => {
    document.getElementById("main").style.opacity = "0.5";
  }, 100);
});

let autopassSetting = document.getElementById("autopassSetting");
autopassSetting.addEventListener("click", function () {
  console.log("hihihih");
  let autopassCheckbox: HTMLInputElement = autopassSetting.querySelector(
    "input[type=checkbox]"
  );
  autopassCheckbox.checked = !autopassCheckbox.checked;
});

// flow start
ipcRenderer.on("selectedFiles", (event, data: selectedFilesTags) => {
  if (data === null) {
    // closed with X button
    // closing value null is needed to change opacity to 1..
  } else {
    console.log("selectedFiles:");
    console.log(data);
    selectedData = data;
    fileSelected = true;

    applySelectedFileUI();
  }
  document.getElementById("main").style.opacity = "1";
});
