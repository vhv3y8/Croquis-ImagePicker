const Store = require("electron-store");
// import * as Store from "electron-store";

type appName =
  | "initPage"
  | "startingCroquis"
  | "Croquis"
  | "fileSelecter"
  | "fileSetting";

const userData = {
  setDefaultValue() {
    let userData = Store.get("userData");

    if (userData === undefined) {
      const defaultUserData = {};
    } else {
      console.log("User Data exists. end setting value.");
    }
  },

  setDefaultTheme() {
    let theme = Store.get("theme");
  },

  getTheme(appName: appName) {
    switch (appName) {
      case "initPage": {
        break;
      }
      case "startingCroquis": {
        break;
      }
      case "Croquis": {
        break;
      }
      case "fileSelecter": {
        break;
      }
      case "fileSetting": {
        break;
      }
    }
  },

  getAppData(appName: appName) {
    switch (appName) {
      case "initPage": {
        break;
      }
      case "startingCroquis": {
        break;
      }
      case "Croquis": {
        break;
      }
      case "fileSelecter": {
        break;
      }
      case "fileSetting": {
        break;
      }
    }
  },
};

export { userData };
