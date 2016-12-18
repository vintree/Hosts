const electron = require('electron')
const {
    app,
    ipcMain,
    globalShortcut
} = electron

let searchEvent = null
ipcMain.on('search-message', function (event, arg) {
    searchEvent = event
})

exports.cmdOrCtrl_w = function() {
    globalShortcut.register('CmdOrCtrl+w', () => {
        app.hide()
    })
}

exports.cmdOrCtrl_f = function() {
    // globalShortcut.register('CmdOrCtrl+f', () => {
    //     searchEvent.sender.send('search-reply', 'trigger')
    // })
}

exports.unregisterAll = function() {
    globalShortcut.unregisterAll()
}