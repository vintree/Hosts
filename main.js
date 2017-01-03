const electron = require('electron')
const {
    app, 
    Menu, 
    BrowserWindow, 
    dialog,
    shell, 
    globalShortcut, 
    Tray,
    ipcMain,
    autoUpdater
} = electron
const shortcut = require('./shortcut')
const path = require('path')
const packages = require('./package')
const ipAdress = require('./model/ip-adress')

let win = null
let isQuit = false
function createWindow() {
    // 创建一个新的浏览器窗口
    // 防止在Mac未关闭程序重新活关机时，自动运行导致重新创建对象
    if(!win) {
        win = new BrowserWindow({
            width: 1024,
            height: 600,
            minWidth: 1024, 
            minHeight: 600
        });
    }
    win.loadURL(`file://${__dirname}/app/index.html`)

    // 打开开发工具页面
    // win.webContents.openDevTools()

    require('./menu')()
    require('./tray')(win)
    shortcut.cmdOrCtrl_f('init')
    // console.log(win);
    // shortcut.cmd_f(win)
    // win.webContents.send('ping', 'whoooooooh!11111')
    // win.webContents.on('did-finish-load', function () {
    //     console.log('1111111');
    //     win.webContents.send('ping', 'whoooooooh!')
    // })

    // shortcut.cmd_f()
    // 自动更新
    // autoUpdater.on("error", function(err, msg) {
    //     console.log(msg); //print msg , you can find the cash reason.
    // });
    // const feedUrl = 'http://ea-todo.herokuapp.com/updates/latest'
    // autoUpdater.setFeedURL(feedUrl);

    // autoUpdater.setFeedURL('https://github.com/wuguzi/Hosts/releases/download/1.2.0/Hosts-1.2.0.dmg')
    // autoUpdater.checkForUpdates('http://localhost:3000/')

    // autoUpdater.on('checking-for-update', () => {
    //     console.log('1');
    // })
    // autoUpdater.on('update-available', () => {
    //     console.log('2');
    // })
    // autoUpdater.on('update-not-available', () => {
    //     console.log('3');
    // })
    // autoUpdater.on('update-downloaded', (data) => {
    //     console.log('4', data);
    //     autoUpdater.quitAndInstall()
    // })
    // autoUpdater.on('error', () => {
    //     console.log('5');
    // })

    // 下载
    win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
        const totalBytes = item.getTotalBytes();
        const filePath = path.join(app.getPath('downloads'), item.getFilename());
        item.setSavePath(filePath);

        item.on('updated', (event, state) => {
            win.setProgressBar(item.getReceivedBytes() / totalBytes);
        })
    
        item.on('done', (e, state) => {
            //如果窗口还在的话，去掉进度条
            if (win && !win.isDestroyed()) {
                win.setProgressBar(-1);
            }
                
            //下载被取消或中断了
            if (state === 'interrupted') {
                electron.dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
            }
                
            //下载完成，让 dock 上的下载目录Q弹一下下
            if (state === 'completed') {
                app.dock.downloadFinished(filePath);
            }
        })
    })

    // 当窗口关闭时调用的方法
    win.on('close', (event) => {})

    win.on('closed', (event) => {
        win = null
        app.quit()
        shortcut.unregisterAll()
    })
    shortcut.cmdOrCtrl_w()
    // shell.openExternal('https://taobao.com')
    // shell.openItem(`${__dirname}/index.html`)
    // shell.beep()
}

app.on('ready', createWindow)

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
        // createWindow()
    } else {
        win.show()
    }
});

app.on('browser-window-blur', function() {
    shortcut.unregisterAll()
})
app.on('browser-window-focus', function() {
    shortcut.f12()
    shortcut.cmdOrCtrl_w()
    shortcut.cmdOrCtrl_f()
})