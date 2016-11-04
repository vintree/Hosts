import IT from 'immutable'
import {
    ADD_HOST,
    DEL_HOST,
    UPDATE_HOST,
    EXCHANGE_HOST
} from '../constants/host.js'

import DBHost from '../../../db-model/host.js'

export default {
    hostList: (state = DBHost.checkAll(), action) => {
        const strType = [
            ADD_HOST,
            DEL_HOST,
            UPDATE_HOST,
            EXCHANGE_HOST
        ].join('')
        if(strType.indexOf(action.type) > -1) {
            return IT.fromJS(action.hostList)
        } else {
            return IT.fromJS(state)
        }
    }
}