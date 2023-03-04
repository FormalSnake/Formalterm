// This gets the ipc from electron
const ipc = require("electron").ipcRenderer;
const Terminal = require("xterm").Terminal;
const { FitAddon } = require("xterm-addon-fit");
// This imports the webGL addon for xterm, which allows for gpu acceleration
const { WebglAddon } = require("xterm-addon-webgl");
const { LigaturesAddon } = require("xterm-addon-ligatures");
const { ImageAddon } = require("xterm-addon-image");
const { WebLinksAddon } = require("xterm-addon-web-links");
const { Unicode11Addon } = require("xterm-addon-unicode11");

class WebViewLinksAddon extends WebLinksAddon {
  openWebLink(link) {
    ipcRenderer.send("open-url-in-webview", link);
  }
}

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
term.loadAddon(new WebViewLinksAddon());
term.loadAddon(new Unicode11Addon());
term.onRender = function () {
  fitAddon.fit();
};
window.onresize = function () {
  // Logs the window dimensions when resized
  //log();
  fitAddon.fit();
};
/*
if (term.onCursorMove) {
  this.disposableListeners.push(
    this.term.onCursorMove(() => {
      const cursorFrame = {
        x:
          this.term.buffer.active.cursorX *
          this.term._core._renderService.dimensions.actualCellWidth,
        y:
          this.term.buffer.active.cursorY *
          this.term._core._renderService.dimensions.actualCellHeight,
        width: this.term._core._renderService.dimensions.actualCellWidth,
        height: this.term._core._renderService.dimensions.actualCellHeight,
        col: this.term.buffer.active.cursorX,
        row: this.term.buffer.active.cursorY,
      };
      term.onCursorMove?.(cursorFrame);
    })
  );
}*/
