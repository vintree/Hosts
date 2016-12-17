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
            draggable: true,
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
            inputType: 'input',
            draggable: false
        })
    }
    handleBlur(id) {
        const name = this.refs.updateName.value
        if(name === '') {
            this.setState({
                inputType: 'text',
                draggable: true
            })
        } else {
            this.updateName(id, name)
            this.setState({
                inputType: 'text',
                draggable: true
            })
        }
    }
    handleKeyUp(id, e) {
        if(e.keyCode === 13) {
            const name = this.refs.updateName.value
            if(name === '') {
                this.setState({
                    inputType: 'text',
                    draggable: true                    
                })
            } else {
                this.updateName(id, name)
                this.setState({
                    inputType: 'text',
                    draggable: true                    
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
        e.stopPropagation()
        const { id } = this.props.host
        dragOverId = id
        this.setState({
            isDrag: true
        })
    }
    handleDragLeave(e) {
        e.stopPropagation()
        this.setState({
            isDrag: false
        })
    }
    handleDrop(e) {
        e.stopPropagation()
        const { dispatch } = this.props
        const { id } = this.props.host
        if(id !== dragOverId) {
            dispatch(exchangeHost(id, dragOverId))
            if(_type === 'all') {
                dispatch(checkActiveHostAll())
            }
            updateHostFile()
        }
    }
    render() {
        let { dispatch, activeHost } = this.props
        const { id, name, switched } = this.props.host
        const { inputType, isDrag, draggable } = this.state
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
        let liProps = {
            onClick: this.checkActiveHost.bind(this, id)
        }
        if(draggable) {
            liProps = {
                onClick: this.checkActiveHost.bind(this, id),
                draggable: draggable,
                onDragOver: this.handleDragOver.bind(this),
                onDragLeave: this.handleDragLeave.bind(this),
                onDragEnd: this.handleDrop.bind(this)
            }
        }

        return (
            <li className={className} {...liProps}>
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