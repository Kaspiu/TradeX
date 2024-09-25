const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const devValue = false;

function createWindow() {
  let win = new BrowserWindow({
    width: 1400,
    height: 850,
    title: "TradeX",
    icon: "./app/images/logo.png",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });

  win.loadFile("./app/index.html");
  if (devValue === true) {
    win.webContents.openDevTools();
  }

  // Titlebar buttons
  ipcMain.on("close-app", () => {
    win.close();
  });

  ipcMain.on("minimize-app", () => {
    win.minimize();
  });

  ipcMain.on("maximize-app", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
});
