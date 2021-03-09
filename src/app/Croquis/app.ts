var { ipcRenderer } = require("electron");
var { Stack } = require("../../utils/stack");
var { Timer, TimerUI } = require("./timer");

// init app
let appData: CroquisInitial;

let timer;
let timerUI;
let filesToDraw;
let doneFileStack;
let currFilePath;
let img: HTMLImageElement = document.querySelector("#image img");
let goalExists: boolean = true;

ipcRenderer.on("getInitialData", (event, data: CroquisInitial) => {
  appData = data;
  goalExists = Object.is(data.config.goal, NaN) ? false : true;
  console.log(appData);

  // set tagBar - tags, goal
  /** set tag */
  handleTagUI();
  handleGoalUI();
  // alert("data applied.");
  // console.log(appData.toString());

  // main flow start
  timer = new Timer(appData.config.time);
  timerUI = new TimerUI(
    appData.config.time * 1000,
    document.getElementById("timeText")
  );
  filesToDraw = new Stack();
  doneFileStack = new Stack();
  currFilePath;

  // console.log("left time is :");
  // console.log(timer.timeLeft());
  // works

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // initialize File Stack
  while (appData.filePaths.length > 0) {
    console.log("filePaths length is " + appData.filePaths.length);

    let randomIdx = getRandomInt(appData.filePaths.length);
    console.log("random Idx: " + randomIdx);
    console.log("filaPaths length: " + appData.filePaths.length);
    console.log("max : " + appData.filePaths.length);
    console.log(appData.filePaths[randomIdx]);
    if (randomIdx > -1) {
      filesToDraw.push(appData.filePaths[randomIdx]);
      appData.filePaths.splice(randomIdx, 1);
    }
    // console.log("now array is :");
    // console.log(appData.filePaths);
    // console.log(appData);
  }

  // filesToDraw.show(); // console log array
  currFilePath = filesToDraw.pop();
  filesToDraw.show(); // console log array
  console.log(currFilePath);

  // document.querySelectorAll("#infoBar p")[0],
  // document.querySelectorAll("#infoBar p")[1]

  // set timer default value - time

  // set controller to handle image - files
  // img.src = nativeImage.createFromPath(currFilePath).toDataURL();
  img.src = currFilePath;
});

// interface file {
//   filename: string;
//   tags: string[];
//   address: string;
// }

let timerStartPauseButton = document.getElementById("timerStartPause");

function handleTagUI(): void {
  let tagUI = document.querySelectorAll("#infoBar p")[0];
  let mustTag = appData.tags.must.join(", ");
  let atleastTag = appData.tags.atleast.join(", ");
  if (appData.tags.must.length !== 0 && appData.tags.atleast.length !== 0) {
    tagUI.innerHTML = mustTag + " / " + atleastTag;
    console.log("plz");
  } else if (
    appData.tags.must.length === 0 &&
    appData.tags.atleast.length !== 0
  ) {
    tagUI.innerHTML = "반드시 포함 : " + mustTag;
    console.log("plzplz");
  } else if (
    appData.tags.must.length !== 0 &&
    appData.tags.atleast.length === 0
  ) {
    tagUI.innerHTML = "적어도 하나 포함 : " + atleastTag;
    console.log("plzplzplz");
  } else {
    tagUI.innerHTML = "";
    console.log("plzplzplzplz");
  }
  console.log(tagUI);
}

function handleGoalUI(): void {
  let goalUI = document.getElementById("goalInfo");
  goalUI.innerHTML = "";
  if (goalExists) {
    let currSpan = document.createElement("span");
    currSpan.classList.add("current");
    currSpan.innerHTML = "1";

    let goalSpan = document.createElement("span");
    goalSpan.classList.add("goal");
    goalSpan.innerHTML = "(목표: " + appData.config.goal.toString() + "장)";

    // goalUI.innerHTML = currSpan + " / " + goalSpan;
    goalUI.appendChild(currSpan);
    goalUI.appendChild(document.createTextNode("장째 / "));
    goalUI.appendChild(goalSpan);
  }
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

function moveNext(done: boolean) {
  // not done = passing
  if (done) {
    // update goalUI
    if (goalExists) {
      document.querySelector(".current").innerHTML = (
        parseInt(document.querySelector(".current").innerHTML) + 1
      ).toString();
    }
    // pop from filesToDraw, push curr to stack
    doneFileStack.push(currFilePath);
    currFilePath = filesToDraw.pop();
  } else {
    // pop from filesToDraw, remove curr
    currFilePath = filesToDraw.pop();
  }
  // reset timer
  timer.pause();
  timer.reset();

  // change image to currFilePath
  img.src = currFilePath;
}

function movePrev() {
  if (goalExists) {
    let currCount = parseInt(document.querySelector(".current").innerHTML);
    document.querySelector(".current").innerHTML =
      currCount > 0 ? (currCount - 1).toString() : "0";
  }

  // pop from doneFileStack, push curr to fileToDraw
  filesToDraw.push(currFilePath);
  currFilePath = doneFileStack.pop();

  // pop from filesToDraw, push to stack
  timer.pause();
  timer.reset();

  // change image to currFilePath
  img.src = currFilePath;
}

let closeButtonCroquis = document.getElementById("closeButton");
closeButtonCroquis.addEventListener("click", function () {
  window.close();
});

let backButton = document.getElementById("backButton");
backButton.addEventListener("click", function () {
  if (!doneFileStack.isEmpty()) {
    movePrev();
  }
});

let passButton = document.getElementById("passButton");
passButton.addEventListener("click", function () {
  if (!filesToDraw.isEmpty()) {
    moveNext(false);
  }
});

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", function () {
  if (!filesToDraw.isEmpty()) {
    moveNext(true);
  }
});
