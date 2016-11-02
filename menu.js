const { Menu } = require('electron')
const packages = require('./package')
const template = [
  {
    label: '编辑',
    submenu: [
      {
        label: '撤消',
        role: 'undo'
      },
      {
        label: '恢复',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
      {
        label: '删除',
        role: 'delete'
      },
      {
        label: '全选',
        role: 'selectall'
      }
    ]
  },
  {
    label: '视图',
    submenu: [
      {
        label: '刷新',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: '开发者工具',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        role: 'minimize'
      },
      {
        label: '关闭',
        role: 'close'
      }
    ]
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://www.zhihu.com/people/wuguzi') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
// 已过时
  const name = require('electron').app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: `关于 ${packages.name}`,
        role: 'about'
      },
      // {
      //   type: 'separator'
      // },
      // {
      //   label: '偏好设置',
      //   role: 'services'
      // },
      {
        type: 'separator'
      },
      {
        label: `隐藏 ${packages.name}`,
        role: 'hide'
      },
      {
        label: '隐藏其他应用',
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: `退出 ${packages.name}`,
        role: 'quit',
        click (item, focusedWindow) {
        }
      }
    ]
  })
  // Window menu.
  template[3].submenu = [
    {
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
module.exports = function menus() {
    Menu.setApplicationMenu(menu)
}