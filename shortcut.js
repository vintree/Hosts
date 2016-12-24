const electron = require('electron')
const {
    app,
    ipcMain,
    globalShortcut,
    BrowserWindow
} = electron

let searchEvent = null

ipcMain.on('search-message', function (event, arg) {
    searchEvent = event
})

function doRegister(cmd, callback) {
    globalShortcut.register(cmd, callback);
}



exports.cmdOrCtrl_w = function() {
    doRegister('CmdOrCtrl+w', () => {
        app.hide()
    })
    // globalShortcut.register('CmdOrCtrl+w', () => {
    //     app.hide()
    // })
}

exports.f12 = function() {
    doRegister('F12', function() {
        var win = BrowserWindow.getFocusedWindow();
        win.webContents.toggleDevTools();
        console.log("toggleDevTools F12");
    });
}

exports.cmdOrCtrl_f = function() {
    // globalShortcut.register('CmdOrCtrl+f', () => {
    //     searchEvent.sender.send('search-reply', 'trigger')
    // })
}

exports.unregisterAll = function() {
    globalShortcut.unregisterAll()
}