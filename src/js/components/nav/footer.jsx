const { Component } = React
const ipAdress = require('../../../../model/ip-adress')

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ipAdress: ipAdress(),
            isRefreshActive: false
        }
        setInterval(() => {
            this.setState({
                ipAdress: ipAdress()
            })
        }, 1000)
    }
    refreshIpAdress() {
        this.setState({
            isRefreshActive: true,
            ipAdress: ipAdress()
        })

        setTimeout(function() {
            this.setState({
                isRefreshActive: false
            })
        }.bind(this), 200)
    }
    render() {
        const { ipAdress, isRefreshActive } = this.state
        let ipAdressStyle = ipAdress ? 'footer online' : 'footer unOnline'
        if(isRefreshActive) {
            ipAdressStyle += ' active'
        }
        return (
            <div className={ipAdressStyle}>
                {ipAdress ? this.state.ipAdress : '离线状态'}
                <i className="iconfont icon-refurbish float-right ip-refresh" onClick={this.refreshIpAdress.bind(this)}></i>
            </div>
        )
    }
}