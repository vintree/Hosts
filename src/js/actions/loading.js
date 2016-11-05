import {
    SHOW_LOADING,
    HIDE_LOADING
} from '../constants/loading.js'

export default {
    showLoading: (id) => {
        console.log('show');
        return {
            type: SHOW_LOADING,
            isShow: true
        }
    },
    hideLoading: () => {
        console.log('hide');
        return {
            type: HIDE_LOADING,
            isShow: false
        }
    }
}