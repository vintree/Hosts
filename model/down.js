const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
const fs = require('fs')
const command = require('./command/core')
const mkdir = require('./mkdir')
const {allPlugin} = require('./plugin/core')
const packages = require('../package.json')
const { 
    checkAllPlugin,
    hideLoading 
} = require('../src/js/actions/root')

let isLoading = null

const { dispatch } = window[packages.name]['store']

function initLoading() {
    setTimeout(() => {
        if(isLoading !== null) {
            dispatch(hideLoading())
        }
    }, 1000)
}

module.exports = function downloades(type, opt, url) {
    const { name, outPath } = opt
    isLoading = true
    initLoading()
    if(mkdir(outPath)) {
        var ghdownload = require('github-download')
        ghdownload(url, outPath)
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
                        dispatch(checkAllPlugin())
                        dispatch(hideLoading())
                    }, 0)
                    break
                default:
                    console.log('default')       
            }
        })
    }
}