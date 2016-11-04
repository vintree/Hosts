import IT from 'immutable'
import {
    CHECK_ACTIVE_HOST,
    CHECK_ACTIVE_HOST_ALL
} from '../constants/host.js'
import DBHost from '../../../db-model/host.js'

const defaultActiveHost = {
    type: 'all',
    data: DBHost.checkActiveAll()
}

export default {
    activeHost: (state = defaultActiveHost, action) => {
        switch(action.type) {
            case CHECK_ACTIVE_HOST:
                return IT.fromJS({
                    type: 'other',
                    data: action.activeHost
                })
            case CHECK_ACTIVE_HOST_ALL:
                return IT.fromJS({
                    type: 'all',
                    data: action.activeHost
                })
            default :
                return IT.fromJS(state)
        }


    }
}