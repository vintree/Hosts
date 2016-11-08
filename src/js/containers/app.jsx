import './index.scss';
const { Component } = React
import { connect } from 'react-redux'
import IT from 'immutable'
const fs = require('fs')
const electron = require('electron')
const userData = electron.remote.app.getPath('userData')
import Nav from '../components/nav/index'
import Content from '../components/content/index'
import Plugin from '../components/plugin/index'
import Updater from '../components/updater/index'
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            latest: isLatest() 
        }
    }
    render() {
        const { latest } = this.state
        const { loading } = this.props
        return (
            <div>
                <div className="host-nav">
                    <Nav></Nav>
                </div>
                <div className="host-content">
                    <Content></Content>
                </div>
                <div className="host-plugin updater">
                    <Plugin></Plugin>
                </div>
                <div className="host-updater">
                    <Updater latest={latest}></Updater>
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

function isLatest() {
    const currenPackages = require('../../../package.json')
    const currentVersion = currenPackages.version
    const updaterPath = `${userData}/Configs/updates.json`
    let latestPackages
    let latestVersion
    if(fs.existsSync(updaterPath)) {
        latestPackages = fs.readFileSync(`${userData}/Configs/updates.json`, 'utf-8')
        latestPackages = JSON.parse(latestPackages)
        latestVersion = latestPackages.releas.releasVersion
        if(currentVersion !== latestVersion) {
            return latestPackages
        }
    }
    return undefined
}

function select(state) {
    return {
        loading: state.loading
    }
}

export default connect(select)(App)