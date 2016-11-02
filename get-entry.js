var path = require('path')
var fs = require('fs')

// 生成入口文件映射
// 形如
// 'pages/xxx/js/views.js': [ '/Users/xudanhust/mobile/lst/lst/src/pages/xxx/js/views.js']
// 的entry object
var srcDir = path.resolve(process.cwd(), 'src')

var Config = function() {}

Config.getEntry = function() {
    var config = {}
    var pageRoot = './src/js'
    var pageList = fs.readdirSync(pageRoot)
    pageList.forEach(function(page){
        if(page.indexOf('.js') > -1) {
            var extension = page.substr(0, page.length - 1)
            var key = `app/js/${extension}`
            var value = `${srcDir}/js/${page}`
            config[key] = [value]
        }
    })
    return config
}

Config.copyFile = function() {
    var pageRoot = './src',
        pageList = fs.readdirSync(pageRoot),
        arr1 = []
    pageList.forEach(function(page){
        if(page.indexOf('.html') > -1) {
            arr1.push({
                from: `${srcDir}/${page}`,
                to: `app/${page}`
            })
        }
    })
    return arr1
}

module.exports = Config