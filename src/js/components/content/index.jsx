import './index.scss'
const { Component } = React
import { connect } from 'react-redux'
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
    value : "http://www.cnblogs.com/oldphper",  // 文本域默认显示的文本
    mode : "javascript",  // 模式
    indentUnit : 2,  // 缩进单位，默认2
    smartIndent : true,  // 是否智能缩进
    tabSize : 4,  // Tab缩进，默认4
    readOnly : 'nocursor',  // 是否只读，默认false, nocursor
    showCursorWhenSelecting : true,
    lineNumbers : true,  // 是否显示行号
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

class Index extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        editor = CodeMirror.fromTextArea(document.getElementById("code"), option);
        editor.on('change', (editor1, changes) => {
            let content = editor.getValue()
            let { dispatch, activeHost } = this.props 
            activeHost = activeHost.toObject()
            if(activeHost.type !== 'all') {
                dispatch(updateHost(activeHost.data.get('id'), {
                    content: content
                }))
            }
        })
    }
    componentDidUpdate() {
        let { dispatch, activeHost } = this.props
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
                    // dispatch(showLoading())
                    clearTimeout(loading_t)
                    loading_isEnd = false
                    loading_t = setTimeout(() => {
                        loading_isEnd = true
                        // dispatch(hideLoading())
                        if(activeHost.type !== 'all') {
                            dispatch(updateHost(activeHost.data.get('id'), {
                                content: content
                            }))
                        }
                        // 修改host文件
                        updateHostFile()
                    }, 100)
                } else {
                    // // 被动结束
                    clearTimeout(loading_t)
                    loading_t = setTimeout(() => {
                        loading_isEnd = true
                        // dispatch(hideLoading())
                        if(activeHost.type !== 'all') {
                            dispatch(updateHost(activeHost.data.get('id'), {
                                content: content
                            }))
                        }
                        // 修改host文件
                        updateHostFile()
                    }, 100)
                }
            } else {
                // dispatch(showLoading())
                loading_isEnd = false
                loading_t = setTimeout(() => {
                    loading_isEnd = true
                    // dispatch(hideLoading())
                    if(activeHost.type !== 'all') {
                        dispatch(updateHost(activeHost.data.get('id'), {
                            content: content
                        }))
                    }
                    // 修改host文件
                    updateHostFile()
                }, 100)
            }
        })
        editor.setValue(content)
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
        activeHost: state.activeHost
    }
}

export default connect(select)(Index) 