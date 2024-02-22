import {useContext, useEffect, useRef, useState} from "react";
import {loadFiles, checkType, generateAutoCompleteArtifacts} from "@aravindlib1/testgopherjs/parser"
import {createDetails, getDetails} from "../../utils/fetch-util";
import {hostport} from "../../next.config";
import Editor, {useMonaco} from "@monaco-editor/react";
import {BottomNavigation, BottomNavigationAction, Fab} from "@material-ui/core";
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Button, Paper} from "@mui/material";
import Box from "@material-ui/core/Box";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useRouter} from "next/router";
import Can from "../../lib/Can";
import {AuthContext} from "../../lib/authContext";
import {userInfo} from "os";

// copied from monaco-editor npm package
const MarkerSeverity = {
    Ignore: '#EDF9FA',
    Hint: 1,
    Info: 2,
    Warning: 4,
    Error: 8
}

const styles = theme => ({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
});

function EditorHelper({
                          files,
                          onFileContentChange,
                          saveButtonText,
                          onSave,
                          isValidate,
                          deleteFile,
                      }) {

    const [originalFilesState, setOriginalFilesState] = useState({});
    const [showSaveBar, setShowSaveBar] = useState(false);
    const [filesState, setFilesState] = useState([]);
    const [tfContent, setTfContent] = useState({});
    const [moduleInputs, setModuleInputs] = useState({});
    const [markers, setMarkers] = useState({});
    const [autoComplete, setAutoComplete] = useState(null);
    const {userData} = useContext(AuthContext)
    const monaco = useMonaco();
    const autoDispose = useRef(null);
    const router = useRouter()
    const {organization_name: organizationName} = router.query;
    const [validateResponse, setValidateResponse] = useState({})

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    useEffect(
        () => {
            // initialization on mount here...

            // returning the destructor
            return dispose
        },
        [autoDispose, monaco],
    );

    function dispose() {
        autoDispose?.current?.dispose();
        monaco?.editor?.getModels().forEach(m => m.dispose());
    }

    useEffect(() => {
        console.log("monaco registered auto")
        if (monaco && autoComplete) {
            autoDispose?.current?.dispose();
            let c = monaco.languages.registerCompletionItemProvider('hcl', {
                provideCompletionItems: async function (model, position) {
                    let fileName = model.uri.path.replace("/", "");
                    let references = autoComplete[`${fileName}`]?.[`${fileName}|${position.lineNumber}|${position.lineNumber}`]?.references;

                    var range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endColumn: position.column,
                    };

                    var suggestionsObj = {};
                    for (let i = 0; i < references.length; i++) {
                        var v = references[i];

                        var description;
                        var type;
                        try {
                            description = JSON.parse(moduleInputs[`${v.module_source}|${v.module_version}`].filter(m => m.name === v.attribute)?.[0]?.description);
                            type = moduleInputs[`${v.module_source}|${v.module_version}`].filter(m => m.name === v.attribute)?.[0]?.type;
                        } catch (e) {
                            console.log(e);
                        }

                        switch (description.type) {
                            case 'json':
                                description.data.forEach(v => {
                                    var insertText;
                                    var label;
                                    switch (type) {
                                        case "string":
                                            label = v;
                                            insertText = `"${v}"`;
                                            break;
                                        case "bool":
                                            label = v.toString();
                                            insertText = `${v}`;
                                            break;
                                        default:
                                            label = v.toString();
                                            insertText = `${v}`;
                                            break;
                                    }
                                    suggestionsObj[v] = {
                                        label: label,
                                        kind: monaco.languages.CompletionItemKind.Text,
                                        documentation: '',
                                        insertText: insertText,
                                        range: range
                                    };
                                })
                                break;
                            case 'api':
                                const getRegions = `${hostport}${description.data}`;
                                var res = await getDetails(getRegions, "", "", "", "", {
                                    // todo remove this hardcoding, it has to come from description in module itself
                                    cloud: "google",
                                });

                                res?.response_data?.forEach(s => {
                                    var insertText;
                                    var label;
                                    switch (type) {
                                        case "string":
                                            label = s;
                                            insertText = `"${s}"`;
                                            break;
                                        case "bool":
                                            label = s.toString();
                                            insertText = `${s}`;
                                            break;
                                        default:
                                            label = s.toString();
                                            insertText = `${s}`;
                                            break;
                                    }
                                    suggestionsObj[s] = {
                                        label: label,
                                        kind: monaco.languages.CompletionItemKind.Text,
                                        documentation: '',
                                        insertText: insertText,
                                        range: range
                                    };
                                })
                                break;
                        }
                    }

                    let suggestions = Object.values(suggestionsObj);

                    return {
                        suggestions: suggestions
                    };
                }
            });
            autoDispose.current = c;
        }
    }, [monaco, autoComplete, moduleInputs]);

    useEffect(() => {
        let originals = {};
        files.forEach((v, i) => {
            originals[v.name] = v;
            originals[v.name].updated = false;
        });

        setOriginalFilesState(originals);
        setFilesState(files);
    }, [files]);

    useEffect(() => {
        let newTfContent;

        try {
            // the response will have two elements, one is the content and other is the diags(errors)
            // todo work on diags also
            newTfContent = loadFiles(filesState)[0];
        } catch (e) {
            console.log(e);
            return
        }

        if (newTfContent.Modules) {
            findAndSetModuleInputs(newTfContent.Modules)
                .then(newInputs => {
                    setModuleInputs(newInputs)
                })
                .catch(e => console.log("unable to set inputs", e));
        }

        let newAutoComplete = {};
        let auto = generateAutoCompleteArtifacts(filesState);
        let keys = Object.keys(auto.artifacts);

        keys.forEach(v => {
            if (!newAutoComplete[auto.artifacts[v].range.Filename]) {
                newAutoComplete[auto.artifacts[v].range.Filename] = {};
            }
            newAutoComplete[auto.artifacts[v].range.Filename][v] = auto.artifacts[v];
        });

        autoDispose?.current?.dispose();
        setAutoComplete(newAutoComplete);
        setTfContent(newTfContent);
    }, [filesState]);


    useEffect(async () => {
        if (isValidate) {
            const url = `${hostport}/api/v1/organizations/${organizationName}/policy/module/execute`
            try {
                await createDetails(url, "", "", "", tfContent, "")
                    .then((response) => {
                        setValidateResponse(response)
                    })
            } catch (error) {
                console.log(error)
            }
        }
    })

    useEffect(() => {
        if (moduleInputs && typeof moduleInputs !== "undefined") {
            let typeMarkers = generateInputMarkers(tfContent, moduleInputs);
            let validateMarkers = generateValidateMarkers(validateResponse)
            let markers = typeMarkers
            for (const [key, value] of Object.entries(validateMarkers)) {
                for (const [key1, value1] of Object.entries(markers)) {
                    if (key1 === key) {
                        const newMarker = value.concat(value1)
                        markers[key] = newMarker
                    }
                }
            }

            if (markers && typeof markers !== "undefined") {
                setMarkers(markers);
            }
        }
    }, [tfContent, moduleInputs, validateResponse]);

    function onValueChange(fileName, fileContent) {
        let newFileState = [...filesState];

        newFileState.forEach((v, i) => {
            if (v.name === fileName) {
                let newOriginals = {...originalFilesState};
                if (originalFilesState[v.name].content !== fileContent) {
                    newOriginals[v.name].updated = true;
                } else {
                    newOriginals[v.name].updated = false;
                }
                setOriginalFilesState(newOriginals);
                newFileState[i] = {
                    name: fileName,
                    content: fileContent
                }
            }
        });

        setFilesState(newFileState);
    }

    useEffect(() => {
        let save = Object.values(originalFilesState).reduce((alreadyUpdated, current) => {
            return !alreadyUpdated ? current.updated : alreadyUpdated;
        }, false);
        setShowSaveBar(save);
    }, [originalFilesState]);

    function canYes() {

        return (
            <div>
                <div style={{height: "73px"}}/>
                <Paper variant={"outlined"} square elevation={2} sx={{
                    position: "fixed",
                    left: "0px",
                    bottom: "0px",
                    width: "100%",
                    display: "flex",
                    flexFlow: "row wrap",
                    height: "73px"
                }}>
                    <Box sx={{flexGrow: 1}}/>
                    <Button startIcon={<CheckCircleOutlineIcon/>}
                            onClick={() => {
                                setShowSaveBar(false);
                                let temp=[];
                                filesState.forEach((item)=>{
                                    if(item?.updated!==false || item?.type==='new'){
                                        temp.push(item);
                                    }
                                })
                                onSave(temp)
                            }}
                            variant={"outlined"}
                            sx={{height: "50%", margin: "auto", marginRight: "20px"}}
                            color={"success"}
                        // disabled={Object.values(markers).reduce((total, current) => current.length, 0) > 0}
                            disabled={false}
                    >
                        {saveButtonText}
                    </Button>
                    <Button startIcon={<HighlightOffIcon/>}
                            onClick={() => {
                                setFilesState(Object.values(originalFilesState));
                                setShowSaveBar(false);
                            }}
                            variant={"outlined"}
                            sx={{height: "50%", margin: "auto", marginRight: "50px"}}
                            color={"error"}>
                        Cancel
                    </Button>
                </Paper>
            </div>
        )
    }

    return (
        <>
            {
                filesState.map(f => onFileContentChange(f.name, f.content, markers[f.name], autoComplete?.[f.name], onValueChange))
            }
            <br/>
            {
                showSaveBar
                &&
                <>
                    {userInfo &&
                        <Can
                            perform={"write_module"}
                            yes={canYes}
                            role={userInfo.identity.id}
                        />
                    }
                </>
            }

        </>
    )

}

