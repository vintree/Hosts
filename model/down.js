const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const fs = require('fs')
const githubDownload = require('github-download')
// const download = require('download')
const fileDownload = require('download-file')
const command = require('./command/core')
const mkdir = require('./mkdir')
const {allPlugin} = require('./plugin/core')
const packages = require('../package.json')
const {
    checkAllPlugin,
    hideLoading 
} = require('../src/js/actions/root')

let isLoading = null

let _dispatch
function initLoading() {
    setTimeout(() => {
        if(isLoading !== null) {
            _dispatch(hideLoading())
        }
    }, 120000)
}

function downloadConfigs(opts) {
    fileDownload(opts.url, {
        directory: `${userData}/${opts.relativePath}`,
        filename: opts.name
    }, (err) => {
        if (err) throw err
    })
}

module.exports = function downloades(type, opt, url) {
    const { name, outPath } = opt
    _dispatch = window[packages.name] ? window[packages.name]['store']['dispatch'] : ''
    // if(type === 'plugin') {
    //     isLoading = true
    //     initLoading()
    //     if(mkdir(outPath)) {
    //         githubDownload(url, outPath)
    //         .on('dir', (dir) => {
    //             console.log(dir)
    //         })
    //         .on('file', (file) => {
    //             console.log(file)
    //         })
    //         .on('zip', (zipUrl) => { //only emitted if Github API limit is reached and the zip file is downloaded 
    //             console.log(zipUrl)
    //         })
    //         .on('error', (err) => {
    //             console.error(err)
    //         })
    //         .on('end', (end) => {
    //             switch(type) {
    //                 case 'plugin':
    //                     isLoading = null
    //                     allPlugin()
    //                     setTimeout(() => {
    //                         _dispatch(checkAllPlugin())
    //                         _dispatch(hideLoading())
    //                     }, 0)
    //                     break
    //                 default:
    //                     console.log('default')       
    //             }
    //         })
    //     }
    // } else if(type === 'config') {
    //     fileDownload(url, {
    //         directory: outPath,
    //         filename: name
    //     }, (err) => {
    //         if (err) throw err
    //     })
    // }

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
                let configMain = fs.readFileSync(`${outPath}/${name}`, 'utf-8')
                configMain = JSON.parse(configMain)
                const urls = configMain.urls
                Object.keys(urls).forEach((key, i) => {
                    downloadConfigs(urls[key])
                })
            })
        default:
            break
    }


}