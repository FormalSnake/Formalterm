const {
  getTermBG,
  saveBGColor,
  getFont,
  saveFont,
  getBlur,
  saveBlur,
} = require("./settings");

const font = getFont();

document.getElementById("font").value = font;

document.getElementById("font").addEventListener("change", changeFont);

function changeFont() {
  saveFont(this.value);
}

const color = getTermBG();

document.getElementById("color").value = color;

document.getElementById("color").addEventListener("change", changeColor);

function changeColor() {
  saveBGColor(this.value);
}

const blur = getBlur();

if (blur == "true") {
  document.getElementById("blur").checked = true;
} else {
  document.getElementById("blur").checked = false;
}
document.getElementById("blur").addEventListener("change", changeBlur);

function changeBlur() {
  saveBlur(this.checked.toString());
}
