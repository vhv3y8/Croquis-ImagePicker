// var { ipcRenderer } = require("electron");
// import { Stack } from "../../utils/stack";
// import { Timer, TimerUI } from "./timer";

// interface CroquisInitial {
//   filePaths: string[];
//   tags: {
//     must: string[];
//     atleast: string[];
//   };
//   config: {
//     time: number;
//     goal?: number;
//     autopass: boolean;
//   };
// }

// class Stack {
//   private arr: any[];

//   constructor() {
//     this.arr = [];
//   }

//   push(elem): void {
//     this.arr.push(elem);
//   }

//   pop(): any {
//     return this.arr.pop();
//   }

//   show(): void {
//     console.log(this.arr);
//   }

//   isEmpty(): boolean {
//     if (this.arr.length === 0) {
//       return true;
//     } else {
//       return false;
//     }
//   }
// }

// class Timer {
//   private defaultTime: number;
//   private time: number;
//   private state: "Running" | "Stopped";
//   private startingTime: number;
//   private intervalFunc: Function;

//   constructor(seconds: number) {
//     this.time = seconds * 1000;
//     this.defaultTime = seconds * 1000;
//   }

//   getState() {
//     return this.state;
//   }

//   timeLeft() {
//     return this.time;
//   }

//   start() {
//     if (this.state == "Stopped") {
//       this.startingTime = new Date().getTime();
//       this.state = "Running";
//       return this.time;
//     }
//   }

//   pause() {
//     if (this.state == "Running") {
//       let curr = new Date().getTime();
//       this.state = "Stopped";
//       this.time -= curr - this.startingTime;
//     }
//   }

//   reset() {
//     if (this.state == "Stopped") {
//       this.time = this.defaultTime;
//     }
//   }

//   // forceReset() {
//   //   /** Only use it at doneButton! */
//   //   this.time = this.defaultTime;
//   // }
// }

// class TimerUI {
//   private milliSeconds: number;
//   private elem: HTMLElement;

//   constructor(milliSeconds, element) {
//     this.milliSeconds = milliSeconds;
//     this.elem = element;

//     let sec = Math.floor(this.milliSeconds / 1000);
//     this.setTime(sec);
//   }

//   setTime(seconds: number): void {
//     let min = Math.floor(seconds / 60);
//     this.elem.innerHTML = "";
//   }
// }
