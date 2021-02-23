const HtmlWebpackPlugin = require("html-webpack-plugin");

const appNames = [
  "Croquis",
  "initPage",
  "startingCroquis",
  "fileSelecter",
  "filetagSetting",
];

module.exports = {
  entry: {},
  plugins: appNames
    .map((name) => "app/" + name + "/index.html")
    .map(
      (path) =>
        new HtmlWebpackPlugin({
          template: "src/" + path,
          filename: path,
        })
    ),
};
