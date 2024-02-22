import React, {useCallback, useState} from "react";
import {useEffect, useRef, useContext} from "react";
import {Button, Stack} from "@mui/material";
import {createDetails, deleteDetails, getDetails, updateDetails} from "../../utils/fetch-util";
import {hostport} from "../../next.config";
import {useRouter} from "next/router";
import {ErrorContext} from "../../lib/errorContext";
import {AuthContext} from "../../lib/authContext";
import EditorView from "../editor/EditorView";
import EditorHelper from "../editor/EditorHelper";
import Grid from "@material-ui/core/Grid";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {Alert} from "@mui/lab";

export default function ProjectEditor({
                                          changeReq,
                                          onClickEditor,
                                          datas,
                                          name,
                                          provider,
                                          type,
                                          contents,
                                          isEnvSpecific,
                                          createOpen,
                                          editor,
                                          change,
    awsAcc
                                      }) {
    const router = useRouter();
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;
    const [jsCode, setJsCode] = useState("");
    const [filesState, setFilesState] = useState([]);
    const [state, setState] = useState(false)
    const [inputArray, setInputArray] = useState([]);
    const [requiredFields, setRequiredFields] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [moduleName, setModuleName] = useState("");
    const [dataValue, setDataValue] = useState([]);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext)
    const [newBranch, setNewBranch] = useState("")
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState(false)
    const [values, setValues] = useState({
        name: name,
        provider: provider.title,
        module: datas.name,
    });

    const {environment_name: environmentName} = router.query;


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

    const git = "bitbucket";
    const workspace = organization_name;
    const reposlug = project_name;

    useEffect(() => {
        let newBranch = getBranchName(userData);
        if (newBranch !== "") {
            var newGitInput = {...gitworkflow};
            newGitInput.message = newBranch;
            newGitInput.newBranch = newBranch;
            setGitworkflow(newGitInput);
        }
    }, [userData]);

    const changeRequestTitle = project_name + "-" + randomstring

    const [gitworkflow, setGitworkflow] = useState({
        project_id: `organizations/${organization_name}/projects/${project_name}`,
        bitbucket_project: project_name,
        bitbucket_org: organization_name,
        raised_by_id: userData.identity.traits.first_name,
        source_branch: "",
        branch_name: "",
        pr_name: changeRequestTitle,
        files: [],
        file_contents: []
    })

    const terraformVersion = 0.13;
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const providerFile = [
        `terraform {\n` +
        `  required_version = \">= ${terraformVersion}\"\n` +
        `  backend \"gcs\" {}\n` +
        `}`
    ];
    const awsProviderFile = [
        `terraform {\n` +
        `  required_version = \">= ${terraformVersion}\"\n` +
        `  backend \"s3\" {}\n` +
        `}`
    ];

    // function getAWSProviderFile(accountID){
    //     return [
    //         `terraform {\n` +
    //         `  required_version = \">= ${terraformVersion}\"\n` +
    //         `  backend \"s3\" {}\n` +
    //         `} \n\n` +
    //         `provider \"aws\" {\n` +
    //         `# Configuration options \n` +
    //         `  assume_role { \n` +
    //         `  role_arn  = \"arn:aws:iam::${accountID}:role/OrganizationAccountAccessRole\" \n`+
    //         ` } \n` +
    //         `}`
    //     ];
    // };

    const backendFile = [
        `    bucket = \"${bucketName}\"\n` +
        `    prefix = \"organizations/${organization_name}/projects/${project_name}/environment/${environmentName}\"\n`
    ]

    const awsBackendFile = [
        `    bucket = \"${bucketName}\"\n` +
        `    key = \"organizations/${organization_name}/projects/${project_name}/environment/${environmentName}\"\n`+
        `    region=\"ap-south-1\"`
    ]

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

    async function getData(data) {
        let datas = data.root.inputs;
        let modulename = data.name
        if (JSON.stringify(datas) === "[]") {
            const submodules = data.submodules
            for (const iteration in submodules) {
                if (submodules[iteration].name === "compute_instance" ||
                    submodules[iteration].name === "mysql"
                ) {
                    datas = submodules[iteration].inputs
                    modulename = submodules[iteration].name
                }
            }
        }
        let requiredInputs = datas.filter((d) => d.required === true);
        if (requiredInputs.length === 0) {
            requiredInputs = datas
        }
        setRequiredFields(requiredInputs)
        const maxLength = requiredInputs.reduce((max, input) => input.name.length > max ? input.name.length : max, 0);
        const spacingWithOffset = maxLength > 7 ? maxLength + 2 : 9
        const input_array = requiredInputs.map(
            (d) => " ".repeat(5) + d.name + " ".repeat(spacingWithOffset - d.name.length) + "= " + 'var.'+name +'_'+d.name
        );
        console.log("vartf",requiredInputs)
        const varsFileContents = requiredInputs.map(
            (d) => {
                if(d.name==="role_arn"){
                    return " ".repeat(5) + name + "_" + d.name + " ".repeat(spacingWithOffset - `${d.name}`.length) + "= "+`\"arn:aws:iam::${awsAcc}:role/mpaas-access\"`
                }
                return " ".repeat(5) + name + "_" + d.name + " ".repeat(spacingWithOffset - `${d.name}`.length) + "= "
            }
        );
        const module = ['module "' + name + '" {' + " ".repeat(spacingWithOffset)];
        const source = [" ".repeat(5) + "source" + " ".repeat(spacingWithOffset-6) + "= " + '"'+data.namespace +"/"+
        data.name + "/"+ data.provider +'"'];
        const version = [" ".repeat(5) + "version" + " ".repeat(spacingWithOffset-7) + "= " + '"'+data.version+'"'];
        const module_end = ["}"];
        setModuleName(data.name);
        input_array.splice(0, 0, module[0]);
        input_array.splice(1, 0, source[0]);
        input_array.splice(2, 0, version[0]);
        input_array.splice(datas.length + 3, 0, module_end[0]);
        setInputArray(input_array);
        const variableslist = [];
        const variables = requiredInputs.map((d) => {
            if (d.description.includes("\n")) {
                d.description = ""
            }
            const variableName = "variable " + "\"" + name + "_" + d.name + "\" " + "{";
            const variableType = " ".repeat(5) + "type = " + d.type;
            const variableDescription = " ".repeat(5) + "description = " + "\"" + d.description + "\"";
            variableslist.push(variableName)
            variableslist.push(variableType)
            variableslist.push(variableDescription)
            variableslist.push("}")
        })

        let files = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/files`;
        let newValue = {
            "id": `/organizations/${organization_name}/projects/${project_name}`,
            "organization": organization_name,
            "project": `${project_name}`,
            "git": "bitbucket",
            "branch": changeReq === "default" ? "master" : changeReq.replace("pr-", "")
        }
        let res = await updateDetails(files, "", newValue)
        var variablesTfvars = "",
            variablesTf = "";
        let objToBePushed=[];
        console.log("res",res)

        if (res !== null && typeof res !== "undefined") {
            if (res.response_data === null){
                if(provider.title!=="aws"){
                    objToBePushed=[
                        {
                            name: "Jenkinsfile",
                            content: jenkinsFile[0],
                            type:"new"
                        },
                        {
                            name: "provider.tf",
                            content: providerFile[0],
                            type:"new"
                        },
                        {
                            name: "backend.tfvars",
                            content: backendFile[0],
                            type:"new"
                        }
                    ]
                }else{
                    objToBePushed=[
                        {
                            name: "Jenkinsfile",
                            content: jenkinsFile[0],
                            type:"new"
                        },
                        {
                            name: "provider.tf",
                            content: awsProviderFile[0],
                            type:"new"
                        },
                        {
                            name: "backend.tfvars",
                            content: awsBackendFile[0],
                            type:"new"
                        }
                    ]
                }
            }
            if (res.response_data !== null && typeof res.response_data !== "undefined" && Array.isArray(res.response_data) && res.response_data.length > 0) {
                // The find() method retuns undefined if no elements are found.
                let variablesTfvarsFile = res.response_data.find((value => value.name === `variables.${environment_name}.tfvars`));

                if (typeof variablesTfvarsFile !== "undefined") {
                    variablesTfvars = variablesTfvarsFile.content;
                }

                let variablesTfFile = res.response_data.find((value => value.name === `variables.tf`));

                if (typeof variablesTfFile !== "undefined") {
                    variablesTf = variablesTfFile.content;
                }

                let providerTf = res.response_data.find((value => value.name === `provider.tf`));
                if (typeof providerTf === "undefined" ) {
                    if (provider.title!=='aws'){
                        objToBePushed.push(
                            {
                                name: "provider.tf",
                                content: providerFile[0],
                                type:"new"
                            },
                        )
                    } else{
                        objToBePushed.push(
                            {
                                name: "provider.tf",
                                content: awsProviderFile[0],
                                type:"new"
                            },
                        )
                    }
                }

                let backendTfvars = res.response_data.find((value => value.name === `backend.${environment_name}.tfvars`));
                if (typeof backendTfvars === "undefined") {
                    if(provider.title==="aws"){
                        objToBePushed.push(
                            {
                                name: "backend.tfvars",
                                content: awsBackendFile[0],
                                type:"new"
                            },
                        )
                    }else{
                        objToBePushed.push(
                            {
                                name: "backend.tfvars",
                                content: backendFile[0],
                                type:"new"
                            },
                        )
                    }
                }

                let Jenkinsfile = res.response_data.find((value => value.name === `Jenkinsfile`));
                if (typeof Jenkinsfile === "undefined") {
                    objToBePushed.push(
                        {
                            name: "Jenkinsfile",
                            content: jenkinsFile[0],
                            type:"new"
                        }
                    )
                }
            }
        }
        // console.log("vartf",varsFileContents[3]?.concat("sd"))
        if (datas.length > 0) {
            // varsFileContents[3].concat("sd")
            let newValue = [
                {
                    name: `variables.tfvars`,
                    content: variablesTfvars + "\n" + varsFileContents.join("\n"),
                },
                {
                    name: name + ".tf",
                    content: input_array.join("\n"),
                    type:'new'
                },
                {
                    name: "variables.tf",
                    content: variablesTf + "\n" + variableslist.join("\n"),
                    type:'new'
                },
                ...objToBePushed
            ]
            console.log("newwwwwwwww",newValue,"\n","objto",objToBePushed)
            setFilesState(newValue)
        } else {
            setJsCode("Module Not Found")
        }
    }

    useEffect(() => {
        if (type === "Registry") {
            if (datas === "") {
                setJsCode("");
                setModuleName("Module Not Found");
            } else {

                getData(datas);
                setModuleName(name);
            }
        } else if (type === "Templates") {
            setFilesState(contents)
        }
    }, []);

    async function creatModule(filesState) {
        if (dataValue.includes(undefined) || dataValue.includes("")) {
            setDisabled(true);
            router.replace(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}`)
            onClickEditor(false)
            change()
            return
        }
        let i;
        const modulename = ['module "' + datas.name + '" {'];
        let terraform_source = "";
        for (i = datas.id.length; i > 0; i--) {
            if (datas.id[i] === "/") {
                terraform_source = datas.id.slice(0, i)
                break
            }
        }
        const source = [" ".repeat(5) + "source = " + "\"" + terraform_source + "\""];
        const version = [" ".repeat(5) + "version = " + "\"" + datas.version + "\""];
        const tfFileContents = [];
        const tfvars = [];
        const inputs = datas.root.inputs;
        const requiredInputs = inputs.filter((d) => d.required === true);
        const data = [];
        const variables = requiredInputs.map((d) => {
            const variableName = "variable " + "\"" + name + "_" + d.name + "\" " + "{";
            const variableType = " ".repeat(5) + "type = " + d.type;
            const variableDescription = " ".repeat(5) + "description = " + "\"" + d.description + "\"";
            data.push(variableName)
            data.push(variableType)
            data.push(variableDescription)
            data.push("}")
        })
        tfFileContents.splice(0, 0, modulename[0]);
        tfFileContents.splice(1, 0, source[0])
        tfFileContents.splice(2, 0, version[0])
        tfFileContents.splice(inputArray.length + 1, 0, "}");

        const filenamedata = filesState.map((e) => e.name)
        const filenamecontents = filesState.map((e) => e.content)

        if (changeReq === "default") {
            gitworkflow.files = filenamedata
            gitworkflow.file_contents = filenamecontents
            gitworkflow.source_branch = getBranchName(userData)
            gitworkflow.raised_by_id = userData.identity.id
            gitworkflow.branch_name = gitworkflow.source_branch

            const createCommit = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/workflow/startgitworkflow`;
            try {
                await createDetails(createCommit, "", "", "", gitworkflow);
            } catch (e) {
                if (e.response.status === 409) {
                    alert("another change request already exists, please close it first before doing other changes");
                }

                return
            }
        } else {
            const createCommit = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/workflow/update`;
            let body = {
                files: filesState.map(v => v.name),
                file_contents: filesState.map(v => v.content)
            }

            await createDetails(createCommit, "", "", "", body);
        }

        // const newValue = {
        //     id   : `/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/${gitInput.branch}/vars`,
        //     change_request : gitInput.branch,
        //     modules : mergedValue
        // }

        // try {
        //     await createDetails(createVars, "","","", newValue)
        // } catch (err) {
        //     errorTrigger("error", JSON.stringify(err.message));
        // }

        createOpen = false

        // if (isEnvSpecific) {
        //     var createModule = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/env`;
        //     try {
        //         let res = await createDetails(createModule, "","","", values)
        //         setState(true)
        //         onClickEditor(false)
        //         change()
        //     } catch (err) {
        //         errorTrigger("error", JSON.stringify(err.message));
        //     }
        //     change()
        //
        // } else {
        //     var createModule = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/`;
        //     try {
        //         createDetails(createModule, "","","", values)
        //             .then((res) => {
        //                 res;
        //                 setState(true)
        //                 onClickEditor(false)
        //                 change()
        //             })
        //             .catch((err) => {
        //                 errorTrigger("error", JSON.stringify(err.message));
        //             });
        //     } catch (err) {
        //         errorTrigger("error", JSON.stringify(err.message));
        //     }
        //     change()
        // }

        router.replace(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}`)
        onClickEditor(false)
        change()
    }

    const onClick = (newFiles) => {
        setOpen(true)
        creatModule(newFiles)
            .then(() =>
                setOpen(false)
            )
            .catch((err) => {
                console.log(err.message)
                setOpen(false)
            })
    };


    function deleteFile(){
        setInfo(true)

    }

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

    return (
        editor &&
        <div>
            <Grid>
                <EditorHelper
                    files={filesState}
                    onFileContentChange={(fileName, fileContent, markers, autoComplete, onValueChange) => {
                        return (
                            <div key={fileName}>
                                <EditorView
                                    key={fileName}
                                    editorFileName={fileName}
                                    editorValue={fileContent}
                                    editorExpanded={true}
                                    editorMarkers={markers}
                                    deleteFile={deleteFile}
                                    onFileSave={onFileSave}
                                    onValueChange={onValueChange}
                                    autoComplete={autoComplete}
                                />
                                <br/>
                            </div>
                        );
                    }}
                    saveButtonText={changeReq === "default" ? "Create Change Request" : "Update"}
                    onSave={(files) => {
                        let newFiles = _.cloneDeep(files);
                        let i = files.findIndex((v) => v.name === "variables.tfvars")
                        if (i!==-1){
                            newFiles[i].name = `variables.${environmentName}.tfvars`;
                        }
                        let j = files.findIndex((v) => v.name === "backend.tfvars")
                        if (j!==-1){
                            newFiles[j].name = `backend.${environmentName}.tfvars`
                        }
                        setFilesState(newFiles);
                        onClick(newFiles);
                    }}
                />
            </Grid>
            {info ?
                    <Stack sx={{ width: '30%',position: 'absolute', bottom:50,
                         }} spacing={2}>
                        <Alert onClose={() => {setInfo(false)}} severity="info">Can not delete while creating </Alert>
                    </Stack>
                :
                ""
            }
            <br/>
            <div align={"right"}>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={open}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </div>
        </div>
    );
}
;
