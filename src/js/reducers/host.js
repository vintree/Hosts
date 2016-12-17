import IT from 'immutable'
import {
    ADD_HOST,
    DEL_HOST,
    UPDATE_HOST,
    EXCHANGE_HOST,
    FILTER_HOST
} from '../constants/host.js'

import DBHost from '../../../db-model/host.js'

export default {
    hostData: (state = {
        hostList: DBHost.checkAll(),
        searchValue: undefined
    }, action) => {
        const strType = [
            ADD_HOST,
            DEL_HOST,
            UPDATE_HOST,
            EXCHANGE_HOST,
            FILTER_HOST
        ].join('')
        if(strType.indexOf(action.type) > -1) {
            return IT.fromJS({
                hostList: action.hostList,
                searchValue: action.searchValue
            })
        } else {
            return IT.fromJS(state)
        }
    }
}