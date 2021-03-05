const path = require("path");
const configFileAddress = path.join(process.env.HOME, "Downloads");
console.log(configFileAddress);
console.log("************************");

export { configFileAddress };
