// This gets the ipc from electron
const ipc = require("electron").ipcRenderer;
const Terminal = require("xterm").Terminal;
const { FitAddon } = require("xterm-addon-fit");
// This imports the webGL addon for xterm, which allows for gpu acceleration
const { WebglAddon } = require("xterm-addon-webgl");
const { LigaturesAddon } = require("xterm-addon-ligatures");
const { ImageAddon } = require("xterm-addon-image");

const { getTermBG, saveBGColor, getFont, saveFont } = require("./settings");

const bgColor = getTermBG();
const font = getFont();

var term = new Terminal({
  theme: {
    background: bgColor,
  },
  fontFamily: font,
  // This gives the terminal name to other programs like neofetch
  termProgram: "Formalterm",
  experimentalCharAtlas: "dynamic",
  // This allows xterm.js to use rgba backgrounds
  allowTransparency: "true",
  cursorBlink: false,
  rendererType: "webgl",
  allowProposedApi: true,
});
console.log(getTermBG);
document.body.style.backgroundColor = bgColor;

const fitAddon = new FitAddon();

// Writes incoming data from the pty process into xterm.js
ipc.on("terminal.incomingData", (event, data) => {
  term.write(data);
  term.refresh(0, term.rows - 1);
});
// Does the same kindof
term.onData((e) => {
  ipc.send("terminal.keystroke", e);
});
// To debug the background color, enable if needed
// console.log(bgColor);
// This resizes the pty process itself
term.onResize(function (size) {
  ipc.send("terminal.resize", size);
});
// This writes the version number into the terminal window
//term.write("Kaiium V1.1.0 ");
// This handles the copy and paste for the pty process
term.attachCustomKeyEventHandler((arg) => {
  if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
    navigator.clipboard.readText().then((text) => {
      term.write(text);
    });
  }
  return true;
});

term.open(document.getElementById("terminal-container"));
const webgl = new WebglAddon();
term.loadAddon(webgl);
term.loadAddon(fitAddon);
fitAddon.fit();
const ligaturesAddon = new LigaturesAddon();
term.loadAddon(ligaturesAddon);
term.loadAddon(new ImageAddon());
term.onRender = function () {
  fitAddon.fit();
};
window.onresize = function () {
  // Logs the window dimensions when resized
  //log();
  fitAddon.fit();
};
