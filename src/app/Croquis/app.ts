function Cgoclone(source) {
  // https://stackoverflow.com/a/12690145
  if (Object.prototype.toString.call(source) === "[object Array]") {
    let cloneArr = [];
    for (var i = 0; i < source.length; i++) {
      cloneArr[i] = Cgoclone(source[i]);
    }
    return cloneArr;
  } else if (typeof source == "object") {
    let cloneObj = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        cloneObj[prop] = Cgoclone(source[prop]);
      }
    }
    return cloneObj;
  } else {
    return source;
  }
}

/**
 *
 * Data
 *
 */

(window as any).api.receive("getInitialData", (data) => {
  console.log("receive: ");
  console.log(data);
  CGlobalData.addresses = data.files;
  CAppTimer.period = data.config.time;
  CAppTimer.autopass = data.config.autopass;
  CUI.goal = data.config.goal;
  CUI.tags = data.tags;

  CGlobalData.init();
  CAppTimer.init();
  CAppdata.address.init();
  CUI.init();
  console.dir(CGlobalData);
  console.dir(CAppdata);
  console.dir(CUI);
});

let CGlobalData = {
  addresses: undefined,
  tags: undefined,
  time: undefined,
  init: () => {
    let arr = Cgoclone(CGlobalData.addresses);
    // randomize given array
    CGlobalData.addresses = [];
    console.log("window api appData");
    console.log(arr);
    while (arr.length > 0) {
      let idx = Math.floor(Math.random() * Math.floor(arr.length));
      CGlobalData.addresses.push(arr[idx]);
      arr.splice(idx, 1);
    }
  },
};

let CAppdata = {
  // timer: {},

  address: {
    stack: undefined,
    done: undefined,
    current: undefined,
    count: undefined,
    init: () => {
      CAppdata.address.stack = CGlobalData.addresses ?? [];
      CAppdata.address.done = [];
      CAppdata.address.count = 1;
      CAppdata.address.current = CAppdata.address.stack.pop();
    },
    goNext: () => {
      if (CAppdata.address.stack.length > 0) {
        CAppdata.address.done.push(CAppdata.address.current);
        CAppdata.address.current = CAppdata.address.stack.pop();
        CAppdata.address.count++;
      }
    },
    goPrev: () => {
      if (CAppdata.address.done.length > 0) {
        CAppdata.address.stack.push(CAppdata.address.current);
        CAppdata.address.current = CAppdata.address.done.pop();
        CAppdata.address.count--;
      }
    },
    goPass: () => {
      if (CAppdata.address.stack.length > 0) {
        CAppdata.address.current = CAppdata.address.stack.pop();
      }
    },
  },
};

