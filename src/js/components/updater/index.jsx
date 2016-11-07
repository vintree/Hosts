import './index.scss'
const { Component } = React
import { connect } from 'react-redux'

class Index extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { latest } = this.props
        let updateURL
        let releaseDate
        if(latest) {
            updateURL = latest.releas.updateURL
            releaseDate = latest.releas.releaseDate
            let downClass = '_updater-down'
            const releaseTime = (new Date('2016-11-1')).getTime()
            const nowTime = (new Date()).getTime()
            const dvalue = nowTime - releaseTime
            const baseDay = 3600 * 1000 * 24
            if(dvalue < baseDay * 2) {
                downClass += ' info'
            } else if(dvalue < baseDay * 5) {
                downClass += ' warning'
            } else {
                downClass += ' over'
            }
            return (
                <div className="_updater">
                    <a className={downClass} href={updateURL}>
                        <i className="iconfont icon-ttpodicon"></i>
                    </a>
                </div>
            )
        }
        return (<div></div>)
    }
}

function select(state) {
    return {}
}

export default connect(select)(Index)