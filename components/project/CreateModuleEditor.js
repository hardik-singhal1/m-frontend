import React, {useState} from "react";
import Editor from "@monaco-editor/react";
import * as ReactDOMServer from "react-dom/server";
import {useEffect, useRef, useContext} from "react";
import {createDetails} from "../../utils/fetch-util";
import {hostport} from "../../next.config";
import {useRouter} from "next/router";
import {ErrorContext} from "../../lib/errorContext";

export default function CreateModuleEditor(props) {
    const editorRef = useRef(null);
    const router = useRouter();
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const [jsCode, setJsCode] = useState("")
    const [inputArray, setInputArray] = useState([])
    const [value, setValue] = useState("")
    const [moduleName, setModuleName] = useState("")
    const [dataValue, setDataValue] = useState([])
    const {errorTrigger} = useContext(ErrorContext)

    function getData(data) {
        const datas = data.root.inputs
        const required_inputs = datas.filter(d => d.required == true)
        const input_array = required_inputs.map(d => " ".repeat(5) + d.name + " ".repeat(60 - d.name.length - 5) + "=")
        const module = ["module \"" + data.name + "\" {" + " ".repeat(60)]
        setModuleName(data.name)
        const module_end = ["}"]
        input_array.splice(0, 0, module[0])
        input_array.splice(data.root.inputs.length, 0, module_end[0])
        setInputArray(input_array)
        setJsCode(input_array.join("\n"))
    }

    useEffect(() => {
        if (props.datas == "") {
            setJsCode("")
        } else {
            getData(props.datas)
        }
        setModuleName(props.name.name)
    }, [props.datas])

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    function handleEditorDidMount(editor, monaco, _valueGetter) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        // Add a content widget (scrolls inline with text)

        var contentWidget = []

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

        var datalength = editor.getValue()
        var d = 0

        for (var j = 0; j < datalength.length; j++) {
            if (datalength[j] == "\n") {
                d++;
            }
        }

        var state = props.terraformvalues

        for (var i = 2; i < d + 1; i++) {
            var data = {
                domNode: null,
                getId: function () {
                    return 'my.content.widget' + i;
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.innerHTML = ReactDOMServer.renderToStaticMarkup(
                            <div>
                                <input
                                    style={{width: 350, height: 20}}
                                    id={"data" + i}
                                    defaultValue={state[i]}
                                />
                            </div>
                        );
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        range: {
                            endColumn: 64,
                            endLineNumber: d,
                            startColumn: 70,
                            startLineNumber: i
                        },
                        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT, monaco.editor.ContentWidgetPositionPreference.BELOW],
                    };
                }
            }
            contentWidget.push(data)
            editor.addContentWidget(contentWidget[i - 2]);
        }

        editor.onMouseMove(function (e) {
            var arr = []
            for (var g = 2; g; g++) {
                var id = "data" + g
                if (document.getElementById(id).value != null) {
                    arr.push(document.getElementById(id).value)
                    setDataValue(arr)
                }
            }

        })

        editor.updateOptions({readOnly: true});

        editorRef.current = editor;
        // const el = document.createElement("div");
        // el.className = "marker";

        // el.innerHTML = ReactDOMServer.renderToStaticMarkup(<div className='marker' />);
    }

    useEffect(() => {
    }, [dataValue])

    const onClick = () => {
        if (dataValue.includes('')) {
            errorTrigger("error", JSON.stringify(err.message))
        } else {
            try {
                var createModule = hostport + `/api/v1/organizations/${organization_name}/projects/${project_name}/modules/${moduleName}/values`
                const module = {
                    id: `/organizations/${organization_name}/projects/${project_name}/modules/${moduleName}/values`,
                    values: dataValue
                }
                createDetails(createModule, "", module)
                    .then(res => {
                        res
                    })
                    .catch(err => {
                        errorTrigger("error", JSON.stringify(err.message))
                    });
            } catch (err) {
                errorTrigger("error", JSON.stringify(err.message))
            }
        }
    }

    return (
        <div>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                defaultValue={jsCode}
                onMount={handleEditorDidMount}
            >
            </Editor>
        </div>
    );
}