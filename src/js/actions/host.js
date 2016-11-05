import {
    ADD_HOST,
    DEL_HOST,
    UPDATE_HOST,
    CHECK_HOST,
    CHECK_HOST_ALL,
    EXCHANGE_HOST
} from '../constants/host.js'

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
    updateHost: (id, prepareData) => {
        return {
            type: UPDATE_HOST,
            hostList: DBHost.update(id, prepareData)['1']
        }
    },
    exchangeHost: (id1, id2) => {
        return {
            type: EXCHANGE_HOST,
            hostList: DBHost.exchange(id1, id2)
        }
    }
}