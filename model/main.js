/**
 *  author: puxiao
 *  time: 2016-10-22
 *  des 初始化入口，存在公共参数
 */
const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const mkdir = require('./mkdir')
const download = require('./down')
// const DBHost = require('../db-model/host')
// const DBPlugin = require('../db-model/plugin')
function defaultDirPath() {
    return {
        db: `${userData}/db`,
        Plugin: `${userData}/Plugin`,
        DevPlugin: `${userData}/DevPlugin`
    }
}

function createDir() {
    let defaultDirPaths = defaultDirPath()
    let keys = Object.keys(defaultDirPaths)
    keys.map((key, i) => {
        mkdir(defaultDirPaths[key])
    })
}

function createTable() {
    require('../db-model/host').create()
    require('../db-model/plugin').create()
}

function initPlugin() {
    const Plugin = require('./plugin/core')
    Plugin.allPlugin()
}

function initConfigsMain() {
    const tempOpt = {
        name: 'main.json',
        outPath: `${userData}/Configs`,
        url: "https://raw.githubusercontent.com/wuguzi/Hosts/master/Configs/main.json"
    }
    download('configMain', tempOpt, tempOpt.url)
}

module.exports = {
    init: function() {
        createDir()
        createTable()
        initPlugin()
        initConfigsMain()
    },
    defaultDirPath
}