import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Button, ButtonBase, InputLabel, OutlinedInput, Select, TextField} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {Box, Divider, IconButton, Paper} from "@mui/material";
import Typography from "@material-ui/core/Typography";
import {hostport} from "../next.config";
import {createDetails, getDetails, updateDetails} from "../utils/fetch-util";
import {useRouter} from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import {Refresh} from "@material-ui/icons";
import {useTheme} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import {AuthContext} from "../lib/authContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}



export default function Share({cancel,rows,refresh}) {
    const {userData} = useContext(AuthContext)
    const theme = useTheme();
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environmentName = router.query.environment_name
    const moduleName = router.query.module_name;

    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);

    const [
        selected,
        setSelected
    ] = useState([]);

    const [
        selectedResource,
        setSelectedResource
    ] = useState([]);

    const [value, setValue] = useState("");

    const handleClose = useCallback(() => {
        cancel()
    })

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 200
        },
        {
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "organization_id",
            headerName: "Organization",
            width: 300
        },

    ];

    let randomstring = (Math.random() + 1).toString(36).substring(7);



    const [gitInput, setGitInput] = useState({
        id: "",
        organization: organizationName,
        project: "",
        git: "bitbucket",
        filename: "",
        message: "",
        branch: "",
        content: "to check the bitbucket",
        sha: "",
        change_request_id: "",
        title: "",
        head: "",
        base: "master",
        files: [],
        file_contents: []
    })


    const [
        moduleRows,
        setModuleRows
    ] = useState([]);

    const [
        resources,
        setResources
    ] = useState([])

    const [modules,setModules] = useState([])


    const [
        projectRows,
        setProjectRows
    ] = React.useState([]);

    function onSelectedListChange(newSelectedList) {
        setSelected(newSelectedList);
    }



    const onSelectionModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedListChange(projectRows.filter((row) => newSelectionModel.includes(row.id)));
    });

    function getBranchName(userData,projname) {

        let randomstring = (Math.random() + 1).toString(36).substring(7);

        if (userData !== undefined) {
            if (userData.identity.traits.first_name !== undefined) {
                return `${projname}${userData.identity.traits.first_name}-${randomstring}`
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

useEffect(() => {

    if(value){
        getProjects()
    }
},[value])

    const getProjects = () => {
        try {
            const GetProjects = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/${value}/unshared`;
            getDetails(GetProjects, "","","","")
                .then((res) => {
                    if (res.response_data) {
                            setProjectRows(res.response_data)
                    } else {
                        setProjectRows([]);
                    }
                })
                .catch((err) => {
                    console.log("Err",err.message)
                });
        } catch (err) {
            // errorTrigger("error", JSON.stringify(err.message));
        }
    };


    const getModulerows = useCallback(() => {

        try {
            const GetSharedProjects = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/getsharedmodules`;
            getDetails(GetSharedProjects, "","","","")
                .then((res) => {
                   if(res.response_data){
                       res.response_data.map((e,index) => {
                           if(res.response_data[index].resources !=null){
                               setModules(res.response_data)
                               if(!moduleRows.includes(e.name))
                                moduleRows.push(e.name)
                               }

                           })
                           }
                })
                .catch((err) => {
                    console.log("Err",err.message)
                });
        } catch (err) {
            // errorTrigger("error", JSON.stringify(err.message));
        }

    })


    useEffect(() => {
        getModulerows()
    }, [])

    const handlRefresh = useCallback(() => {
        getModulerows()
        refresh
    })

    const handleSetRes = useCallback((res) => {
        res.map((e,index) => {
            !resources.includes(res[index].type)&&
                resources.push(res[index].type)

        })
    })


    useEffect(() => {
        if(value === null){
            setResources([])
            setProjectRows([])

        }

    },[value])

    const handleChangee = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedResource(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onClickShare = useCallback(async () => {
        let success = []
        for (let i = 0; i < selected.length; i++) {
            let datablock = []
            const changeRequestTitle = selected[i].name + "-" + randomstring
            let newBranch = getBranchName(userData, selected[i].name);
            gitInput.branch = newBranch;
            gitInput.head = newBranch;
            gitInput.title = changeRequestTitle
            let files = []
            let filescontent = []
            let filter = modules.filter((e) => e.name === value)
            if(filter.length === 1) {
                let resources = filter[0].resources
                let datablockfilter = resources.filter((d) => d.data_block !== "")
                files = datablockfilter.map((e) => e.type + ".tf")
                filescontent = datablockfilter.map((e) => e.data_block)
            }
            gitInput.files = files;
            gitInput.file_contents = filescontent;
            gitInput.organization = organizationName
            gitInput.project = selected[i].name
            const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/commitandchangerequest`;
            await createDetails(createCommit, "", "", "", gitInput)
                .then((res) => {
                    let newval = {
                        id:selected[i].id
                    }
                    success.push(newval)

                })


        }
        const updatemoduleproj = hostport + `/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/${value}/projectDetails`;

        updateDetails(updatemoduleproj,"",success)
            .then((res) => {
                cancel()
            })
            .catch((e) => {
                console.log("error",e)
            })
    })

    return (
        <div>
            <div style={{display:'flex',flexDirection:'row'}}>
                <Typography variant={'h4'}>
                    Resource Sharing
                </Typography>
                <Box sx ={{flexGrow:1}}/>
                <IconButton onClick={handlRefresh} color={'info'}><Refresh/></IconButton>
            
            </div>

            <br/>
            <Divider/>
            <br/>
            <Typography variant={'subtitle1'}>
                Select the Module:
            </Typography>
            <br/>
            <Autocomplete
                sx={{ width: 300 }}
                options={moduleRows}
                autoHighlight
                onChange={(e, newValue) => {
                    setValue(newValue);
                    if(newValue!== null){
                        let res = modules.filter((e) => e.name === newValue)
                        handleSetRes(res[0].resources)
                    }

                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                        }}
                        size="small"
                    />
                )}
            />
            <br/>
            {
                value&&
                <div>
                            <Typography variant={"body1"}>
                                Resources :
                            </Typography>
                            <br/>
                            <ul>
                            {resources.map((value) => (
                                <li> <Chip key={value} label={value} /><br/><br/></li>


                            ))}
                            </ul>



                </div>
            }



           <br/>
            <br/>

            <Typography variant={'subtitle1'}>
                Destination:
            </Typography>
            <br/>
            <Paper style={{height:350, width: '100%'}}>
            <DataGrid
                checkboxSelection
                columns={columns}
                onSelectionModelChange={onSelectionModelChange}
                pageSize={5}
                rows={projectRows}
                rowsPerPageOptions={[5]}
                selectionModel={selectionModel}
                disableSelectionOnClick

            />
            </Paper>
            <br/>
            <br/>
            <Divider/>
            <br/>
            <div style={{display:'flex',flexDirection:'row-reverse'}}>

                <Button onClick={onClickShare} disabled={((value==="" || value === null )  || value&&selected.length === 0)?true:false}>share</Button>&nbsp;
                <Button onClick={handleClose} color={'error'}>cancel</Button>
            </div>


        </div>
    )
}
