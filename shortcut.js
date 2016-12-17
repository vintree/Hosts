const electron = require('electron')
const {
    app,
    globalShortcut
} = electron

exports.cmd_w = function() {
    globalShortcut.register('cmd+w', () => {
        app.hide()
    })
}

exports.cmd_f = function() {
    globalShortcut.register('cmd+f', () => {
        console.log('cmd+f');
    })
}

exports.unregisterAll = function() {
    globalShortcut.unregisterAll()
}