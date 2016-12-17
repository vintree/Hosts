const electron = require('electron')
const packages = require('./package')
const path = require('path');
const ipAdress = require('./model/ip-adress')
const { 
    app, 
    Tray, 
    Menu, 
    ipcMain, 
    clipboard 
} = electron
const iconPath = path.join(__dirname, 'icon_16x16@2x.png')
const tray = new Tray(iconPath);
let template = []
let tempEvent = null
let tempArg = null
let isRefresh = null
let defaultWin = null

function setTray(event, arg, win) {
    tempEvent = event
    tempArg = arg
    template = [{
        label: `${packages.name}`,
        click: function() {
            if(win.isVisible()) {
                app.hide()
            } else {
                win.show()
            }
        }
    },{
        type: 'separator'
    }]
    let hostList = arg.hostList
    if(hostList !== undefined) {
        hostList = !!hostList && hostList.map((v, i) => {
            return {
                label: v.name,
                type: 'checkbox',
                checked: v.switched,
                accelerator: (i + 1) + '',
                click: function() {
                    event.sender.send('hostList', {
                        id: v.id,
                        switched: !v.switched
                    })
                }
            }
        })
        template = template.concat(hostList)
    }
    template.push({
        type: 'separator'
    })
    template.push({
        label: '刷新',
        click: function() {
            isRefresh = true
            if(tempEvent && tempArg) {
                setTray(tempEvent, tempArg, defaultWin)
            }
        }
    })
    template.push({
        type: 'separator'
    })
    let ipAdressed = ipAdress()
    template.push({
        label: `${!!ipAdressed ? ipAdressed + '（点击复制）' : '离线状态'}`,
        click: function() {
            clipboard.writeText(`${!!ipAdressed ? ipAdressed : '离线状态'}`)
            if(tempEvent && tempArg) {
                setTray(tempEvent, tempArg, defaultWin)
            }
        }
    })
    template.push({
        type: 'separator'
    })
    template.push({
        label: `退出${packages.name}`,
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
    })
    var contextMenu = Menu.buildFromTemplate(template);
    if(isRefresh === null) {
        tray.setContextMenu(contextMenu)
    } else {
        isRefresh = null
        tray.popUpContextMenu(contextMenu)
    }

}

module.exports =  function handleTray(win) {
    defaultWin = win
    let t = undefined
    ipcMain.on('hostList', function(event, arg) {
        setTray(event, arg, defaultWin)
    })
}