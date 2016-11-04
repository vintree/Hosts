/**
 *  author: puxiao
 *  time: 2016-10-05
 *  des: 获取时间
 */
var PrefixInteger = require('./prefixInteger')
const app = function() {}

app.localFullTime = function() {
    const date = new Date()
    return `${date.getFullYear()}-${PrefixInteger(date.getMonth() + 1, 2)}-${PrefixInteger(date.getDate(), 2)} ${PrefixInteger(date.getHours(), 2)}:${PrefixInteger(date.getMinutes(), 2)}:${PrefixInteger(date.getSeconds(), 2)}`
}

module.exports = app