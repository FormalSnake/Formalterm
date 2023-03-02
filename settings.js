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

function getFont() {
  const default_font = "FiraCode Nerd Font";

  const font = storage.get("term-font");

  if (font) return font;
  else {
    storage.set("term-font", default_font);
    return default_font;
  }
}

function getVibrancy() {
  const default_blur = "true";

  const blur = storage.get("win-blur", default_blur);

  if (blur) return blur;
  else {
    storage.set("win-blur", default_blur);
    return default_blur;
  }
}

function saveBlur(blur) {
  storage.set("win-blur", blur);
  console.log("Blur saved: ", blur);
}

function saveFont(font) {
  storage.set("term-font", font);
  console.log("Font saved: ", font);
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
  getFont: getFont,
  getBlur: getVibrancy,
  saveBlur: saveBlur,
  saveFont: saveFont,
  getWindowSettings: getWinSettings,
  getTermBG: getTermBG,
  saveBGColor: saveBGColor,
  saveBounds: saveBounds,
};