function generateInputMarkers(tfContent, inputs) {
    // will contain both resources and modules
    // first working only on modules, todo work on resources as well

    // marker has to be in this format
    // {
    //     startLineNumber: m.Module.HeaderRange.Start.Line,
    //     startColumn: m.Module.HeaderRange.Start.Column,
    //     endLineNumber: m.Module.HeaderRange.End.Line,
    //     endColumn: m.Module.HeaderRange.End.Column,
    //     message: 'Missing attributes',
    //     severity: monaco.MarkerSeverity.Error
    // }

    let inputMarkers = {};
    if (tfContent.Modules) {
        for (const [key, value] of Object.entries(tfContent.Modules)) {
            let input = inputs[`${value.source}|${value.version}`];
            let actualAttributes = value.attributes;
            if (typeof input === "undefined") {
                continue;
            }
            input.forEach(i => {
                // i will be of the format
                // {
                //     name: "subnet",
                //     type: "string",
                //     description: "this is the subnet for the cluster",
                //     default: "",
                //     required: true
                // }

                // value will be of the format
                // {
                //     "first_header":"gke-opinionated",
                //     "first_header_range":{
                //         "Filename":"test.tf",
                //         "Start":{
                //             "Line":2,
                //             "Column":1,
                //             "Byte":1
                //         },
                //         "End":{
                //             "Line":2,
                //             "Column":25,
                //             "Byte":25
                //         }
                //     },
                //     "source":"bootlabstech/gke-opinionated/google",
                //     "version":"1.0.0-beta.3",
                //     "attributes":{...}
                // }

                // first check if all required inputs are present
                if (i.required) {
                    if (!actualAttributes.hasOwnProperty(i.name)) {
                        let newMarker = {
                            startLineNumber: value.first_header_range.Start.Line,
                            startColumn: value.first_header_range.Start.Column,
                            endLineNumber: value.first_header_range.End.Line,
                            endColumn: value.first_header_range.End.Column,
                            message: `missing required input ${i.name}`,
                            severity: MarkerSeverity.Error
                        };

                        let existingMarker = inputMarkers[value.first_header_range.Filename];
                        if (existingMarker && typeof existingMarker !== "undefined") {
                            if (!Array.isArray(existingMarker)) {
                                existingMarker = [];
                            }
                        } else {
                            existingMarker = [];
                        }

                        inputMarkers = {
                            ...inputMarkers, [value.first_header_range.Filename]: [...existingMarker, {
                                startLineNumber: value.first_header_range.Start.Line,
                                startColumn: value.first_header_range.Start.Column,
                                endLineNumber: value.first_header_range.End.Line,
                                endColumn: value.first_header_range.End.Column,
                                message: `missing required input ${i.name}`,
                                severity: MarkerSeverity.Error
                            }]
                        };
                    }
                }

                // check if the type is correct
                if (actualAttributes.hasOwnProperty(i.name)) {
                    // attribute will be of the format
                    // "subnet":{
                    //     "Value":"test2323",
                    //     "Range":{
                    //         "Filename":"test.tf",
                    //         "Start":{
                    //             "Line":5,
                    //             "Column":14,
                    //             "Byte":123
                    //         },
                    //         "End":{
                    //             "Line":5,
                    //             "Column":29,
                    //             "Byte":138
                    //         }
                    //     }
                    // }

                    const att = actualAttributes[i.name];
                    let newMarker = {
                        startLineNumber: att.Range.Start.Line,
                        startColumn: att.Range.Start.Column,
                        endLineNumber: att.Range.End.Line,
                        endColumn: att.Range.End.Column,
                        message: `expected input of type ${i.type} but got ${typeof att.Value}`,
                        severity: MarkerSeverity.Error
                    };

                    let existingMarker = inputMarkers[att.Range.Filename];
                    if (existingMarker && typeof existingMarker !== "undefined") {
                        if (!Array.isArray(existingMarker)) {
                            existingMarker = [];
                        }
                    } else {
                        existingMarker = [];
                    }

                    if (!checkType(i.type, att.Value)) {
                        inputMarkers = {...inputMarkers, [att.Range.Filename]: [...existingMarker, newMarker]};
                    }
                }
            })
        }
    }

    return inputMarkers;
}