let CAppTimer = {
  period: undefined,
  autopass: undefined,
  timeLeft: undefined,
  startTime: undefined,
  state: undefined,
  intervalFunc: undefined,

  init: () => {
    // CAppTimer.period = appData.config.time;
    CAppTimer.timeLeft = CAppTimer.period;
    CAppTimer.state = "stopped";
    // CAppTimer.autopass = appData.config.autopass;
  },
  // start: () => {
  //   CAppTimer.startTime = new Date().getTime();
  //   CAppTimer.state = "running";
  // },
  // pause: () => {
  //   let stopTime = new Date().getTime();
  //   CAppTimer.timeLeft -= stopTime - CAppTimer.startTime;
  //   CAppTimer.state = "stopped";
  // },
  // reset: () => {
  //   CAppTimer.timeLeft = CAppTimer.period;
  // },
  start: () => {
    CAppTimer.startTime = new Date().getTime();
    CAppTimer.setInterval();
    CUI.start();

    CAppTimer.state = "running";
    CUI.clickable = true;
    console.log("clickable:");
    console.log(CUI.clickable);
  },
  pause: () => {
    console.log("interval Func is : ");
    console.log(CAppTimer.intervalFunc);
    clearInterval(CAppTimer.intervalFunc);
    CAppTimer.intervalFunc = undefined;
    let stopTime = new Date().getTime();
    CAppTimer.timeLeft -= stopTime - CAppTimer.startTime;
    console.log(`pause - now timeLeft is : ${CAppTimer.timeLeft}`);
    CUI.pause();
    CAppTimer.state = "stopped";
    CUI.clickable = true;
    console.log("clickable:");
    console.log(CUI.clickable);
  },
  reset: () => {
    clearInterval(CAppTimer.intervalFunc);
    CAppTimer.intervalFunc = undefined;
    CAppTimer.timeLeft = CAppTimer.period;

    CUI.pause();
    CUI.reset();
    CAppTimer.state = "stopped";
    CUI.clickable = true;
    console.log("clickable:");
    console.log(CUI.clickable);
  },

  setInterval: () => {
    clearInterval(CAppTimer.intervalFunc);
    CAppTimer.intervalFunc = undefined;
    // let timeLeft: number = CAppTimer.timeLeft;
    // setTimeout(() => {
    //   let curr = timeLeft - (timeLeft % 1000);
    //   if (curr > 0) {
    //     document.getElementById("timeText").innerHTML = CUI.changeTime(curr);
    //   } else if (curr <= 0) {
    //     clearInterval(CUI.intervalFunc);
    //     document.getElementById("timeText").innerHTML = "00:00";
    //   }
    //   CUI.intervalFunc = setInterval(() => {
    //     curr -= 1000;
    //     if (curr > 0) {
    //       document.getElementById("timeText").innerHTML = CUI.changeTime(curr);
    //     } else if (curr <= 0) {
    //       clearInterval(CUI.intervalFunc);
    //       document.getElementById("timeText").innerHTML = "00:00";
    //     }
    //   }, 1000);
    // }, timeLeft % 1000);
    function applyTxt(time: number): void {
      document.getElementById("timeText").innerHTML = CAppTimer.convertTime(
        time
      );
    }

    if (CAppTimer.state == "stopped") {
      let timeLeft = CAppTimer.timeLeft;
      setTimeout(() => {
        let exact = timeLeft - (timeLeft % 1000);
        if (exact > 0) {
          applyTxt(exact);
          let interval = setInterval(() => {
            exact -= 1000;
            applyTxt(exact);
            console.log(exact);
            console.log(exact <= 0);
            if (exact <= 0) {
              clearInterval(interval);
              CAppTimer.reset();
              console.log("autopass : " + CAppTimer.autopass);
              if (CAppTimer.autopass) {
                CAppdata.address.goNext();
                img.src = CAppdata.address.current;
                document.querySelector("#goalInfo .current").innerHTML =
                  CAppdata.address.count;
                CAppTimer.start();
                CUI.start();
              }
            }
          }, 1000);
          CAppTimer.intervalFunc = interval;
        } else {
          applyTxt(0);
          CAppTimer.reset();
          console.log("autopass : " + CAppTimer.autopass);
          if (CAppTimer.autopass) {
            CAppdata.address.goNext();
            img.src = CAppdata.address.current;
            document.querySelector("#goalInfo .current").innerHTML =
              CAppdata.address.count;
            CAppTimer.start();
            CUI.start();
          }
        }
      }, timeLeft % 1000);
    } else {
      console.log("ERROR! tried to set Interval when timer is running.");
    }
  },

  convertTime: (time: number): string => {
    let min, sec;
    if (time >= 60000) {
      min = Math.floor(time / 60000);
    } else {
      min = 0;
    }
    sec = Math.floor((time % 60000) / 1000);
    console.log(`time: ${time}, min: ${min}, sec: ${sec}`);
    return `${min < 10 ? "0" + min.toString() : min}:${
      sec < 10 ? "0" + sec.toString() : sec
    }`;
  },
  // },
};

/**
 *
 * UI
 *
 */
