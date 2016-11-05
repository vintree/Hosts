import { createStore } from 'redux';
import rootReducer from '../reducers/root.js'

let store = createStore(rootReducer);

export default store;