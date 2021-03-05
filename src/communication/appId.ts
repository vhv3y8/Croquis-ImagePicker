import { appName } from "../types/main";

type appIdSaver = {
  [name in appName]: number;
};

let appIds: appIdSaver = {
  initPage: undefined,
  startingCroquis: undefined,
  Croquis: undefined,
  fileSelecter: undefined,
  fileSetting: undefined,
};

function setId(name: appName, num: number) {
  appIds[name] = num;
  console.log(appIds);
}

export { appIds, setId };