let img: HTMLImageElement = document.querySelector("#image img");
let CUI = {
  goal: undefined,
  tags: undefined,
  clickable: undefined,

  init: () => {
    // init tags

    // init goal
    document.querySelector("#goalInfo .goal").innerHTML = CUI.goal + "장째";
    // init time
    // CUI.reset();
    document.getElementById("timeText").innerHTML = CAppTimer.convertTime(
      CAppTimer.period
    );
    document.querySelector("#goalInfo .current").innerHTML =
      CAppdata.address.count;
    let timerStartPause: HTMLImageElement = document.querySelector(
      "#timerStartPause img"
    );
    timerStartPause.src = "../../../assets/icons/timerPlay.svg";
    img.src = CAppdata.address.current;

    let tagStr = CUI.tags.have.join(", ") + " / " + CUI.tags.notHave.join(", ");
    document.querySelector("#infoBar p").innerHTML = tagStr;

    CUI.clickable = true;
  },
  // changeTime: (milli: number) => {
  //   let min, sec;
  //   if (milli >= 60000) {
  //     min = Math.floor(milli / 60000);
  //   } else {
  //     min = 0;
  //   }
  //   sec = Math.floor((milli % 60000) / 1000);
  //   console.log(`milli: ${milli}, min: ${min}, sec: ${sec}`);
  //   return `${min < 10 ? "0" + min.toString() : min}:${
  //     sec < 10 ? "0" + sec.toString() : sec
  //   }`;
  // },
  start: () => {
    document.getElementById("resetButton").classList.remove("_actable");
    let img: HTMLImageElement = document.querySelector("#timerStartPause img");
    img.src = "../../../assets/icons/timerPause.svg";

    // // time
    // let timeLeft: number = CAppTimer.timeLeft;
    // setTimeout(() => {
    //   let curr = timeLeft - (timeLeft % 1000);
    //   if (curr > 0) {
    //     document.getElementById("timeText").innerHTML = CUI.changeTime(curr);
    //   } else if (curr <= 0) {
    //     clearInterval(CUI.intervalFunc);
    //     document.getElementById("timeText").innerHTML = "00:00";
    //   }
    //   CUI.intervalFunc = setInterval(() => {
    //     curr -= 1000;
    //     if (curr > 0) {
    //       document.getElementById("timeText").innerHTML = CUI.changeTime(curr);
    //     } else if (curr <= 0) {
    //       clearInterval(CUI.intervalFunc);
    //       document.getElementById("timeText").innerHTML = "00:00";
    //     }
    //   }, 1000);
    // }, timeLeft % 1000);
  },
  pause: () => {
    // clearInterval(CUI.intervalFunc);
    document.getElementById("resetButton").classList.add("_actable");
    let img: HTMLImageElement = document.querySelector("#timerStartPause img");
    img.src = "../../../assets/icons/timerPlay.svg";
  },
  reset: () => {
    document.getElementById("timeText").innerHTML = CAppTimer.convertTime(
      CAppTimer.period
    );
  },
};

/**
 *
 * Initial
 *
 */

// console.dir();

/**
 *
 * Event Listeners
 *
 */

let timerStartPause = document.getElementById("timerStartPause");
timerStartPause.addEventListener("click", function () {
  if (CUI.clickable) {
    CUI.clickable = false;
    console.log("-----------------------------");
    console.log("clicked.");
    if (CAppTimer.state == "running") {
      console.log("pausing.");
      CAppTimer.pause();
      // CUI.pause();
    } else {
      if (CAppTimer.intervalFunc == undefined) {
        console.log("starting");
        CAppTimer.start();
      }
      // CUI.start();
    }
  }
});

let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function () {
  if (resetButton.classList.contains("_actable")) {
    CAppTimer.reset();
    CUI.reset();
  }
});

//

let image: HTMLElement = document.querySelector("#image img");
let scale = 1;
image.addEventListener("wheel", function (event) {
  event.preventDefault();

  scale += event.deltaY * -0.01;

  // Restrict scale
  scale = Math.min(Math.max(0.25, scale), 1.25);

  // Apply scale transform
  image.style.transform = `scale(${scale})`;
});

//

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", function () {
  CAppdata.address.goNext();
  img.src = CAppdata.address.current;
  document.querySelector("#goalInfo .current").innerHTML =
    CAppdata.address.count;
  CAppTimer.reset();
});

let backButton = document.getElementById("backButton");
backButton.addEventListener("click", function () {
  CAppdata.address.goPrev();
  img.src = CAppdata.address.current;
  document.querySelector("#goalInfo .current").innerHTML =
    CAppdata.address.count;
  CAppTimer.reset();
});

let passButton = document.getElementById("passButton");
passButton.addEventListener("click", function () {
  CAppdata.address.goPass();
  img.src = CAppdata.address.current;
  document.querySelector("#goalInfo .current").innerHTML =
    CAppdata.address.count;
  CAppTimer.reset();
});

//

let CcloseButton = document.getElementById("closeButton");
CcloseButton.addEventListener("click", function () {
  window.close();
});
