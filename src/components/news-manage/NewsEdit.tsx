import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

interface EditProps {
    getContent: (text:string) => void,
    content?: string
}

const NewsEdit: React.FC<EditProps> = (props) => {
    const { getContent } = props
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    // 编辑器内容
    const [html, setHtml] = useState('')

    useEffect(() => {
        console.log('富文本内容',props.content);
        const text = props.content;
        if(text === undefined) return
        setHtml(text)
    }, [props.content])

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = { }
    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        autoFocus:true, // 失效
        onChange: (editor: IDomEditor) => {
            console.log(111)
            getContent(editor.getHtml())
        },
        onBlur: (editor: IDomEditor) => {   // 失效
            console.log(111)
            getContent(editor.getHtml())
        }
    }
    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100,marginTop:'30px'}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    mode="default"
                    style={{ minHeight: '290px', overflowY: 'hidden' }}
                />
            </div>
        </>
    )
}
export default NewsEdit