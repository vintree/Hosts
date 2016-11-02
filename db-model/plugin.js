/**
 * lowdb 需要更新时，assign方法需要再value()，才能更新上
 */
var electron = require('electron')
var low = require('lowdb')
var uuid =  require('uuid')
var IT = require('immutable')
var fs = require('fs') 
var path = require('path')
const packages = require('../package.json')
const TABLE_RELEAS_NAME = 'releas'
const TABLE_DEV_NAME = 'dev'
const userData = electron.remote.app.getPath('userData')
const mkdir = require('../model/mkdir')
const DBPatch = `${userData}/db`
const DBFile = `${DBPatch}/plugin.json`

// function mkdirsSync(dirpath, mode) {
//     if (!fs.existsSync(dirpath)) {
//         var pathtmp = '/'
//         dirpath.split(path.sep).forEach(function(dirname) {
//             if (pathtmp) {
//                 pathtmp = path.join(pathtmp, dirname);
//             }
//             else {
//                 pathtmp = dirname;
//             }
//             if(pathtmp !== '') {
//                 if (!fs.existsSync(pathtmp)) {
//                     if (!fs.mkdirSync(pathtmp, mode)) {
//                         return false;
//                     }
//                 }
//             }
//         });
//     }
//     return true;
// }

mkdir(DBPatch)

const db = low(DBFile, {
  autosave: true,
  async: true
})

const defaultData = {
    id: null,
    name: null,
    switched: true,
    config: {}
}

function defaultValue(type, name, config) {
    let obj = {
        name: name,
        config: config
    }
    if(type === 'add') {
        obj['id'] = uuid()
        obj['switched'] = true
    }
    return obj
}

function defaultReturn(table, value) {
    if(!db.has(TABLE_RELEAS_NAME).value()) {
        createReleas()
    }
    if(!db.has(TABLE_DEV_NAME).value()) {
        createDev()
    }
    return {
        '0': value,
        '1': db.get(table).value()
    }
}

function create() {
    createReleas()
    createDev()
}

function createReleas() {
    return db.defaults({[TABLE_RELEAS_NAME]: []})
    .value()
}

function createDev() {
    return db.defaults({[TABLE_DEV_NAME]: []})
    .value()
}

function setReleas(obj) {
    obj = obj.map((v, i) => {
        return defaultValue(v[0], v[1])
    })
    return db.set(TABLE_RELEAS_NAME, obj)
    .value()[TABLE_RELEAS_NAME]
}

function setDev(obj) {
    obj = obj.map((v, i) => {
        return defaultValue(v[0], v[1])
    })
    return db.set(TABLE_DEV_NAME, obj)
    .value()[TABLE_DEV_NAME]
}

function addReleas(name, config) {
    if(!db.has(TABLE_RELEAS_NAME).value()) {
        createReleas()
    }
    let pluginDB = db.get(TABLE_RELEAS_NAME).find({name: name})
    if(pluginDB.value() === undefined) {
        return defaultReturn(TABLE_RELEAS_NAME, db.get(TABLE_RELEAS_NAME)
        .push(defaultValue('add', name, config))
        .value())
    } else {
        return pluginDB
        .assign(defaultValue(undefined, name, config))
        .value()
    }
}

function addDev(name, config) {
    if(!db.has(TABLE_DEV_NAME).value()) {
        createDev()
    }
    let pluginDB = db.get(TABLE_DEV_NAME).find({name: name})
    if(pluginDB.value() === undefined) {
        return defaultReturn(TABLE_DEV_NAME, db.get(TABLE_DEV_NAME)
        .push(defaultValue('add', name, config))
        .value())
    } else {
        return pluginDB
        .assign(defaultValue(undefined, name, config))
        .value()
    }
}

function sortes() {
    return db.get(TABLE_RELEAS_NAME)
    .filter({switched: true})
    .sortBy('sort').value()
}

function delReleas(id) {
    return defaultReturn(TABLE_RELEAS_NAME, db.get(TABLE_RELEAS_NAME)
    .remove({id: id}).value())
}

// function update(id, prepareData) {
//     if(!id) return
//     return defaultReturn(db.get(TABLE_RELEAS_NAME)
//     .find({id: id})
//     .assign(prepareData).value())
// }

function checkReleasAll() {
    return defaultReturn(TABLE_RELEAS_NAME)['1']
}

function checkDevAll() {    
    return defaultReturn(TABLE_DEV_NAME)['1']
}

// function check(id) {
//     return defaultReturn(db.get(TABLE_RELEAS_NAME)
//     .filter({id: id}).value()[0])
// }

// function checkActiveAll() {
//     return defaultReturn(db.get(TABLE_RELEAS_NAME)
//     .filter({switched: true}).value())['0']
// }

function exchange(id, currentId) {
    const pluginList = defaultReturn(TABLE_RELEAS_NAME)[1]
    const exchanges = require('../model/exchange')
    let tempPluginList
    let ix = null
    let currentIx = null
    // 找到需要交换数据的下标
    for(let i = 0, l = pluginList.length; i < l; i++) {
        if(pluginList[i]['id'] === id) {
            ix = i
        } else if(pluginList[i]['id'] === currentId) {
            currentIx = i
        }
        if(ix !== null && currentIx !== null) {
            break;
        }
    }
    tempPluginList = exchanges(ix, currentIx, [].concat(pluginList))
    return db.set(TABLE_RELEAS_NAME, tempPluginList).value()[TABLE_RELEAS_NAME]
}


// function test(ix, currentId) {
//     var arr = [0, 1, 2, 3, 4, 5, 6, 7]
//     var tempPlugin = arr[ix]
//     var i = ix
//     if(ix < currentId) {
//         for(let l = currentId; i < l; i++) {
//             arr[i] = arr[i + 1]
//         }
//     } else {
//         for(let l = currentId; i > l; i--) {
//             arr[i] = arr[i - 1]
//         }
//     }
//     arr[i] = tempPlugin

//     return arr
// }

// function exchange1(id1, id2) {
//     let host1 = db.get(TABLE_RELEAS_NAME).filter({id: id1}).value()[0]
//     host1 = IT.fromJS(host1)
//     host1 = host1.set('exchangeTag', true)    
//     let host2 = db.get(TABLE_RELEAS_NAME).filter({id: id2}).value()[0]
//     host2 = IT.fromJS(host2)

//     db.get(TABLE_RELEAS_NAME).find({
//         id: id2,
//     }).assign(host1.toObject()).value()

//     db.get(TABLE_RELEAS_NAME).find({
//         id: id1,
//         exchangeTag: false
//     }).assign(host2.toObject()).value()

//     db.get(TABLE_RELEAS_NAME).find({id: id1}).assign({exchangeTag: false}).value()

//     return defaultReturn()
// }

module.exports =  {
    create,
    createReleas,
    createDev,
    setReleas,
    setDev,
    addReleas,
    addDev,
    checkReleasAll,
    checkDevAll,
    exchange,
    delReleas
}