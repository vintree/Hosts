const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const fs = require('fs')
const githubDownload = require('github-download')
// const download = require('download')
const fileDownload = require('download-file')
const command = require('./command/core')
const mkdir = require('./mkdir')

const packages = require('../package.json')


let isLoading = null

let _dispatch
function initLoading() {
    setTimeout(() => {
        if(isLoading !== null) {
            _dispatch(hideLoading())
        }
    }, 120000)
}

function downloadConfigs(outPath, name) {
    let configMain = fs.readFileSync(`${outPath}/${name}`, 'utf-8') 
    configMain = JSON.parse(configMain)
    const { configs } = configMain
    Object.keys(configs).forEach((key) => {
        const config = configs[key]
        fileDownload(config.url, {
            directory: `${userData}/${config.relativePath}`,
            filename: config.name
        }, (err) => {
            if (err) throw err
        })
    })
}

module.exports = function downloades(type, opt, url) {
    const { name, outPath } = opt
    const {
        allPlugin
    } = require('./plugin/core')
    const {
        checkAllPlugin,
        hideLoading 
    } = require('../src/js/actions/root')
    _dispatch = window[packages.name] ? window[packages.name]['store']['dispatch'] : ''
    switch(type) {
        case 'plugin':
            isLoading = true
            initLoading()
            if(mkdir(outPath)) {
                githubDownload(url, outPath)
                .on('dir', (dir) => {
                    console.log(dir)
                })
                .on('file', (file) => {
                    console.log(file)
                })
                .on('zip', (zipUrl) => { //only emitted if Github API limit is reached and the zip file is downloaded 
                    console.log(zipUrl)
                })
                .on('error', (err) => {
                    console.error(err)
                })
                .on('end', (end) => {
                    switch(type) {
                        case 'plugin':
                            isLoading = null
                            allPlugin()
                            setTimeout(() => {
                                _dispatch(checkAllPlugin())
                                _dispatch(hideLoading())
                            }, 0)
                            break
                        default:
                            console.log('default')       
                    }
                })
            }
            break
        case 'configMain':
            fileDownload(url, {
                directory: outPath,
                filename: name
            }, (err) => {
                if (err) throw err
                setTimeout(() => {
                    downloadConfigs(outPath, name)
                }, 0)
            })
        default:
            break
    }
}