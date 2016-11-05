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

const defaultData = {
    id: null,
    name: null,
    content: null,
    switched: null,
    active: null,
    exchangeTag: false
}

function defaultValue(name, content = '') {
    return {
        id: uuid(),
        name: name,
        content: content,
        switched: false,
        active: false,
        exchangeTag: false
    }
}

function defaultReturn(value) {
    if(!db.has('host').value()) {
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

function create() {
    createHost()
}

function createHost() {
    return db.defaults({host: []})
    .value()
}

function addHost(name) {
    if(!db.has('host').value()) {
        createHost()
    }
    const content = `# ${name}\n# ${time.localFullTime()}\n\n`

    return defaultReturn(db.get(TABLE_HOST_NAME)
    .push(defaultValue(name, content))
    .value())
}

function delHost(id) {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .remove({id: id}).value())
}

function update(id, prepareData) {
    if(!id) return
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .find({id: id})
    .assign(prepareData).value())
}

function checkAll() {
    return defaultReturn()['1']
}

function check(id) {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .filter({id: id}).value()[0])
}

function checkActiveAll() {
    return defaultReturn(db.get(TABLE_HOST_NAME)
    .filter({switched: true}).value())['0']
}

// id1, id2, 
function exchange(id, currentId) {
    // let host1 = db.get(TABLE_HOST_NAME).filter({id: id1}).value()[0]
    // host1 = IT.fromJS(host1)
    // host1 = host1.set('exchangeTag', true)    
    // let host2 = db.get(TABLE_HOST_NAME).filter({id: id2}).value()[0]
    // host2 = IT.fromJS(host2)
    // db.get(TABLE_HOST_NAME).find({
    //     id: id2,
    // }).assign(host1.toObject()).value()
    // db.get(TABLE_HOST_NAME).find({
    //     id: id1,
    //     exchangeTag: false
    // }).assign(host2.toObject()).value()
    // db.get(TABLE_HOST_NAME).find({id: id1}).assign({exchangeTag: false}).value()

    // return defaultReturn()

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
    create,
    addHost,
    delHost,
    update,
    checkAll,
    check,
    checkActiveAll,
    exchange
}