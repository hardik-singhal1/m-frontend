import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Button} from "@material-ui/core";
import {Divider, Typography} from "@mui/material";
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";
import TemplateDialogue from "./TemplateDialogue";
import EditorHelper from "./editor/EditorHelper";
import EditorView from "./editor/EditorView";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/authContext";
import {createDetails} from "../utils/fetch-util";
import {hostport} from "../next.config";

export default function TemplateCreate({close, name,providerName,resourceName,templateType}) {
    const [open, setOpen] = useState(false)

    const [files, setFiles] = useState([])
    const handleClose = useCallback(() => {
        close()
    })
    const [filesState, setFilesState] = useState([]);
    const router = useRouter();
    const {organization_name: organizationName} = router.query;
    const {userData} = useContext(AuthContext);
    const [templateValue,setTemplateValue] = useState({})

    useEffect(() => {
        const createTemplateValue = {
            "template_name": name,
            "organization_id": `organizations/${organizationName}`,
            "provider": providerName,
            "resource_name": resourceName,
            "user_id": userData.identity.id,
            "version": "1",
            "template_type": templateType,
            "template": filesState,
        }
        setTemplateValue(createTemplateValue)

    },[name,providerName,resourceName,router,filesState,templateType])

    const handleCloseCreate = useCallback(() => {
        const createTemplate = `${hostport}/api/v1/organizations/${organizationName}/infratemplates/`;
        try {
            createDetails(createTemplate, "", "", "", templateValue)
                .then((res) => {
                    res;
                })
                .catch((err) => {
                    console.log("Creating Template Failed")
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
        router.push(`/organization/${organizationName}/templates`);
    })

    const handleAdd = useCallback((e) => {
        let newValue = {
            name: e,
            content: "\n",
        }
        !filesState.includes(e) &&
        filesState.push(newValue)
    })

    function onFileSave(fileName, fileContent) {
        let newFileState = [...filesState];

        newFileState.forEach((v, i) => {
            if (v.name === fileName) {
                newFileState[i] = {
                    name: fileName,
                    content: fileContent
                }
            }
        });
        setFilesState(newFileState);
    }
    console.log(filesState)

    return (
        <div>
            {open ? <TemplateDialogue close={() => setOpen(false)} data={handleAdd}/> :
                <div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Typography variant={"h4"}>Create Resource Files</Typography>
                        <Box sx={{flexGrow: 1}}/>
                        <Button
                            size={"large"}
                            startIcon={<AddIcon/>}
                            onClick={() => setOpen(true)}>ADD FILE</Button> &nbsp;&nbsp;
                        <Button onClick={handleClose} color={"error"}>Close</Button>
                    </div>
                    <br/>
                    <Divider/>
                    <br/>
                    <EditorHelper
                        files={filesState}
                        onFileContentChange={(fileName, fileContent, markers, autoComplete, onValueChange) => {
                            return (
                                <div key={fileName}>
                                    <EditorView
                                        key={fileName}
                                        editorFileName={fileName}
                                        editorValue={fileContent}
                                        // editorExpanded={false}
                                        editorMarkers={markers}
                                        onFileSave={onFileSave}
                                        autoComplete={autoComplete}
                                        onValueChange={onValueChange}
                                    />
                                    <br/>
                                </div>
                            );
                        }}
                        onSave={(files) => {
                            console.log("files",files)
                            let newFiles = _.cloneDeep(files);
                            // let i = files.findIndex((v) => v.name === "variables.tfvars")
                            // newFiles[i].name = `variables.${environmentName}.tfvars`;
                            setFilesState(newFiles)
                        }}
                    />
                    <Divider/>
                    <br/>
                    <div align="right">
                        <Button color={"primary"} onClick={handleCloseCreate} variant={"contained"}>Create</Button>
                    </div>
                </div>
            }
        </div>
    )
}