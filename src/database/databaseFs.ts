import { dbFile } from "./fileTag";

const path = require("path");
const fs = require("fs");

const downloadsFolderPath = path.join(process.env.HOME, "Downloads");
const croquisFolderPath = path.join(downloadsFolderPath, "Croquis");
const configFilePath = path.join(croquisFolderPath, ".CroquisData.json");

/** Check for Croquis folder and create it if it does not exist. */
function initializeCroquisfolder(): void {
  if (!fs.existsSync(croquisFolderPath)) {
    fs.mkdirSync(croquisFolderPath);
    console.log(`Created folder Croquis at ${downloadsFolderPath}.`);
  } else {
    console.log(`Croquis folder at ${downloadsFolderPath} exists.`);
  }
}

/** Check for CroquisConfig.json */
function initializeConfigFile(): void {
  // flow start
  if (!fs.existsSync(configFilePath)) {
    console.log("file does not exist. initializing config file.");
    const initialConfig = {
      tags: {},
      files: [],
    };
    let configContent: string = JSON.stringify(initialConfig, null, 2);
    fs.writeFileSync(configFilePath, configContent);
    console.log("config file successfully written.");
  } else {
    console.log("config file exists.");
  }
}

/** read write config file */

function getConfigFile(): dbFile {
  return JSON.parse(fs.readFileSync(configFilePath));
}

function flushConfigFile(json: dbFile): void {
  fs.writeFileSync(configFilePath, JSON.stringify(json, null, 2));
  console.log("Successfully flushed config file.");
}

/**  */

export {
  initializeConfigFile,
  initializeCroquisfolder,
  getConfigFile,
  flushConfigFile,
};
