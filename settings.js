const Store = require("electron-store");
const storage = new Store();

function getWinSettings() {
  const default_bounds = [800, 650];

  const size = storage.get("win-size");

  if (size) return size;
  else {
    storage.set("win-size", default_bounds);
    return default_bounds;
  }
}

function getTermBG() {
  const default_color = "rgba(26, 27, 38, 0.1)";

  const color = storage.get("term-color");

  if (color) return color;
  else {
    storage.set("term-color", default_color);
    return default_color;
  }
}

function saveBGColor(color) {
  storage.set("term-color", color);
  console.log("BG Color saved: ", color);
}

function saveBounds(bounds) {
  storage.set("win-size", bounds);
  console.log("Bounds saved: ", bounds);
}

module.exports = {
  getWindowSettings: getWinSettings,
  getTermBG: getTermBG,
  saveBGColor: saveBGColor,
  saveBounds: saveBounds,
};
