import './index.scss'
const { Component } = React
const { connect } = require('react-redux')
const electron = require('electron')
const {
    shell
} = electron

class Index extends Component {
    constructor(props) {
        super(props)
    }
    handleClick() {
        shell.openExternal('https://github.com/wuguzi/Hosts/releases')
    }
    render() {
        const { latest } = this.props
        let updateURL
        let releaseDate
        if(latest) {
            updateURL = latest.releas.updateURL
            releaseDate = latest.releas.releaseDate
            let downClass = '_updater-down'
            const releaseTime = (new Date(releaseDate)).getTime()
            const nowTime = (new Date()).getTime()
            const dvalue = nowTime - releaseTime
            const baseDay = 3600 * 1000 * 24
            if(dvalue < baseDay * 2) {
                downClass += ' info'
            } else if(dvalue < baseDay * 6) {
                downClass += ' warning'
            } else {
                downClass += ' over'
            }
            return (
                <div className="_updater">
                    <a className={downClass} href="javascript:;" onClick={this.handleClick.bind(this)}>
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