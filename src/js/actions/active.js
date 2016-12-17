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
    checkActiveHost: (id, searchValue, hostList) => {
        // console.log(hostList.get(1).get('id'));
        // console.log('searchValue', searchValue);
        // console.log('hostList', hostList);
        // if(searchValue && hostList && hostList.length !== 0) {
        //     for(let i = 0, l = hostList.size; i < l; i++) {
        //         if(hostList.get(i).get('id') === id) {
        //             hostList = hostList.set(i).set('active', true)
        //         }
        //     }
        //     return {
        //         type: CHECK_ACTIVE_HOST,
        //         activeHost: hostList
        //     }
        // }
        return {
            type: CHECK_ACTIVE_HOST,
            activeHost: check(id)[0]
        }
    }
}