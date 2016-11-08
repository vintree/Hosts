require('./index.scss') 
const { Component } = React
const { connect } = require('react-redux')
const { allPlugin, addPlugin, delPlugin } = require('../../../../model/plugin/core')
const DBPlugin = require('../../../../db-model/plugin')
const command = require('../../../../model/command/core')
const fs = require('fs')
const packages = require('../../../../package.json')
const { rm } = require('shelljs')
const {
    checkAllPlugin,
    delReleasPlugin,
    exchangePlugin,
    showLoading,
    hideLoading,
} = require('../../actions/root')
const IT = require('immutable')
let currentId = null

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isPoolShow: false,
            pluginClasses: '',
            currentPlugin: undefined,
            isPlus: false
        }
        let { dispatch } = props
        setTimeout(() => {
            dispatch(checkAllPlugin())
        }, 0)
    }
    componentDidUpdate() {
        const { currentPlugin } = this.state
        if(currentPlugin !== undefined) {
            const outPath = currentPlugin.get('config').get('outPath')
            let reactPlugin  = fs.readFileSync(outPath, 'utf-8')
            eval(reactPlugin)
        }
    }
    handlePool(plugin, e) {
        const { currentPlugin } = this.state
        let state = {currentPlugin: plugin}
        // 第一次或目标插件和当前插件名称相同
        if(currentPlugin === undefined || currentPlugin.get('name') !== plugin.get('name')) {
            state.isPoolShow = true
        } else if(currentPlugin.get('name') === plugin.get('name')) {
            state.isPoolShow = false
            state.currentPlugin = undefined
        }
        this.setState(state)
    }
    handleDragOver(id, e) {
        currentId = id
    }
    handleDragLeave(e) {
        this.setState({
            isDrag: false
        })
    }
    handleDragEnd(id, e) {
        const { dispatch } = this.props
        dispatch(exchangePlugin(id, currentId))
    }
    handleActivePlus() {
        const { isPlus } = this.state
        if(!isPlus) {
            this.setState({
                isPlus: true
            })
            setTimeout(() => {
                this.refs.command.select()
            }, 0)
        }
    }
    handleHidePlus() {
        this.setState({
            isPlus: false
        })
    }
    handleCommand(e) {
        const { dispatch } = this.props
        let value = this.refs.command.value
        if(e.keyCode === 13) {
            dispatch(showLoading())
            command(value)
            this.setState({
                isPlus: false
            })
        }
    }
    handleDel(id, e) {
        const { dispatch } = this.props
        dispatch(delReleasPlugin(id))
        dispatch(showLoading())
        this.setState({
            isPoolShow: false
        })
        setTimeout(() => {
            dispatch(hideLoading())
        }, 50)
        e.stopPropagation()
    }
    mapPlugin(type, list) {
        const { isPoolShow, currentPlugin } = this.state
        return list.map((plugin, i) => {
            const icons = plugin.get('config').get('icons')
            const outPath = plugin.get('config').get('outPath')
            const pluginPath = plugin.get('config').get('pluginPath')
            const packagePath = plugin.get('config').get('packagePath')
            const id = plugin.get('id')
            if(fs.existsSync(packagePath)) {
                let iconClassName = (isPoolShow && plugin.get('name') === currentPlugin.get('name')) ? 'icons active' : 'icons'
                if(type === 'dev') {
                    return (
                        <div className={iconClassName} onClick={this.handlePool.bind(this, plugin)}>
                            <img src={icons} alt="" />
                            <div className="dev">D</div>
                            <div className="mask"></div>
                        </div>
                    )
                } else if(type === 'releas') {
                    return (
                        <div className={iconClassName} onClick={this.handlePool.bind(this, plugin)} draggable="true" onDragOver={this.handleDragOver.bind(this, id)} onDragLeave={this.handleDragLeave.bind(this)} onDragEnd={this.handleDragEnd.bind(this, id)}>
                            <img src={icons} alt="" />
                            <div className="mask"></div>
                            <i className="iconfont icon-chachada plugin-close" onClick={this.handleDel.bind(this, id)}></i>
                        </div>
                    )
                }
            } else {
                if(type === 'releas') { 
                    delReleasPlugin(id)
                    rm('-rf', pluginPath)
                    return ''
                }                
            }
        })
    }
    render() {
        const { isPoolShow, pluginActiveIx, currentPlugin, isPlus } = this.state
        const { dispatch, pluginReleasTotal, pluginDevTotal } = this.props
        if(!!window[packages.name]) {
            window[packages.name]['store'] = {
                dispatch
            }
        } else {
            window[packages.name] = {
                store: {
                    dispatch
                }
            }
        }
        let poolClassName = null
        let pluginList
        let pluginDevList
        let pluginClasses = ''
        pluginList = {
            releas: this.mapPlugin('releas', pluginReleasTotal),
            dev: this.mapPlugin('dev', pluginDevTotal)
        }
        let pluginTotal = pluginReleasTotal.concat(pluginDevTotal)
        pluginTotal = pluginTotal.toArray()
        pluginTotal.forEach((plugin) => {
            pluginClasses += ` ${plugin.get(name)}`
        })
        poolClassName = isPoolShow ? 'pool' : 'pool hide'
        let mainPluginClassName = isPoolShow ? `pool-main ${currentPlugin.get('name')}` : `pool-main ${pluginClasses}`
        let plusClassName = isPlus ? 'iconfont icon-jia plus active' : 'iconfont icon-jia plus'
        let consoleClassName = isPlus ? 'console' : 'console hide'
        return (
            <div className="_plugin">
                <div className="plus-container">
                    <div className={plusClassName} onClick={this.handleActivePlus.bind(this)}></div>
                    {
                        isPlus ? (<div className="plus-mask"></div>) : ''
                    }
                    <div className={consoleClassName}>
                        <input className="command" type="text" placeholder="命令行" ref="command" onBlur={this.handleHidePlus.bind(this)} onKeyUp={this.handleCommand.bind(this)} />
                    </div>
                </div>
                {pluginList.dev}
                {pluginList.releas}
                <div id="pool" className={poolClassName}>
                    {
                        currentPlugin === undefined ? '' :
                        (
                            <div className="pool-header">
                                <img className="header-icons" src={currentPlugin.get('config').get('icons')} alt=""/>
                                <span className="header-name">{currentPlugin.get('name')}</span>
                                <small className="header-version">{currentPlugin.get('config').get('version')}</small>
                            </div>
                        )
                    }
                    <div className={mainPluginClassName}></div>
                </div>
            </div>
        )
    }
}

function select(state) {    
    return {
        pluginReleasTotal: state.pluginTotal.get('pluginReleasTotal'),
        pluginDevTotal: state.pluginTotal.get('pluginDevTotal')
    }
}

export default connect(select)(Index)