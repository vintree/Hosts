import { combineReducers } from 'redux'
import host from './host'
import active from './active'
import plugin from './plugin'
import loading from './loading'
const rootReducers = combineReducers({
    ...host,
    ...active,
    ...plugin,
    ...loading
})

export default rootReducers