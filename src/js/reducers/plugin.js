import IT from 'immutable'
import {
    CHACK_ALL_PLUGIN,
    DEL_RELEAS_PLUGIN
} from '../constants/plugin'

import DBHost from '../../../db-model/host.js'
const { checkReleasAll, checkDevAll } = require('../../../db-model/plugin')
const defaultState = {
    pluginReleasTotal: checkReleasAll(),
    pluginDevTotal: checkDevAll()
}

export default {
    pluginTotal: (state = defaultState, action) => {
        switch(action.type) {
            case DEL_RELEAS_PLUGIN:
                return state.set('pluginReleasTotal', IT.fromJS(action.pluginReleasTotal))
            case CHACK_ALL_PLUGIN:
                return IT.fromJS({
                    pluginReleasTotal: action.pluginReleasTotal,
                    pluginDevTotal: action.pluginDevTotal
                })
            default: 
                return IT.fromJS(state)
        }
    }
}