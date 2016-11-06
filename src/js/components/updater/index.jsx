import './index.scss'
const { Component } = React
import { connect } from 'react-redux'

class Index extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="_updater">
                <i className="iconfont icon-ttpodicon"></i>
            </div>
        )
    }
}

function select(state) {
    return {}
}

export default connect(select)(Index)