function generateValidateMarkers(validateResponse) {
    let inputMarkers = {};

    for (let key in validateResponse.response_data) {
        if (!validateResponse.response_data.hasOwnProperty(key)) continue;

        let obj = validateResponse.response_data[key];

        for (let prop in obj) {
            //if (!obj.hasOwnProperty(prop)) continue;

            if (obj[prop].msg.length > 0 && obj[prop].Range.length > 0) {
                let existingMarker = inputMarkers[obj[prop].Range[0].Filename];
                if (existingMarker && typeof existingMarker !== "undefined") {
                    if (!Array.isArray(existingMarker)) {
                        existingMarker = [];
                    }
                } else {
                    existingMarker = [];
                }

                inputMarkers = {
                    ...inputMarkers, [obj[prop].Range[0].Filename]: [...existingMarker, {
                        startLineNumber: obj[prop].Range[0].Start.Line,
                        startColumn: obj[prop].Range[0].Start.Column,
                        endLineNumber: obj[prop].Range[0].End.Line,
                        endColumn: obj[prop].Range[0].End.Column,
                        message: obj[prop].msg[0],
                        severity: MarkerSeverity.Error
                    }]
                };
            }
        }
    }
    return inputMarkers
}

async function findAndSetModuleInputs(modules) {
    let newInputs = {};
    for (const [key, value] of Object.entries(modules)) {
        let input = await getModuleInputs(value.source, value.version);
        newInputs = {...newInputs, ...{[`${value.source}|${value.version}`]: input}};
    }
    return newInputs;
}

async function getModuleInputs(source, version) {
    const url = `${hostport}/terraform/v1/modules/${source}/${version}`;
    let res;
    try {
        res = await getDetails(url, "", "", "");
    } catch (e) {
        console.log(e);
    }

    return res.root.inputs;
}

export default EditorHelper;
