/**
 *  author: puxiao
 *  time: 2016-10-22
 *  des: Hosts插件核心内容
 */
const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const fs = require('fs')
const DBPlugin = require('../../db-model/plugin')
const command = require('../command/core')
const { defaultDirPath } = require('../main')
const mkdir = require('../mkdir')
const { rm } = require('shelljs')

function traversePlugin(type, pluginsPath) {
    let pluginList = fs.readdirSync(pluginsPath)
    pluginList.map((plugin, i) => {
        let pluginPath = `${pluginsPath}/${plugin}`
        let states = fs.statSync(pluginPath)
        if(states.isDirectory()) {
            const pluginPackages = `${pluginPath}/package.json`
            const pluginIndex = `${pluginPath}/dist/index.js`
            const pluginIcon = `${pluginPath}/icons/app.png`
            if(fs.existsSync(pluginPackages)) {
                let packages = fs.readFileSync(`${pluginPath}/package.json`, 'utf-8')
                packages = JSON.parse(packages)
                packages.icons = `${pluginPath}/${packages.icons}`
                packages.pluginPath = pluginPath
                packages.outPath = `${pluginPath}/dist/index.js`
                let config = {
                    name: packages.name,
                    version: packages.version, 
                    icons: packages.icons,
                    pluginPath: packages.pluginPath,
                    outPath: packages.outPath,
                    packagePath: pluginPackages
                }
                if(type === 'dev') {
                    config['dev'] = true,
                    config['switch'] = packages.switch
                    DBPlugin.addDev(packages.name, config)
                    return
                }
                DBPlugin.addReleas(packages.name, config)
            } else {
                console.warn(`${pluginPath}/package.json文件不存在`);
                rm('-rf', `${pluginPath}`)
            }

            // fs.existsSync(`${pluginPath}/package.json`, (exists) => {
            //     if(exists) {
            //         let packages = fs.readFileSync(`${pluginPath}/package.json`, 'utf-8')
            //         packages = JSON.parse(packages)
            //         packages.icons = `${pluginPath}/${packages.icons}`
            //         packages.pluginPath = pluginPath
            //         packages.outPath = `${pluginPath}/dist/index.js`
            //         let config = {
            //             name: packages.name,
            //             version: packages.version, 
            //             icons: packages.icons,
            //             pluginPath: packages.pluginPath,
            //             outPath: packages.outPath
            //         }
            //         if(type === 'dev') {
            //             config['dev'] = true,
            //             config['switch'] = packages.switch
            //             DBPlugin.addDev(packages.name, config)
            //             return
            //         }
            //         DBPlugin.addReleas(packages.name, config)
            //     } else {
            //         // rm('-rf', `${pluginPath}`)
            //         console.error(`${pluginPath}/package.json文件不存在`);
            //     }
            // })
        }
    })
}

function allPlugin() {
    traversePlugin('releas', defaultDirPath()['Plugin'])
    traversePlugin('dev', defaultDirPath()['DevPlugin'])
    return {
        releas: DBPlugin.checkReleasAll(),
        dev: DBPlugin.checkDevAll()
    }
}


function addPlugin(opt, cmd) {
    opt.outPath = `${defaultDirPath()['Plugin']}/${opt.name}`
    require('../down')('plugin', opt, cmd)
}

function delPlugin(id) {
    const plugin = DBPlugin.delReleas(id)
    let pluginPath = plugin[0][0].config.pluginPath 
    pluginPath = pluginPath.replace(/Application/, 'Application\\')
    const exec = require('child_process').exec
    const child = exec(`rm -rf ${pluginPath}`, (error, stdout, stderr) => {
        if(error !== null) {
            console.warn('error', error)
            console.warn('stdout', stdout)
            console.warn('stderr', stderr)                        
        }
    });
    return plugin[1]
}

module.exports = {
    allPlugin,
    addPlugin,
    delPlugin
}