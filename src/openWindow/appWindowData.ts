const { screen } = require("electron");
const path = require("path");
import { appName } from "../types/main";

interface appWindowValue {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  parent?: appName;
  modal?: boolean;
}

const appWindowValueList: {
  [name in appName]: appWindowValue;
} = {
  initPage: {
    width: 350,
    height: 360,
    resizable: false,
  },
  startingCroquis: {
    width: 380,
    height: 565,
    resizable: false,
  },
  Croquis: {
    width: screen.getPrimaryDisplay().workAreaSize.width * 0.3 ?? 800,
    height: screen.getPrimaryDisplay().workAreaSize.height ?? 900,
    resizable: true,
    minWidth: 520,
  },
  fileSelecter: {
    width: 1000,
    height: 700,
    parent: "startingCroquis",
    modal: true,
  },
  filetagSetting: {
    width: 600,
    height: 850,
    // width: 400,
    // height: 600,
  },
};

const getAppUrl: {
  [name in appName]: string;
} = {
  initPage: "../app/initPage/index.html",
  startingCroquis: "../app/startingCroquis/index.html",
  Croquis: "../app/Croquis/index.html",
  fileSelecter: "../app/fileSelecter/index.html",
  filetagSetting: "../app/filetagSetting/index.html",
};

function getPreloadPath(appName: appName): string {
  return path.join(__dirname, "..", "app", appName, "preload.js");
}
// : {
//   [name in appName]: string;
// } = {
//   initPage: path.join(process.cwd(), "dist", "app", "initPage", "app.js"),
//   startingCroquis: "../app/startingCroquis/app.js",
//   Croquis: "../app/Croquis/app.js",
//   fileSelecter: "../app/fileSelecter/app.js",
//   fileSetting: "../app/filetagSetting/app.js",
// };

export { appWindowValueList, getAppUrl, getPreloadPath };
