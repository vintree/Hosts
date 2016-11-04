import './index.scss'
const { Component } = React
import { connect } from 'react-redux'
import { checkActiveHostAll } from '../../actions/root'

import List from './list'
import Header from './header'
import Footer from './footer'
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hostList: null,
            activeHost: props.activeHost,
            handleActiveHost: props.handleActiveHost
        }
    }
    checkActiveHostAll() {
        const { dispatch } = this.props
        dispatch(checkActiveHostAll())
    }
    render() {
        let { activeHost } = this.props
        activeHost = activeHost.toObject() 
        return (
            <div className="_host-nav">
                <Header></Header>
                <div className={
                    activeHost.type === 'all' ? 'sys-first active' : 'sys-first'
                } onClick={this.checkActiveHostAll.bind(this)}>
                    <div className="hosts-name">系统 Hosts</div>
                    <i className="iconfont icon-lock float-right icon-self switch-all"></i>
                </div>
                <List></List>
                <Footer className="footer"></Footer>
            </div>
        )
        // <i className="iconfont icon-switch float-right icon-self switch-all"></i>
    }
}

function select(state) {
    return {
        hostList: state.hostList,
        activeHost: state.activeHost
    }
}

export default connect(select)(Index)