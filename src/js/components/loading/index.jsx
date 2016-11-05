import './index.scss'
const { Component } = React
import { connect } from 'react-redux'

class Index extends Component {
    constructor(props) {
        super(props)
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <div className="_loading">
                
            </div>
        )
    }
}

function select(state) {
    return {}
}

export default connect(select)(Index)