// const { webContents } = require("electron");
import { appName } from "../types/main";
import { appIds } from "./appId";
import { file } from "../database/fileTag";

interface selectedFilesTags {
  files: file[];
  tags: {
    must: string[];
    atleast: string[];
  };
}

interface CroquisInitial {
  files: file[];
  tags: {
    must: string[];
    atleast: string[];
  };
  config: {
    time: number;
    goal?: number;
    autopass: boolean;
  };
}

export { CroquisInitial, selectedFilesTags };
