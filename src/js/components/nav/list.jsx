const { Component } = React
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
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
let _hostData = null
let mouseDownT = null

ipcRenderer.on('hostList', (event, arg) => {
    const { dispatch } = window.store
    const searchValue = _hostData.get('searchValue')
    const hostList = _hostData.get('hostList')
    dispatch(updateHost(arg.id, {
        switched: arg.switched
    }, searchValue, hostList))
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
            isDrag: false,
            isShowTag: false
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
        const { dispatch, hostData } = this.props
        const searchValue = hostData.get('searchValue')
        const hostList = hostData.get('hostList')
        dispatch(updateHost(id, {
            name
        }, searchValue, hostList))
    }
    updateSwitched(id, switched) {
        const { dispatch, hostData } = this.props
        const searchValue = hostData.get('searchValue')
        const hostList = hostData.get('hostList')
        dispatch(updateHost(id, {
            switched
        }, searchValue, hostList))
        updateHostFile()
    }
    updateColor(id, color) {
        const { dispatch, hostData } = this.props
        const searchValue = hostData.get('searchValue')
        const hostList = hostData.get('hostList')
        dispatch(updateHost(id, {
            color
        }, searchValue, hostList))
        updateHostFile()
    }
    delHost(id, e) {
        const { dispatch } = this.props
        dispatch(delHost(id))
    }
    checkActiveHost(id, searchValue, hostList, e) {
        const { dispatch, activeHost } = this.props
        if(activeHost.get('data').get('id') !== id) {
            // if click close out
            if(!e.target.isEqualNode(this.refs.close)) {
                dispatch(checkActiveHost(id, searchValue, hostList))
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
    handleMouseDown() {
        mouseDownT = setTimeout(() => {
            this.setState({
                isShowTag: true
            })
        }, 1000);
    }
    handleMouseUp() {
        if(mouseDownT) {
            clearTimeout(mouseDownT)
        }
    }
    handleCloseColor() {
        this.setState({
            isShowTag: false
        })
    }
    render() {
        let { dispatch, activeHost, hostData } = this.props
        const { id, name, switched, style, color } = this.props.host
        const { inputType, isDrag, draggable, isShowTag } = this.state
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
            onClick: this.checkActiveHost.bind(this, id, hostData.get('searchValue'), hostData.get('hostList')),
        }
        if(draggable) {
            liProps = {
                onClick: this.checkActiveHost.bind(this, id, hostData.get('searchValue'), hostData.get('hostList')),
                draggable: draggable,
                onDragOver: this.handleDragOver.bind(this),
                onDragLeave: this.handleDragLeave.bind(this),
                onDragEnd: this.handleDrop.bind(this)
            }
        }
        let itemStyle = {
            borderColor: color
        }
        return (
            <li className="item-box" onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} style={itemStyle}>
                <div className={className} {...liProps}>
                    <i className="iconfont icon-chachada icon-close-self float-left" ref="close" onClick={this.delHost.bind(this, id)}></i>
                    {
                        inputType === 'text' ? 
                        (
                            <div className="hosts-name">
                                <span style={style} onDoubleClick={this.handleChangeDom.bind(this)} dangerouslySetInnerHTML={{__html: name}}></span>
                            </div>
                        ) : 
                        (<input className="update-name" type="text" defaultValue={name} onKeyUp={this.handleKeyUp.bind(this, id)} onBlur={this.handleBlur.bind(this, id)} ref="updateName" />)
                    }
                    <div className="float-right switch-box" onClick={this.updateSwitched.bind(this, id, !switched)}>
                        <i className={switched ? 'switch active' : 'switch'}></i>
                    </div>
                </div>
                <ul className={
                    isShowTag ? 'color-list' : 'color-list hide'
                }>
                    <li className="color-item"><span className="color-icon yellow" onClick={this.updateColor.bind(this, id, '#F2C53E')}></span></li>
                    <li className="color-item"><span className="color-icon red" onClick={this.updateColor.bind(this, id, '#fc4c50')}></span></li>
                    <li className="color-item"><span className="color-icon orange" onClick={this.updateColor.bind(this, id, '#f59739')}></span></li>
                    <li className="color-item"><span className="color-icon green" onClick={this.updateColor.bind(this, id, '#65c43c')}></span></li>
                    <li className="color-item"><span className="color-icon blue" onClick={this.updateColor.bind(this, id, '#4ba9f1')}></span></li>
                    <li className="color-item"><span className="color-icon purple" onClick={this.updateColor.bind(this, id, '#c471d9')}></span></li>
                    <li className="color-item"><span className="color-close iconfont icon-guanbi icon-guanbi-self" onClick={this.handleCloseColor.bind(this)}></span></li>
                </ul>
            </li>
        )
    }
}

class List extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { dispatch, hostData, activeHost } = this.props
        const hostList = hostData.get('hostList')
        const Lists = hostList.map((v, ix) => {
            v = v.toObject()
            return (
                <Item dispatch={dispatch} host={v} activeHost={activeHost} hostData={hostData}></Item>
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
    _hostData = state.hostData
    return {
        hostData: state.hostData,
        activeHost: state.activeHost
    }
}

export default connect(select)(List)