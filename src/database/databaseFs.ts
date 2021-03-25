// import { dbFile } from "./fileTag";

const path = require("path");
const fs = require("fs");

const downloadsFolderPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  "Downloads"
);
const croquisFolderPath = path.join(downloadsFolderPath, "Croquis");
const configFilePath = path.join(croquisFolderPath, "CroquisData.json");

/** Check for Croquis folder and create it if it does not exist. */
function initialCheckCroquisfolder(): void {
  if (!fs.existsSync(croquisFolderPath)) {
    fs.mkdirSync(croquisFolderPath);
    console.log(`Created folder Croquis at ${downloadsFolderPath}.`);
  } else {
    console.log(`Croquis folder at ${downloadsFolderPath} exists.`);
  }
}

/** Check for CroquisConfig.json */
function initialCheckConfigFile(): void {
  // flow start
  if (!fs.existsSync(configFilePath)) {
    console.log("file does not exist. initializing config file.");
    const initialConfig = {
      tags: {
        default: [],
      },
      files: [],
    };
    let configContent: string = JSON.stringify(initialConfig, null, 2);
    fs.writeFileSync(configFilePath, configContent);
    console.log("config file successfully written.");
  } else {
    console.log("config file exists.");
  }
}

/** Update files in Croquis folder */

function updateFiles(configFile: dbFile): dbFile {
  let existingFiles = fs
    .readdirSync(croquisFolderPath)
    .filter((file) => file !== "CroquisData.json")
    .map((filename) => path.join(croquisFolderPath, filename));
  let configFiles = configFile.files.map((fileObj) => fileObj.address);
  console.log(existingFiles);
  console.log(configFiles);
  let configFileSet = new Set(configFiles);

  // update new files
  let newFileList = existingFiles.filter(
    (filename) => !configFileSet.has(filename)
  );
  console.log(newFileList);
  newFileList.forEach((filePath) => {
    configFile.files.push({
      address: filePath,
      tags: [],
    });
  });

  // update deleted files

  return configFile;
}

/** read write config file */

function getConfigFile(): dbFile {
  return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
}

function flushConfigFile(json: dbFile): void {
  fs.writeFileSync(configFilePath, JSON.stringify(json, null, 2));
  console.log("Successfully flushed config file.");
}

/**  */

export {
  initialCheckConfigFile,
  initialCheckCroquisfolder,
  updateFiles,
  getConfigFile,
  flushConfigFile,
};
