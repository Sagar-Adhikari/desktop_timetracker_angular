// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  dialog,
} = require("electron");
const path = require("path");
// Type 3: Persistent datastore with automatic loading
var Datastore = require("nedb");

const keytar = require("keytar");

db = new Datastore({ filename: "rn_tt.db", autoload: true });
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    icon: "assets/logo-black.PNG",
    frame: true,
  });

  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile("dist/index.html");
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("close", function (e, args) {
    console.log("closed");
    e.preventDefault();
    db.find({}, function (err, arg) {
      console.log("Main Windows on close :", arg);
      arg.forEach((item) => {
        if (item.status == true) {
          dialog.showErrorBox(
            "Timer is running",
            "Stop the timer and and Close "
          );
        } else {
          console.log("Else block is called!");
          mainWindow.destroy()
          // mainWindow = null;
          // app.quit();
        }
      });
    });

    // mainWindow = null;
    // app.quit();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("db_get", (event, args) => {
  // Find all documents in the collection
  db.find({}, function (err, docs) {
    if (err != null) {
      mainWindow.webContents.send("dbGetRespError", err);
    } else {
      mainWindow.webContents.send("dbGetResp", docs);
    }
  });
});

ipcMain.on("db_insert", (event, args) => {
  db.insert(args, function (err, newDoc) {
    // Callback is optional
    if (err != null) {
      mainWindow.webContents.send("dbInsertRespError", err);
    } else {
      // newDoc is the newly inserted document, including its _id
      mainWindow.webContents.send("dbInsertResp", newDoc);
    }
  });
});

ipcMain.on("db_remove", (event, args) => {
  // Remove one document from the collection
  // options set to {} since the default for multi is false
  db.remove({ _id: args }, {}, function (err, numRemoved) {
    if (err != null) {
      mainWindow.webContents.send("dbRemoveRespError", err);
    } else {
      // numRemoved = 1
      mainWindow.webContents.send("dbRemoveResp", numRemoved);
    }
  });
});

ipcMain.on("startScreenshot", (event, args) => {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          try {
            mainWindow.webContents.send("screenshotResp", source.id);
          } catch (e) {
            console.log(e);
            mainWindow.webContents.send("screenshotRespError", e);
          }
        }
      }
    });
});

ipcMain.on("getPassword", (event, args) => {
  keytar.getPassword({ service: args.service, account: args.userEmail });
});

ipcMain.on("savePassword", (event, args) => {
  keytar.setPassword({
    service: args.service,
    account: args.userEmail,
    password: args.password,
  });
});

ipcMain.on("deletePassword", (event, args) => {
  keytar.deletePassword({ service: args.service, account: args.userEmail });
});

ipcMain.on("findPassword", (event, args) => {
  keytar.findCredentials(args.service).then(async (sources) => {
    if (sources) {
      mainWindow.webContents.send("findCredentials", sources);
    }
  });
});

ipcMain.on("open-dialog-box", (event, args) => {
  dialog.showErrorBox("Timer is running", "Stop the timer and and Close ");
});

// ipcMain.on("db_update", (event, args) => {
//   console.log("update arg", args);
//   db.update({ session: args }, {}, function (err, numRemoved) {
//     if (err != null) {
//       mainWindow.webContents.send("dbUpdateRespError", err);
//     } else {
//       mainWindow.webContents.send("dbUpdateResp", numRemoved);
//     }
//   });
// });

ipcMain.on("onClose", (event, status) => {
  console.log("session status", status);

  db.find({}, function (err, dbValue) {
    console.log("arg", dbValue);
    if (dbValue.length == 0) {
      db.insert({ status: status }, function (err, newDoc) {
        console.log(" null case value :", status);

      });
    } else {
      dbValue.forEach((item) => {
        console.log("item > 0:", item);
        if (status == true) {
          if (item.status == true) {
             // db.update({ _id: item._id }, { $min: { value: item.status } }, {}, function () {
        //   // The document will be updated to { _id: 'id', name: 'Name', value: 2 }
        // });
            db.remove({ _id: item._id }, {}, function (err, numRemoved) {

            });
          } else {
            db.insert({ status: item.status }, function (err, newDoc) {

            });
          }
        } else {
          db.remove({ _id: item._id }, {}, function (err, numRemoved) {

          });
        }
      });
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on("window-all-closed", function (event, arg) {
  console.log(arg, "args from app close.");
  event.preventDefault();
  // if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
