import { appName } from "./types/main";
const { ipcMain, webContents } = require("electron");

/* about datas stored at main process */

/* about app id */

/* data formats */

interface tag {
  tag: string;
}

interface tagList {
  [tagNum: number]: tag;
}

interface file {
  filename: string;
  tags: number[];
}

interface croquisTag {
  must: number[];
  atleast: number[];
}

interface croquisData {
  files: file[];
  tags: croquisTag;
  config: {
    time: number;
    goal: number;
    autopass: boolean;
  };
}

interface startingCroqiusFileData {
  must: string[];
  atleast: string[];
  count: number;
}

/* define datas */

var selectedFiles: file[];
var selectedTags: tagList;
var croquisAppData: croquisData;

/* */

ipcMain.on("startingCroquis-to-fileSelecter", (event, data) => {
  // 파일 목록, 선택된 태그 목록, 숨길지 말지 여부, 된다면 스크롤 위치까지.
});

ipcMain.on("startingCroquis-to-Croquis", (event, data: croquisData) => {});

export { croquisTag, startingCroqiusFileData, croquisAppData };
