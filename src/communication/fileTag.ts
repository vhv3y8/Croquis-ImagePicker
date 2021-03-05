const Store = require("electron-store");

const store = new Store();

/** set Interfaces */

interface file {
  filename: string;
  tags: number[];
  address: string;
}

interface tagDB {
  [tagNum: number]: string;
}

let a: tagDB = {
  0: "hi",
  1: "hell",
  3: "hihihih",
};

/** Converter Functions */

function tagNumToString(tagNum: number): string {
  return "hi";
}

function tagStringtoNum(tagString: string): number {
  return 1;
}

/** File Data */

function getFileDB(): file[] {
  return;
}

function updateFileList() {
  // update for new added files
  // update for deleted files
}

/** Tag Data */

function getTagDB(): tagDB {
  return;
}
