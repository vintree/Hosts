import './index.scss';
const { Component } = React
import { connect } from 'react-redux'
import IT from 'immutable'

import Nav from '../components/nav/index'
import Content from '../components/content/index'
import Plugin from '../components/plugin/index'
import Loading from '../components/plugin/index'
class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { loading } = this.props
        return (
            <div>
                <div className="host-nav">
                    <Nav></Nav>
                </div>
                <div className="host-content">
                    <Content></Content>
                </div>
                <div className="host-plugin">
                    <Plugin></Plugin>
                </div>
                <div className={
                    loading ? 'host-loading active' : 'host-loading'
                }>
                    <div className="loading-color"></div>
                </div>
            </div>
        )
    }
}

function select(state) {
    return {
        loading: state.loading
    }
}

export default connect(select)(App)