// var { ipcRenderer } = require("electron");
// var remote = require("electron").remote;
// var win = remote.getCurrentWindow();
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

// let selectedData = (window as any).api.getSelectedData();
// let fileSelected = (window as any).api.getFileSelected();

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
    filePaths: (window as any).api.getSelectedData().filePaths,
    tags: (window as any).api.getSelectedData().tags,
    config: {
      time: convertSelectValue(time.querySelector("select").value),
      goal: parseInt(goalElem.value), // if value is undefined, goal is NaN
      autopass: autopass.querySelector("input").checked,
    },
  };

  return croquisData;
}

// flow start

let fileView = document.getElementById("fileView");
fileView.addEventListener("click", function () {
  // add class to show effect
});

let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("click", function () {
  window.close();
});

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
  if ((window as any).api.getSelectedData().filePaths.length > 0) {
    // ipcRenderer.send("openApp", "Croquis", 25, undefined, configData());
    (window as any).api.openApp("Croquis", 25, undefined, configData());
    console.log(configData());
    window.close();
  }
});

let openFileSelect = document.getElementById("openFileSelect");
openFileSelect.addEventListener("click", function () {
  // console.log(fileSelected);
  // console.log(selectedData);

  // ipcRenderer.send(
  //   "openApp",
  //   "fileSelecter",
  //   25,
  //   "startingCroquis",
  //   fileSelected == true ? selectedData : undefined
  // );
  (window as any).api.openApp(
    "fileSelecter",
    25,
    "startingCroquis",
    (window as any).api.getFileSelected() == true
      ? (window as any).api.getSelectedData()
      : undefined
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
