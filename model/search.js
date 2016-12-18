import IT from 'immutable'
import DBModel from '../db-model/host'

exports.filterList = function(value) {
    let tempHostList = []
    const hostList = IT.fromJS(DBModel.checkAll())
    const reg = new RegExp(`${value}`, 'im')
    if(value !== '') {
        hostList.map((data, i) => {
            const name = data.get('name')
            const content = data.get('content')
            if(reg.test(name) || reg.test(content)) {
                if(reg.test(name)) {
                    // const html = name.replace(reg, (regValue) => {
                    //     return `<span style="background-color: #e6d077; color: #af5e06">${regValue}</span>`
                    // })
                    // data = data.set('name', html)
                    data = data.set('style', {
                        backgroundColor: '#e6d077',
                        color: '#af5e06'
                    })
                }
                // if(reg.test(content)) {
                //     const reg1 = new RegExp(`${value}`, 'img')
                //     const html = content.replace(reg1, (regValue) => {
                //         return `<span style="background-color: #e6d077; color: #af5e06">${regValue}</span>`
                //     })
                //     data = data.set('content', html)
                // }
                tempHostList.push(data)
            }
        })
    } else {
        tempHostList = hostList
    }
    return tempHostList
}

exports.filterContent = function(value, content) {
    const reg = new RegExp(`${value}`, 'im')
    if(reg.test(content)) {
        const reg1 = new RegExp(`${value}`, 'img')
        const html = content.replace(reg1, (regValue) => {
            return `<span style="background-color: #e6d077; color: #af5e06">${regValue}</span>`
        })
        return html
    }
    return content
}