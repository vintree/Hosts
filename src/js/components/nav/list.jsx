var electron = require('electron')
var ipcRenderer = electron.ipcRenderer
const { Component } = React
import { connect } from 'react-redux'
import IT from 'immutable'
import { 
    delHost, 
    updateHost, 
    checkActiveHost, 
    exchangeHost,
    checkActiveHostAll
} from '../../actions/root'
import updateHostFile from '../../../../model/update-host'

let activeId = null
let dragOverId = null
let _type = null

ipcRenderer.on('hostList', (event, arg) => {
    const { dispatch } = window.store
    dispatch(updateHost(arg.id, {switched: arg.switched}))
    updateHostFile()
    if(_type === 'all') {
        dispatch(checkActiveHostAll())
    }
})

class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputType: 'text',
            isDrag: false
        }
    }
    componentDidUpdate() {
        const dom = this.refs.updateName
        if(dom === undefined) return
        dom.focus()
        dom.select()
    }
    handleChangeDom() {
        this.setState({
            inputType: 'input'
        })
    }
    handleBlur(id) {
        const name = this.refs.updateName.value
        if(name === '') {
            this.setState({
                inputType: 'text',
            })
        } else {
            this.updateName(id, name)
            this.setState({
                inputType: 'text'
            })
        }
    }
    handleKeyUp(id, e) {
        if(e.keyCode === 13) {
            const name = this.refs.updateName.value
            if(name === '') {
                this.setState({
                    inputType: 'text',
                })
            } else {
                this.updateName(id, name)
                this.setState({
                    inputType: 'text'
                })
            }
        }
    }
    updateName(id, name) {
        const { dispatch } = this.props
        dispatch(updateHost(id, {
            name
        }))
    }
    updateSwitched(id, switched) {
        const { dispatch } = this.props
        dispatch(updateHost(id, {
            switched
        }))
        updateHostFile()        
    }
    delHost(id, e) { 
        const { dispatch } = this.props
        dispatch(delHost(id))
    }
    checkActiveHost(id, e) {
        const { dispatch, activeHost } = this.props
        if(activeHost.get('data').get('id') !== id) {
            // if click close out
            if(!e.target.isEqualNode(this.refs.close)) {
                dispatch(checkActiveHost(id))
            }
        }
    }
    handleDragOver(e) {
        const { id } = this.props.host
        dragOverId = id
        this.setState({
            isDrag: true
        })
    }
    handleDragLeave(e) {
        this.setState({
            isDrag: false
        })
    }
    handleDrop(e) {
        const { dispatch } = this.props
        const { id } = this.props.host
        dispatch( exchangeHost(id, dragOverId) )
        if(_type === 'all') {
            dispatch(checkActiveHostAll())
        }
        updateHostFile()
    }
    render() {
        const { id, name, switched } = this.props.host
        let { dispatch, activeHost } = this.props
        const { inputType, isDrag } = this.state
        if(id === undefined) return
        activeHost = activeHost.toObject()
        let className = 'item'
        if(activeHost.type === 'other' && activeHost.data.get('id') === id) {
            className += ' active'
            activeId = id
        } else {
            activeId = null
        }
        if(isDrag) {
            className += ' drag'
        }
        return (
            <li className={className} onClick={this.checkActiveHost.bind(this, id)} draggable="true" data-text={name} onDragOver={this.handleDragOver.bind(this)} onDragLeave={this.handleDragLeave.bind(this)} onDragEnd={this.handleDrop.bind(this)}>
                <i className="iconfont icon-chachada icon-close-self float-left" ref="close" onClick={this.delHost.bind(this, id)}></i>
                {
                    inputType === 'text' ? <div className="hosts-name" onDoubleClick={this.handleChangeDom.bind(this)}>{name}</div> : <input className="update-name" type="text" defaultValue={name} onKeyUp={this.handleKeyUp.bind(this, id)} onBlur={this.handleBlur.bind(this, id)} ref="updateName" /> 
                }
                <div className="float-right switch-box" onClick={this.updateSwitched.bind(this, id, !switched)}>
                    <i className={switched ? 'switch active' : 'switch'}></i>
                </div>
            </li>
        )
    }
}

class List extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { dispatch, hostList, activeHost } = this.props
        const Lists = hostList.map((v, ix) => {
            v = v.toObject()
            return (
                <Item dispatch={dispatch} host={v} activeHost={activeHost}></Item>
            )
        })
        _type = activeHost.get('type')
        return (
            <ul className="list over-hide">
                {Lists}
            </ul>
        )
    }
}

function select(state) {
    return {
        hostList: state.hostList,
        activeHost: state.activeHost
    }
}

export default connect(select)(List)