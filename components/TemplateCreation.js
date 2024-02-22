import EditorHelper from "./editor/EditorHelper";
import Editor from "@monaco-editor/react";
import EditorView from "./editor/EditorView";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import router from "next/router";
import {AuthContext} from "../lib/authContext";
import {createDetails} from "../utils/fetch-util";
import {hostport} from "../next.config";

export default function TemplateCreation({values,template}){

    const [fileContents, setFileContents] = useState([])

    const git = "bitbucket";
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;
    const workspace = organization_name;
    const reposlug = project_name;
    const {userData} = useContext(AuthContext)
    const [newBranch, setNewBranch] = useState("")

    const [gitInput, setGitInput] = useState({
        id: "",
        organization: workspace,
        project: reposlug,
        git: git,
        filename: "",
        message: "",
        branch: newBranch,
        content: "to check the bitbucket",
        sha: "",
        change_request_id: "",
        title: "",
        head: newBranch,
        base: "master",
        files: [],
        file_contents: []
    })

    function onFileSave(fileName, fileContent) {
        let newFileState = [...fileContents];

        newFileState.forEach((v, i) => {
            if (v.name === fileName) {
                newFileState[i] = {
                    name: fileName,
                    content: fileContent
                }
            }
        });

        setFileContents(newFileState)
    }

    function getBranchName(userData) {

        let randomstring = (Math.random() + 1).toString(36).substring(7);

        if (userData !== undefined) {
            if (userData.identity.traits.first_name !== undefined) {
                return `${project_name}${userData.identity.traits.first_name}-${randomstring}`
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    let randomstring = (Math.random() + 1).toString(36).substring(7);

    const handleCloseCreate = useCallback(async () => {
        const jenkinsFile = [
            `@Library([\"mm-dsl\"])_\n` +
            `mm_mpaas_infra_pipeline\n` +
            `{\n` +
            `   ORGANIZATION = \"${organization_name}\"\n` +
            `   PROJECT = \"${project_name}\"\n` +
            `   ENVIRONMENT = \"${environment_name}\"\n` +
            `   BASE_URL = \"https://mpaas-dev.m-devsecops.com\"\n` +
            `}\n`
        ]
        let filenames = fileContents.map((e) => e.name)
        let filecontents = fileContents.map((e) => e.content)
        if(!filenames.includes("Jenkinsfile")) {
            filenames.push("Jenkinsfile")
        }
        if(!fileContents.includes(jenkinsFile[0])){
            filecontents.push(jenkinsFile[0])
        }
        let newBranch = getBranchName(userData);
        if (newBranch !== "") {
            var newGitInput = {...gitInput};
            newGitInput.message = newBranch;
            newGitInput.newBranch = newBranch;
            newGitInput.branch = newBranch;
            newGitInput.head = newBranch;
            newGitInput.files = filenames;
            newGitInput.file_contents = filecontents
            newGitInput.title = project_name + "-" + randomstring
        }
        const createCommit = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/commitandchangerequest`;
        await createDetails(createCommit, "", "", "", newGitInput)

    })

    useEffect(() => {
        setFileContents(values)
    },[values])

    return (
        <div>
            <div align={"right"}>
                <Button onClick={() => {
                    template()
                }}>
                    Back
                </Button>
            </div>
            <EditorHelper
                files={fileContents}
                onFileContentChange={(fileName, fileContent, markers, autoComplete, onValueChange) => {
                    return (
                        <div key={fileName}>
                            <EditorView
                                key={fileName}
                                editorFileName={fileName}
                                editorValue={fileContent}
                                editorExpanded={false}
                                editorMarkers={markers}
                                onFileSave={onFileSave}
                                autoComplete={autoComplete}
                                onValueChange={onValueChange}
                            />
                            <br/>
                        </div>
                    );
                }}
            />
            <div align={"right"}>
                <Button
                    variant={"contained"}
                    onClick={handleCloseCreate}
                >
                    create
                </Button>
            </div>
        </div>
    )
}