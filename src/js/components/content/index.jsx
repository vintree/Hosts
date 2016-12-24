import './index.scss'
const { Component } = React
import { connect } from 'react-redux'
import IT from 'immutable'
import { 
    updateHost,
    showLoading,
    hideLoading
} from '../../actions/root'
import formatLabel from '../../../../model/format-label'
import updateHostFile from '../../../../model/update-host'

updateHostFile()

let editor
let loading_t = undefined
let loading_isEnd = true
let option = {
    value : 'http://www.cnblogs.com/oldphper',  // 文本域默认显示的文本
    mode : 'javascript',  // 模式
    indentUnit : 2,  // 缩进单位，默认2
    smartIndent : true,  // 是否智能缩进
    tabSize : 4,  // Tab缩进，默认4
    readOnly : 'nocursor',  // 是否只读，默认false, nocursor
    showCursorWhenSelecting : true,
    lineNumbers : true,  // 是否显示行号
    extraKeys: {'Alt-F': 'findPersistent'}
}

function formatContent(activeHost) {
    let content = ''
    if(activeHost.type === 'all') {
        activeHost.data.toArray().map((v, i) => {
            let splitStart = ''
            splitStart = formatLabel(i === 0 ? 'first' : undefined, v.get('name'))
            content += splitStart + v.get('content')
            option.readOnly = true
        })
    } else {
        content = activeHost.data.get('content')
        option.readOnly = false
    }
    return content
}

class Content extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { hostData } = this.props
        const searchValue = hostData.get('searchValue')
        const hostList = hostData.get('hostList')
        editor = CodeMirror.fromTextArea(document.getElementById("code"), option);
        editor.on('change', (editor1, changes) => {
            let content = editor.getValue()
            let { dispatch, activeHost } = this.props 
            activeHost = activeHost.toObject()
            if(activeHost.type !== 'all') {
                dispatch(updateHost(activeHost.data.get('id'), {
                    content: content
                }, searchValue, hostList))
            }
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !IT.is(nextProps.activeHost, this.props.activeHost)
    }
    componentDidUpdate() {
        let { dispatch, activeHost, hostData } = this.props
        const searchValue = hostData.get('searchValue')
        const hostList = hostData.get('hostList')
        let content = ''
        const codeMirrorDOM = document.querySelector('.CodeMirror.cm-s-default')
        
        codeMirrorDOM.parentNode.removeChild(codeMirrorDOM)
        activeHost = activeHost.toObject()
        content = formatContent(activeHost)
        editor = CodeMirror.fromTextArea(document.getElementById("code"), option);
        editor.on('change', (editor1, changes) => {
            let content = editor.getValue()
            let { dispatch, activeHost } = this.props
            activeHost = activeHost.toObject()
            // loading
            if(!!loading_t) {
                // 自动结束
                if(loading_isEnd) {
                    clearTimeout(loading_t)
                    loading_isEnd = false
                    loading_t = setTimeout(() => {
                        loading_isEnd = true
                        if(activeHost.type !== 'all') {                            
                            dispatch(updateHost(activeHost.data.get('id'), {
                                content: content
                            }, searchValue, hostList))
                        }
                        // 修改host文件
                        updateHostFile()
                    }, 100)
                } else {
                    // // 被动结束
                    clearTimeout(loading_t)
                    loading_t = setTimeout(() => {
                        loading_isEnd = true
                        if(activeHost.type !== 'all') {
                            dispatch(updateHost(activeHost.data.get('id'), {
                                content: content
                            }, searchValue, hostList))
                        }
                        // 修改host文件
                        updateHostFile()
                    }, 100)
                }
            } else {
                loading_isEnd = false
                loading_t = setTimeout(() => {
                    loading_isEnd = true
                    if(activeHost.type !== 'all') {
                        dispatch(updateHost(activeHost.data.get('id'), {
                            content: content
                        }, searchValue, hostList))
                    }
                    // 修改host文件
                    updateHostFile()
                }, 100)
            }
        })

        editor.setValue(content)

        // 如果搜索词，筛选一遍
        // const searchValue = hostData.get('searchValue')
        // if(searchValue) {
        //     const contentSource = document.querySelector('.CodeMirror-code').innerHTML
        //     const contentFransform = require('../../../../model/search').filterContent(searchValue, contentSource)
        //     if(contentSource !== contentFransform) {
        //         document.querySelector('.CodeMirror-code').innerHTML = contentFransform
        //     }
        // }
    }
    render() {
        let { activeHost } = this.props
        let content = ''
        activeHost = activeHost.toObject()

        content = formatContent(activeHost)
        return (
            <textarea id="code" className="_host-content" name="code">{content}</textarea>
        );
    }
}

function select(state) {
    return {
        activeHost: state.activeHost,
        hostData: state.hostData
    }
}

export default connect(select)(Content)