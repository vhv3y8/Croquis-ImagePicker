var { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    // let validChannels = ["toMain"];
    // if (validChannels.includes(channel)) {
    ipcRenderer.send(channel, data);
    // }
  },
  receive: (channel, func) => {
    let validChannels = ["getInitialData"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

// https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron

window.addEventListener("DOMContentLoaded", function () {});

// ipcRenderer.on("getInitialData", (event, data) => {
//   console.log("getted INitial data!!!!!!!!");
//   console.log(data);
//   appData = data;
// });
