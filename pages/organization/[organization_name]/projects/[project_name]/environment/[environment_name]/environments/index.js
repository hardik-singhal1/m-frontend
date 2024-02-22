import {Button, Divider, TextField, Typography} from "@material-ui/core";
import {ErrorContext} from "../../../../../../../../lib/errorContext";
import {createDetails, getDetails, updateDetails} from "../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../next.config";
import {useRouter} from "next/router";
import ProjectLayout from "../../../../../../../../components/project/ProjectLayout";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Autocomplete from '@mui/material/Autocomplete';
import {AuthContext} from "../../../../../../../../lib/authContext";


export default function Environment() {
    const router = useRouter();
    const [
        createOpen,
        setCreateOpen
    ] = React.useState(true);
    const [
        environmentName,
        setEnvironmentName
    ] = React.useState("");
    const {userData} = useContext(AuthContext)
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environment = router.query.environment_name;
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const envName = environmentName
    const [options, setOptions] = useState([])
    const {errorTrigger} = useContext(ErrorContext);
    const [values, setValues] = React.useState(options[0]);
    const [envRequestArr, setEnvRequestArr] = useState([])
    const [inputValue, setInputValue] = React.useState('');
    const [value] = useState({
        configurations: {
            outputs: [],
            variables: []
        },
        id: "",
        modules: [],
        name: envName
    });

    const [vars, setVars] = useState({
        id : "",
        change_request : "",
        modules : [{
            name:"",
            vars:""
        }]
    })

    const [
        environments,
        setEnvironments
    ] = React.useState([]);

    const [
        currentEnvironment,
        setCurrentEnvironment
    ] = React.useState("");

    const [
        fileState,
        setFileState
    ] = useState([])
    const [
        fileContents,
        setFileContents
    ] = useState([]);
    const [
        moduleRows,
        setModuleRows
    ] = useState([]);

    const handleClose = useCallback(() => {
        const {environment_name} = router.query
        router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${environment_name}`);
        setCreateOpen(true);
    });

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    function getEnvVars()
    {
        if(organizationName !== undefined && projectName !== undefined && environment !== undefined) {
            let newBranch = "master"
            const gettfVarsContents = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${inputValue}/${newBranch}/clone/vars`;

            getDetails(gettfVarsContents, "", "", "", "")
                .then(async (res) => {
                    if(res){
                        setVars(res.response_data[0])
                    }

                })
                .catch((err) => {
                    console.log("Change Request List error", err.message)
                });
        }
    }

    useEffect(() => {
        value.name = envName;
    }, [
        environmentName,
        createOpen
    ]);

    useEffect(() => {
        vars.id = `organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/master/vars`
    },[environmentName])

    function getEnvironments() {
        let env = ["DEV","UAT","PRD"]

        try {
            const getEnvironmentsroute = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/`;

            getDetails(getEnvironmentsroute, "","","","")
                .then((res) => {
                    if (res.response_data) {
                        for (let iter = 0; iter < res.response_data[0].length; iter++) {
                            res.response_data[iter].id = iter + 1;
                        }
                    } else {
                        res.response_data = []
                    }
                    let resp = res.response_data.filter((event) => event.id.includes(`organizations/${organizationName}/projects/${projectName}/`));

                    if (resp) {
                        resp = resp.map((event) => event.name);
                        setEnvironments(resp)
                        let available_environments = []
                        for(let i=0;i<env.length;i++){
                            if(!resp.includes(env[i])) {
                                if(!available_environments.includes(env[i])){
                                    available_environments.push(env[i])
                                }
                            }
                        }
                        setEnvRequestArr(available_environments)
                        if (currentEnvironment !== undefined) {
                            setCurrentEnvironment(resp[0])
                        }

                    } else {
                        setEnvironments([])
                        setEnvRequestArr(env)
                    }
                })
                .catch((err) => {
                    console.log("Err",err.message)
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    useEffect(() =>{
        getEnvironments()
        getFiles()
    },[router.isReady])

    useEffect(() => {
        setOptions(environments)
    },[environments])

    const getFiles = useCallback(() => {
        if (organizationName !== undefined && projectName !== undefined) {
            let GetModules = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/files`;

            let newValue = {
                "id": `/organizations/${organizationName}/projects/${projectName}`,
                "organization": organizationName,
                "project": `${projectName}`,
                "git": "bitbucket",
                "branch": "master"
            }
            let res = updateDetails(GetModules, "", newValue)
                .then((res) => {
                    if (res.response_data && Array.isArray(res.response_data) && res.response_data.length > 0) {
                        setFileContents(res.response_data);
                    } else {
                        setFileContents([]);
                    }
                })
        }
    })

    function getBranchName(userData) {

        let randomstring = (Math.random() + 1).toString(36).substring(7);

        if (userData !== undefined) {
            if (userData.identity.traits.first_name !== undefined) {
                return `${projectName}${userData.identity.traits.first_name}-${randomstring}`
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    const handleCloseCreate = useCallback(async () => {
        let variablesFile = fileContents.filter((e) => e.name === `variables.${inputValue}.tfvars`)

        let branchName = getBranchName(userData)

        if(variablesFile.length > 0) {
            let tfvarsFile = variablesFile[0].content.split("\n")
            let filter_variables = tfvarsFile.filter((e) => e.includes("="))
            let tfvars = filter_variables.map((e) => e.split("=")[0]+"=")
            let filesEnv = fileContents.map((e) => e.name)
            let contentsEnv = fileContents.map((e) => e.content)
            filesEnv.push(`variables.${value.name}.tfvars`)
            contentsEnv.push(tfvars.join("\n"))
            filesEnv.push(`backend.${value.name}.tfvars`)
            contentsEnv.push(`    bucket = "${bucketName}"
    prefix = "organizations/${organizationName}/projects/${projectName}/environment/${value.name}"
`)
            let gitworkflow = {
                project_id: `organizations/${organizationName}/projects/${projectName}`,
                bitbucket_project: projectName,
                bitbucket_org: organizationName,
                raised_by_id: userData.identity.id,
                source_branch: "master",
                branch_name: branchName,
                pr_name: branchName + "-pr",
                files: filesEnv,
                file_contents: contentsEnv,
            }


            const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${envName}/modules/workflow/startgitworkflow`;
            try {
                await createDetails(createCommit, "","","", gitworkflow)
                    .then(async (res) => {
                        try {
                            const createEnv = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/`;
                            value.id = `/organizations/${organizationName}/projects/${projectName}/environment/${value.name}/`;
                            await createDetails(createEnv, "", "", "", value)
                                .then((res) => console.log("Env created Successfully"))
                                .catch((err) => console.log("Error creating ENV", err.message))
                        } catch (err) {
                            errorTrigger("error", JSON.stringify(err.message));
                        }
                    })
                    .catch((err) => console.log(err))
            } catch (e) {
                if (e.response.status === 409) {
                    alert("another change request already exists, please close it first before doing other changes");
                }

                return
            }

            router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${envName}/`);
            setCreateOpen(true);
        }else {
            const createEnv = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/`;
            value.id = `/organizations/${organizationName}/projects/${projectName}/environment/${value.name}/`;
            await createDetails(createEnv, "", "", "", value)
                .then((res) => console.log("Env created Successfully"))
                .catch((err) => console.log("Error creating ENV", err.message))
        }
    });

    const onChangeEventName = useCallback((event) => {
        setEnvironmentName(event.target.value);
    });

    return (
        <div>
            <div style={{
                height: 400,
                width: "100%"
            }}
            >
                <div>
                    <Typography variant="h4">
                        Create Environment
                    </Typography>
                    <br/>
                    <Typography variant="h6">
                        Name the Environment
                    </Typography>
                    <br/>
                    <Divider/>
                    <br/>
                    <Typography variant="inherit">
                        Environment Name
                    </Typography>
                    <br/>
                    <Typography variant="caption">
                        select the Environment that needs to be created
                    </Typography>
                    <br/>
                    <div>
                        <Autocomplete
                            value={values}
                            onChange={(event, newValue) => {
                                setValues(newValue);
                            }}
                            inputValue={environmentName}
                            onInputChange={(event, newInputValue) => {
                                setEnvironmentName(newInputValue);
                            }}
                            id="controllable-states-demo"
                            options={envRequestArr}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} size={"small"}/>}
                        />
                    </div>
                    <br/>
                    <Divider/>
                    <br/>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={checked}
                                color="secondary"
                                name="checkedB"
                                onChange={handleChange}
                            />
                        }
                        label="Clone from existing Environment"
                        sx={{ color: "#000000" }}
                    />
                    <br/>
                    {
                        checked &&
                        <div>
                            <br/>
                            <Autocomplete
                                value={values}
                                onChange={(event, newValue) => {
                                    setValues(newValue);
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={options}
                                sx={{width: 300}}
                                renderInput={(params) => <TextField {...params} label="Environment" size={"small"}/>}
                            />
                        </div>
                    }
                    <br/>
                    <Divider/>
                    <br/>
                    <div align="right">
                        <Button
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <span> </span>
                        {
                            environmentName === ""
                                ? <Button
                                    disabled
                                    variant="contained"
                                >
                                    Create
                                </Button>
                                : <Button
                                    onClick={handleCloseCreate}
                                    variant="contained"
                                >
                                    Create
                                </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
