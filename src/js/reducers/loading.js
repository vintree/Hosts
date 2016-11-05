import {
    SHOW_LOADING,
    HIDE_LOADING
} from '../constants/loading'

export default {
    loading: (state = false, action) => {
        switch(action.type) {
            case SHOW_LOADING:
                return action.isShow
            case HIDE_LOADING:
                return action.isShow
            default: 
                return state
        }
    }
}