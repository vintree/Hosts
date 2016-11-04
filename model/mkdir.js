/**
 *  author: puxiao
 *  time: 2016-10-22
 *  des 判断文件夹是否存在，不存在则创建
 */
const fs = require('fs')
const path = require('path')

module.exports = function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp = '/'
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if(pathtmp !== '') {
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            }
        });
    }
    return true;
}