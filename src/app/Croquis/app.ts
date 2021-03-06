var { ipcRenderer } = require("electron");
import { file } from "../../database/fileTag";

let timerStartPauseButton = document.getElementById("timerStartPause");

interface CroquisInitial {
  files: file[];
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

// init app
let appData: CroquisInitial;

ipcRenderer.on("getInitialData", (event, data: CroquisInitial) => {
  appData = data;

  // set tagBar - tags, goal
  /** set tag */
  let tagUI = document.querySelectorAll("#infoBar p")[0];
  let mustTag = appData.tags.must.join(", ");
  let atleastTag = appData.tags.atleast.join(", ");
  tagUI.innerHTML = `${mustTag} / ${atleastTag}`;

  // document.querySelectorAll("#infoBar p")[0],
  // document.querySelectorAll("#infoBar p")[1]

  // set timer default value - time

  // set controller to handle image - files
});
