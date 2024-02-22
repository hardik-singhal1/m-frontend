import React, {useEffect} from "react";
import Editor from "@monaco-editor/react";
import * as ReactDOMServer from "react-dom/server";
import {useRef, useState} from "react";
import {Input, Select} from "@material-ui/core";
import ErrorIcon from '@material-ui/icons/Error';
import {hostport} from "../../next.config";
import {updateDetails} from "../../utils/fetch-util";
import {useRouter} from "next/router";

export default function Variable(props) {
    const editorRef = useRef(null);
    const variables = props.data
    const array = []
    const [jsCode, setJsCode] = useState(props.changeRequestData)

    function handleEditorDidMount(editor, monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        // Add a content widget (scrolls inline with text)

        var contentWidget = [
            {
                domNode: null,
                getId: function () {
                    return 'my.content.widget1';
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.innerHTML = ReactDOMServer.renderToStaticMarkup(<Select
                            style={{width: 350, height: 18, paddingTop: 5}}/>);
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        range: {
                            endColumn: 64,
                            endLineNumber: 3,
                            startColumn: 70,
                            startLineNumber: 3
                        },
                        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT, monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            },
            {
                domNode: null,
                getId: function () {
                    return 'my.content.widget2';
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.innerHTML = ReactDOMServer.renderToStaticMarkup(
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Input style={{width: 350, height: 20}}/>
                                <ErrorIcon style={{color: "lightblue"}}/>
                            </div>
                        );
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        range: {
                            endColumn: 64,
                            endLineNumber: 6,
                            startColumn: 70,
                            startLineNumber: 6
                        },
                        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT, monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            },
            {
                domNode: null,
                getId: function () {
                    return 'my.content.widget3';
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.innerHTML = ReactDOMServer.renderToStaticMarkup(<div
                            style={{display: 'flex', flexDirection: 'row'}}>
                            <Input style={{width: 350, height: 20}}/>
                        </div>);
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        range: {
                            endColumn: 64,
                            endLineNumber: 9,
                            startColumn: 70,
                            startLineNumber: 9
                        },
                        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT, monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            }
        ];

        var decorations = editor.deltaDecorations([], [
            {
                range: new monaco.Range(6, 1, 6, 1),
                options: {
                    isWholeLine: true,
                    className: 'myContentClass',
                    glyphMarginClassName: 'myGlyphMarginClass'
                }
            }
        ]);

        editor.updateOptions({readOnly: true});
        editorRef.current = editor;

    }

    return (
        <Editor
            height="90vh"
            defaultLanguage="hcl"
            defaultValue={jsCode}
            onMount={handleEditorDidMount}
        >
        </Editor>
    );
}