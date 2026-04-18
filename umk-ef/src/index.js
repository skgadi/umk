const { app: app, BrowserWindow: BrowserWindow } = require("electron"),
  path = require("path");
require("electron-squirrel-startup") && app.quit();
const createWindow = () => {
  const e = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !1,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // --- ADD THESE TWO HANDLERS ---

  // 1. Grant permission to ALL serial devices permanently for this session
  e.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial") return true;
    return false;
  });

  // 2. Return the full list to the renderer instead of picking one
  // Note: navigator.serial.requestPort() expects ONE port ID.
  // To "see" all of them, use navigator.serial.getPorts() in your frontend.
  let usedPortIds = new Set(); // Track ports we've already handed out

  e.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      event.preventDefault();

      // Find the first port in the list that HASN'T been used yet
      const availablePort = portList.find(
        (port) => !usedPortIds.has(port.portId),
      );

      if (availablePort) {
        usedPortIds.add(availablePort.portId); // Mark as used
        callback(availablePort.portId);
      } else {
        // If all are used, maybe reset the list or return nothing
        console.log("No new ports available.");
        callback("");
      }
    },
  );

  // --- END OF NEW HANDLERS ---

  (e.on("close", function (e) {
    const o = require("electron").dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "Unsaved data will be lost.\n\nAre you sure you want to quit?",
    });
    1 === o && e.preventDefault();
  }),
    e.loadFile(path.join(__dirname, "index.html")),
    e.setMenu(null),
    e.maximize());
};
(app.on("ready", createWindow),
  app.on("window-all-closed", () => {
    "darwin" !== process.platform && app.quit();
  }),
  app.on("activate", () => {
    0 === BrowserWindow.getAllWindows().length && createWindow();
  }));
