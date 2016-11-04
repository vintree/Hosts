import {
    CHECK_ACTIVE_HOST,
    CHECK_ACTIVE_HOST_ALL
} from '../constants/host.js'

import { checkActiveAll, check } from '../../../db-model/host.js'

export default {
    checkActiveHostAll: () => {
        return {
            type: CHECK_ACTIVE_HOST_ALL,
            activeHost: checkActiveAll()
        }
    },
    checkActiveHost: (id) => {
        return {
            type: CHECK_ACTIVE_HOST,
            activeHost: check(id)[0]
        }
    }
}