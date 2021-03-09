const { screen } = require("electron");
import { appName } from "./types/main";

interface appWindowValue {
  width: number;
  height: number;
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
    height: 560,
    resizable: false,
  },
  Croquis: {
    width: screen.getPrimaryDisplay().workAreaSize.width * 0.3 ?? 800,
    height: screen.getPrimaryDisplay().workAreaSize.height ?? 900,
    resizable: true,
  },
  fileSelecter: {
    width: 1000,
    height: 700,
    parent: "startingCroquis",
    modal: true,
  },
  fileSetting: {
    width: 600,
    height: 850,
  },
};

const getAppUrl: {
  [name in appName]: string;
} = {
  initPage: "../app/initPage/index.html",
  startingCroquis: "../app/startingCroquis/index.html",
  Croquis: "../app/Croquis/index.html",
  fileSelecter: "../app/fileSelecter/index.html",
  fileSetting: "../app/filetagSetting/index.html",
};

export { appWindowValueList, getAppUrl };
