const electron = require('electron')
const {
    app, 
    Menu, 
    BrowserWindow, 
    dialog,
    shell, 
    globalShortcut, 
    Tray,
    ipcMain
} = electron
const path = require('path')
const packages = require('./package')
const ipAdress = require('./model/ip-adress')


// const { allPlugin } = require('./model/plugin/core')
// allPlugin()
let win = null
let isQuit = false
function createWindow() {
    // 创建一个新的浏览器窗口
    win = new BrowserWindow({
        width: 1024,
        height: 600,
        minWidth: 1024, 
        minHeight: 600
    });
    win.loadURL(`file://${__dirname}/app/index.html`)

    // 打开开发工具页面
    // win.webContents.openDevTools()

    require('./menu')()
    require('./tray')(win)

    globalShortcut.register('cmd+w', function() {
        app.hide()
    })
    // 当窗口关闭时调用的方法
    win.on('close', (event) => {})

    win.on('closed', (event) => {
        win = null
        app.quit()
        globalShortcut.unregisterAll()
    })

    // shell.openExternal('https://taobao.com')
    // shell.openItem(`${__dirname}/index.html`)
    // shell.beep()
    // console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}));
}

app.on('ready', createWindow)

// app.dock.setIcon('http://img5.imgtn.bdimg.com/it/u=163029786,1788419189&fm=21&gp=0.jpg')

app.on('before-quit', (event) => {})

app.on('will-quit', (event) => {})

app.on('quit', (event) => {})

app.on('window-all-closed', () => {
    // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
    if (process.platform !== 'darwin') {
        console.log('all-closed');
        app.quit();
    }
});

app.on('activate', () => {
// 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
    if (win === null) {
        createWindow()
    } else {
        win.show()
    }
});

app.on('browser-window-blur', function() {
    globalShortcut.unregisterAll()
})
app.on('browser-window-focus', function() {
    globalShortcut.register('cmd+w', function() {
        app.hide()
    })
})