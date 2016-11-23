const { Component } = React
const { render } = ReactDOM
import { Provider } from 'react-redux';
import ConfigureStore from './store/store';
import App from './containers/app.jsx';
const main = require('../../model/main')
// 初始化
main.init()
window.store = ConfigureStore

render(
    <Provider store={ConfigureStore}>
        <App />
    </Provider>
, document.getElementById('container'))