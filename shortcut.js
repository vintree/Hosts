const electron = require('electron')
const {
    app,
    ipcMain,
    globalShortcut
} = electron


// ipcMain.on('search-message', function (event, arg) {
//     console.log(arg)  // prints "ping"
//     event.sender.send('search-reply', 'pong')
//     // console.log(globalShortcut.isRegistered('CmdOrCtrl+f'));
//     // if(globalShortcut.isRegistered('CmdOrCtrl+f')) {
//     //     console.log('CmdOrCtrl+f');
//     // }
// })


exports.cmdOrCtrl_w = function() {
    globalShortcut.register('CmdOrCtrl+w', () => {
        app.hide()
    })
}

exports.cmdOrCtrl_f = function() {
    ipcMain.on('search-message', function (event, arg) {
        if(!globalShortcut.isRegistered('CmdOrCtrl+f')) {
            globalShortcut.register('CmdOrCtrl+f', () => {
                event.sender.send('search-reply', 'trigger')
            })
        }
    })

    // globalShortcut.register('cmd+f', () => {
        // console.log('===============cmd+f', searchEvent);
        // ipcMain.on('synchronous-message', function (event, arg) {
        //     console.log(arg)  // prints "ping"
        //     event.returnValue = 'pong'
        // })
    // })
}

exports.unregisterAll = function() {
    globalShortcut.unregisterAll()
}