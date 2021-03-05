interface timerSetting {}
type timerStates = "Running" | "Paused";

// class Timer {
//   private time: number;
//   private givenSeconds: number;
//   private spanElement: HTMLElement;
//   private timerSetting: timerSetting;
//   private runCallbackAfterEnd: boolean;
//   private callbackFunc: Function;
//   private state: timerStates;

//   private startTime: number;

//   constructor(
//     givenSeconds: number,
//     spanElement: HTMLElement,
//     timerSetting: timerSetting,
//     runCallbackAfterEnd: boolean,
//     callbackFunc: Function
//   ) {
//     this.givenSeconds = givenSeconds;
//     this.spanElement = spanElement;
//     this.timerSetting = timerSetting;
//     this.runCallbackAfterEnd = runCallbackAfterEnd;
//     this.callbackFunc = callbackFunc;

//     this.state = "Paused";
//   }

//   start(): boolean {
//     if (this.state == "Paused") {
//       this.state = "Running";
//       this.startTime = new Date().getTime();

//       return true;
//     } else {
//       console.log("ERROR: tried to start timer when timer is Running.");
//       return false;
//     }
//   }

//   pause(): boolean {
//     if (this.state == "Running") {
//       this.state = "Paused";
//       let pauseTime = new Date().getTime();

//       return true;
//     } else {
//       console.log("ERROR: tried to pause timer when timer is Paused.");
//       return false;
//     }
//   }

//   reset(): boolean {
//     if (this.state == "Paused") {
//       this.time = this.givenSeconds;
//       console.log(`Successfully reseted timer time to ${this.givenSeconds}.`);
//       return true;
//     } else {
//       console.log(`Timer is running. cannot reset time.`);
//       return false;
//     }
//   }
// }

class Timer {}

export { Timer };
