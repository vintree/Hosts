const { Component } = React
import { connect } from 'react-redux'
import { addHost } from '../../actions/root'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputType: 'create'
        }
    }

    createNode(dispatch) {
        const searchDom = this.refs.search 
        const name = searchDom.value
        if(name !== '') {
            dispatch(addHost(name))
            searchDom.value = ''
        }
    }

    handleKeyUp(e) {
        const { dispatch } = this.props
        if(e.keyCode === 13) {
            if(this.state.inputType === 'create') {
                this.createNode(dispatch)
            } else {
                console.log('search');
            }
        }
    }

    switchCreate(e) {
        const { inputType } = this.state
        const { dispatch } = this.props
        const searchDom = this.refs.search
        searchDom.focus()
        if(inputType === 'create') {
            this.createNode(dispatch)
        } else {
            searchDom.setAttribute('placeholder', '新建模块')  
            this.setState({
                inputType: 'create'
            })
        }
    }

    switchSearch(e) {
        const searchDom = this.refs.search
        searchDom.focus()
        searchDom.setAttribute('placeholder', '搜索')
        // searchDom.setAttribute('host-type', 'create')
        this.setState({
            inputType: 'search'
        })
    }

    render() {
        const { inputType } = this.state
        return (
            <div className="header over-hide">
                <input className="inp-search" type="text" placeholder={
                    inputType === 'create' ? '新建模块' : '搜索' 
                } ref="search" onKeyUp={this.handleKeyUp.bind(this)}  />
                <i className={
                    inputType === 'create' ? 'iconfont icon-jia float-right icon-self bind-active' : 'iconfont icon-jia float-right icon-self' 
                } onClick={this.switchCreate.bind(this)}></i>
            </div>
        )
        // search node
        // <i className={
        //     inputType === 'search' ? 'iconfont icon-sousuo float-right icon-self bind-active' : 'iconfont icon-sousuo float-right icon-self' 
        // } onClick={this.switchSearch.bind(this)}></i>
    }
}

function select(state) {
    return {
        hostList: state.hostList
    }
}

export default connect(select)(Header)