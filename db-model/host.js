/**
 * lowdb 需要更新时，assign方法需要再value()，才能更新上
 */
var electron = require('electron')
var ipcRenderer = electron.ipcRenderer
var low = require('lowdb')
var uuid =  require('uuid')
var IT = require('immutable')
var fs = require('fs') 
var path = require('path') 
var time = require('../model/time') 
const packages = require('../package.json')
const mkdir = require('../model/mkdir')
const TABLE_HOST_NAME = 'host'
const userData = electron.remote.app.getPath('userData')
const DBPatch = `${userData}/db`
const DBFile = `${DBPatch}/host.json`

mkdir(DBPatch)

const db = low(DBFile, {
    autosave: true,
    async: true
})

let defaults = {
    color: '#9e9e9e'
}

// host默认值
function defaultValue(name, content = '') {
    if(name) {
        return {
            id: uuid(),
            name: name,
            content: content,
            switched: false,
            active: false,
            exchangeTag: false,
            color: defaults['color']
        }
    }
}

// 默认返回构造对象
function defaultReturn(value) {
    if(!db.has(TABLE_HOST_NAME).value()) {
        createHost()
    }
    if(ipcRenderer !== undefined) {
        ipcRenderer.send('hostList', {
            hostList: db.get(TABLE_HOST_NAME).value()
        })
    }
    return {
        '0': value,
        '1': db.get(TABLE_HOST_NAME).value()
    }
}

// 初始化创建
function create() {
    createHost()
}

// 创建
function createHost(host = []) {
    return db.defaults({
        host
    })
    .value()
}

// 添加
function addHost(name) {
    console.log('name', name);
    if(!db.has('host').value()) {
        createHost()
    }
    const content = `# ${name}\n# ${time.localFullTime()}\n\n`
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .push(defaultValue(name, content))
    .value())
}

// 删除
function delHost(id) {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .remove({id: id}).value())
}

// 更新数据，prepareData<Object>
function update(id, prepareData) {
    if(!id) return
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .find({id: id})
    .assign(prepareData).value())
}

// 查找所有host
function checkAll() {
    return defaultReturn()['1']
}

// 根据ID查找host
function check(id) {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .filter({id: id}).value()[0])
}

// 查找所有激活host
function checkActiveAll() {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .filter({switched: true}).value())['0']
}

// 修改位置，id1, id2, 
function exchange(id, currentId) {
    const hostList = defaultReturn()[1]
    const exchanges = require('../model/exchange')
    let tempHostList
    let ix = null
    let currentIx = null
    for(let i = 0, l = hostList.length; i < l; i++) {
        if(hostList[i]['id'] === id) {
            ix = i
        } else if(hostList[i]['id'] === currentId) {
            currentIx = i
        }
        if(ix !== null && currentIx !== null) {
            break;
        }
    }
    tempHostList = exchanges(ix, currentIx, [].concat(hostList))
    return db.set(TABLE_HOST_NAME, tempHostList).value()[TABLE_HOST_NAME]
}

module.exports =  {
    createHost,
    defaults,
    create,
    addHost,
    delHost,
    update,
    checkAll,
    check,
    checkActiveAll,
    exchange
}