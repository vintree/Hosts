import {
    SHOW_LOADING,
    HIDE_LOADING
} from '../constants/loading.js'

export default {
    showLoading: (id) => {
        return {
            type: SHOW_LOADING,
            isShow: true
        }
    },
    hideLoading: () => {
        return {
            type: HIDE_LOADING,
            isShow: false
        }
    }
}