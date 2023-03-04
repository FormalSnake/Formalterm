require("v8-compile-cache");

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
// Imports node-pty, which is required for the actual terminal process
const pty = require("node-pty");
// Gets the os you are on, to switch between eg. bash and zsh depending on your operating system
const os = require("os");
// This is the auto updater that updates the application when a new version comes out.
const { autoUpdater } = require("electron-updater");
const {
  getWindowSettings,
  saveBounds,
  getBlur,
  saveBlur,
} = require("./settings");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const bounds = getWindowSettings();
  console.log(bounds);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: bounds[0],
    height: bounds[1],
    center: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      allowRunningInsecureContent: true,
    },
  });
  const blurStat = getBlur();
  if (blurStat == "true") {
    mainWindow.setVibrancy("hud");
  } else {
    mainWindow.setVibrancy(null);
  }

  mainWindow.on("resized", () => saveBounds(mainWindow.getSize()));

  const shell = os.platform() === "win32" ? "powershell.exe" : "/bin/zsh";

  //ipcing
  // This starts the pty process, with basic terminal configurations
  let ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 152,
    rows: 41,
    cwd: process.env.HOME,
    useFlowControl: false,
    env: process.env,
  });

  // This sends your input to the ptyProcess
  ptyProcess.on("data", function (data) {
    mainWindow.webContents.send("terminal.incomingData", data);
    // console.log("Sent data to terminal");
    // console.log(data);
  });

  // Exits the application
  ptyProcess.onExit((exitCode) => {
    app.quit();
  });

  /*ptyProcess.onData((data) => {
  console.log(data);
});*/
  // Write in the terminal
  ipcMain.on("terminal.keystroke", (event, key) => {
    ptyProcess.write(key);
  });
  // This resizes the terminal when called
  ipcMain.on("terminal.resize", (event, size) => {
    ptyProcess.resize(size.cols, size.rows);
    console.log("resized");
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  // This checks if there is a new version available, and notifies it to the process
  autoUpdater.checkForUpdatesAndNotify();
  // When there is an update available, it changes the window to the updating screen
  autoUpdater.on("update-available", function () {
    mainWindow.loadURL(`file://${__dirname}/updater/updater.html`);
  });
  globalShortcut.register("CommandOrControl+,", () => {
    mainWindow.loadURL(`file://${__dirname}/settings.html`);
  });
  // When the update has been downloaded, it quits the application and installs it
  autoUpdater.on("update-downloaded", (updateInfo) => {
    setTimeout(() => {
      autoUpdater.quitAndInstall();
      app.exit();
    }, 10000);
  });
  ipcMain.on("open-url-in-webview", (event, url) => {
    const win = new BrowserWindow({
      width: bounds[0],
      height: bounds[1],
      center: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        allowRunningInsecureContent: true,
      },
    });

    win.loadURL(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function relaunchApp() {
  app.relaunch();
  app.quit();
}
