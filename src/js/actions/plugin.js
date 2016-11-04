import {
    ADD_RELEAS_PLUGIN,
    ADD_DEV_PLUGIN,
    EXCHANGE_PLUGIN,
    DEL_RELEAS_PLUGIN,
    CHACK_ALL_PLUGIN,
    CHACK_RELEAS_PLUGIN,
    CHACK_DEV_PLUGIN
} from '../constants/plugin.js'

import { checkReleasAll, checkDevAll } from '../../../db-model/plugin'
const { delPlugin } = require('../../../model/plugin/core')
const { allPlugin } = require('../../../model/plugin/core')
export default {
    delReleasPlugin: (id) => {
        return {
            type: DEL_RELEAS_PLUGIN,
            pluginReleasTotal: delPlugin(id)
        }
    },
    checkAllPlugin: () => {
        allPlugin()
        return {
            type: CHACK_ALL_PLUGIN,
            pluginReleasTotal: checkReleasAll(),
            pluginDevTotal: checkDevAll()
        }
    }
}