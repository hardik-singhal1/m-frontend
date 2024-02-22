import Editor from "@monaco-editor/react";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import Can from "../../lib/Can";
import {Button} from "@mui/material";
import {AuthContext} from "../../lib/authContext";
import {updateDetails} from "../../utils/fetch-util";
import {useRouter} from "next/router";
import {hostport} from "../../next.config";

export default function ModuleEditor({content, module, changeRequestData}) {

    const router = useRouter()
    const editorRef = useRef(null);
    const [jsCode, setJsCode] = useState("")
    const [vars, setVars] = useState([])
    const {userData} = useContext(AuthContext);
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    function handleEditorDidMount(editor, monaco, _valueGetter) {
        let contentEditor = content
        if (content !== null) {
            let vars = contentEditor.map((tfVars) =>
                tfVars = tfVars.slice(tfVars.indexOf("=") + 2, tfVars.length - 1)
            )
            var contentWidget = [];
            let fillEmptyString = ""
            vars.splice(0, 0, fillEmptyString);

            for (let i = 2; i < contentEditor.length + 2; i++) {
                const data = {
                    domNode: null,
                    getId: function () {
                        return "my.content.widget" + i;
                    },
                    getDomNode: function () {
                        if (!this.domNode) {
                            this.domNode = document.createElement("div")
                            this.domNode.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                <div>
                                    <input
                                        style={{width: 250, height: 20}}
                                        id={"data" + i}
                                        defaultValue={vars[i - 1]}
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
                                endLineNumber: contentEditor.length + 2,
                                startColumn: 70,
                                startLineNumber: i,
                            },
                            preference: [
                                monaco.editor.ContentWidgetPositionPreference.EXACT,
                                monaco.editor.ContentWidgetPositionPreference.BELOW,
                            ],
                        };
                    },
                };
                contentWidget.push(data);
                editor.addContentWidget(contentWidget[i - 2]);
            }
            editor.onMouseMove(function (e) {

            });

            editor.updateOptions({fontSize: 16});
            editor.updateOptions({readOnly: true});
            editorRef.current = editor;
        }
    }

    function getEditorValue() {
        let contentEditor = content
        if (contentEditor !== null) {
            let vars = contentEditor.map((tfVars) =>
                tfVars = tfVars.slice(tfVars.indexOf("=") + 2, tfVars.length - 1)
            )
            contentEditor = contentEditor.map((contentArrayValue) =>
                contentArrayValue = contentArrayValue.slice(0, contentArrayValue.indexOf("="))
            )
            contentEditor = contentEditor.map((contentArrayValue) =>
                contentArrayValue = " ".repeat(5) + contentArrayValue + " ".repeat(40 - contentArrayValue.length - 5) + "="
            )
            const modulename = [''];
            const module_end = [""];
            contentEditor.splice(0, 0, modulename[0]);
            contentEditor.splice(contentEditor.length + 1, 0, module_end[0]);
            setVars(vars)
            setJsCode(contentEditor.join("\n"))
        } else {
            setJsCode("")
        }
    }

    const handleUpdatevars = useCallback(() => {
        const updateVars = `${hostport}/api/v1/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/vars/`

        try {
            const getPullRequestRoute = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest`;
            let newBranch
            updateDetails(getPullRequestRoute, "", changeRequestData)
                .then((res) => {
                    res.response_data = res.response_data.filter((e) => changeReq === e.title)

                    if (res.response_data.length > 0) {
                        newBranch = res.response_data[0].source;
                        setBranch(res.response_data[0].source)
                        const newValue = {
                            id: `/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/${res.response_data[0].source}/vars`,
                            name: module,
                            change_request: res.response_data[0].source,
                            vars: vars
                        }

                        updateDetails(updateVars, "", newValue)
                            .catch((err) => {
                                console.log(JSON.stringify(err.message))
                            });
                    }
                })
                .catch((err) => console.log("PR Error"))


        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    })

    const updateyes = useCallback(() => {
            return (
                <div
                    align={"right"}
                >
                    {
                        (organization_name !== undefined && project_name !== undefined) && <Button
                            variant={"contained"}
                            onClick={handleUpdatevars}
                        >
                            Update
                        </Button>
                    }

                </div>
            )
        }
    )

    useEffect(() => {
        getEditorValue()
    }, [])

    return (
        <div>
            {userInfo &&
                <Can
                    perform={"write"}
                    role={userInfo.identity.id}
                    yes={updateyes}
                />
            }
            <br/>
            <br/>
            <Editor
                height="50vh"
                defaultLanguage="hcl"
                defaultValue={jsCode}
                onMount={handleEditorDidMount}
            />
        </div>
    )
}