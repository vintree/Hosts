/**
 *  author: puxiao
 *  time: 2016-10-21
 *  des: 命令行匹配
 */
const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const path = require('path')
const fs = require('fs')
const mkdir = require('../mkdir')

module.exports = function init(command) {
    if(command !== '') {
        let cmd = command.match(/(\S+)/ig)
        if(cmd[0].toLowerCase() === 'p') {
            let packagePath = path.join(userData, 'Configs')
            if(mkdir(packagePath)) {
                let packages = fs.readFileSync(`${packagePath}/plugins.json`, 'utf-8')
                packages = JSON.parse(packages)
                let url = packages['plugin'][cmd[1]]
                let tag = url ? 'package' : 'git'
                // 不在package找到组件名，从url中命令中获取
                const name = url ? cmd[1] : cmd[1].match(/Hosts-(.*).git/)[1]
                url = url ? url : cmd[1]
                require('../plugin/core').addPlugin({
                    name: name,
                    tag: tag
                }, url)
            }
        }
    }
}