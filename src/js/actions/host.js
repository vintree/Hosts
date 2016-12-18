import {
    ADD_HOST,
    DEL_HOST,
    UPDATE_HOST,
    CHECK_HOST,
    CHECK_HOST_ALL,
    EXCHANGE_HOST,
    FILTER_HOST
} from '../constants/host.js'
import IT from 'immutable'
import DBHost from '../../../db-model/host.js'

export default {
    addHost: (name) => {
        return {
            type: ADD_HOST,
            hostList: DBHost.addHost(name)['1']
        }
    },
    delHost: (id) => {
        return {
            type: DEL_HOST,
            hostList: DBHost.delHost(id)['1']
        }
    },
    updateHost: (id, prepareData, searchValue, hostList) => {
        let _hostList = DBHost.update(id, prepareData)['1']
        if(searchValue && hostList && hostList.size !== 0) {
            for(let i = 0, l = hostList.size; i < l; i++) {
                if(hostList.get(i).get('id') === id) {
                    const hostItem = hostList.get(i).merge(IT.fromJS(prepareData))
                    hostList = hostList.set(i, hostItem)
                    _hostList = hostList
                }
            }
        }
        return {
            type: UPDATE_HOST,
            searchValue: searchValue,
            hostList: _hostList
        }
    },
    exchangeHost: (id1, id2) => {
        return {
            type: EXCHANGE_HOST,
            hostList: DBHost.exchange(id1, id2)
        }
    },
    filterHost: (value) => {
        return {
            type: FILTER_HOST,
            searchValue: value,
            hostList: require('../../../model/search').filterList(value)
        }
    }
}