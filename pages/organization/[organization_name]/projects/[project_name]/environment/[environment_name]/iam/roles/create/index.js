import {Button, Divider, TextField, Typography} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import * as React from "react";
import {useCallback, useContext, useEffect, useState} from "react";
import {SnackbarContext} from "../../../../../../../../../../lib/toaster/SnackbarContext";
import {useRouter} from "next/router";
import {hostport} from "../../../../../../../../../../next.config";
import {createDetails, getDetails} from "../../../../../../../../../../utils/fetch-util";
import {ErrorContext} from "../../../../../../../../../../lib/errorContext";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Can from "../../../../../../../../../../lib/Can";
import DataGridComponent from "../../../../../../../../../../components/DataGridComponent";



const actionColumn = [
    {
        field: "name",
        headerName: "Name",
        width: 250
    },
    {
        field: "description",
        headerName: "Description",
        width: 350
    }
];

export default function NewRole(){
    const { setSnackbar } = useContext(SnackbarContext);
    const {errorTrigger} = useContext(ErrorContext);
    const router = useRouter();
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName] = useState("");
    const [environmentName,setEnvironmentName] = useState("");

    const [
        roleName,
        setRoleName
    ] = useState("");
    const [
        description,
        setDescription
    ] = useState("");
    const [
        actionRows,
        setActionRows
    ] = useState([]);
    const [
        actionSelected,
        setActionSelected
    ] = useState([]);
    function handleActionSelect(selectedValue) {
        setActionSelected(selectedValue);
    }

    const [actions,setActions] = useState([]);
    const handleActionColumnChange = useCallback((newSelectionModel) => {
        onSelectedActionListChange(actionRows.filter((rows) => newSelectionModel.includes(rows.id)));
    });

    const handleChangeDescription = useCallback((event) => {
        setDescription(event.target.value);
    });

    const onChangeRoleName = useCallback((event) => {
        setRoleName(event.target.value);
    });
    function onSelectedActionListChange(newSelectedList) {
        setActionSelected(newSelectedList);
    }
    const [
        createRoleValue,
        setCreateRoleValue
    ] = useState({
        actions: [],
        description: "",
        id: "",
        level: "",
        name: "",
        organizationId: "",
    });

    const handleClose = () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/iam/roles`)
    }
    const getActions = () => {
        try {
            const GetActions = `${hostport}/api/v1/iam/roles/actions`;

            const GetActionValue = {
                level: "project"
            }

            getDetails(GetActions, "", "project", `organizations/${organizationName}/projects/${projectName}`, GetActionValue)
                .then((res) => {
                    if (res.response_data) {
                        for (let iter = 0; iter < res.response_data[0].length; iter++) {
                            res.response_data[0][iter].id = iter + 1;
                        }

                        const obj = res.response_data[0].Actions;

                        handleActions(obj);
                    } else {
                        setActionRows([]);
                    }
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };
    const handleActions = (obj) => {
        let val = "";
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
            }

            const rowData = {
                description: val.Description,
                id: "",
                name: val.Name
            };

            actions.push(rowData);
        }

        for (let iter = 0; iter < actions.length; iter++) {
            actions[iter].id = iter + 1;
        }

        setActionRows(actions);
    };
    const handleCloseCreate = () => {
        try {
            const createRole = `${hostport}/api/v1/iam/roles`;
            createDetails(createRole, "", "project", `organizations/${organizationName}/projects/${projectName}`, createRoleValue)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success");
                        handleClose();
                    }
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    useEffect(() => {
        if (roleName.length > 0 && description.length > 0 && actionRows.length > 0) {
            const newValue = {
                ...createRoleValue,
                name: roleName,
                actions: actionSelected,
                description,
                level: "project",
                id: "role::" + roleName,
                organization_id: `organizations/${organizationName}`,
                object: `organizations/${organizationName}/projects/:proj`
            };

            setCreateRoleValue(newValue);
        }
    }, [
        roleName,
        description,
        actionSelected,
        projectName,
        organizationName,
    ]);

    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name);
            setEnvironmentName(router.query.environment_name);
        }
    },[router])

    useEffect(() => {
        if (organizationName && projectName) {
            getActions();
        }
    }, [organizationName,projectName]);

    return(
        <div style={{width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <ManageAccountsIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Create Role
                    </Typography>
                </div>
                <div>
                    <Button onClick={handleClose} variant="outlined" style={{marginRight:"0.5rem"}} size={"small"}>Cancel</Button>
                    <Button onClick={handleCloseCreate} variant="contained" disabled={!(roleName.length > 0 && description.length > 0 && actionSelected.length > 0)} size={"small"}>
                        Create
                    </Button>
                </div>
            </div>
            <div style={{height:"65vh",width:"100%",overflow:"auto",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                    <div style={{width:"30%",paddingTop:"2rem"}}>
                        <div style={{paddingBottom:"1rem"}}>
                            <Typography variant={"h7"}>Role Name</Typography>
                            <TextField
                                defaultValue={roleName}
                                onChange={onChangeRoleName}
                                size="small"
                                sx={{width: 242,pt:"0.5rem"}}
                                placeholder={"Enter a Role Name"}
                            />
                        </div>
                        <div>
                            <Typography variant={"h7"}>Role Description</Typography>
                            <TextField
                                defaultValue={description}
                                onChange={handleChangeDescription}
                                size="small"
                                sx={{width: 242,pt:"0.5rem"}}
                                placeholder={"Enter Description for the Role"}
                            />
                        </div>
                    </div>
                    <div style={{width:"65%",height:"58vh",margin:"0 1.1rem 1.1rem 1.1rem"}}>
                        <div style={{display:"flex",justifyContent:"center",padding:"0.5rem 0"}}>
                            <Typography variant={"h7"}>Level of Action</Typography>
                        </div>
                        <DataGridComponent
                            columns={actionColumn}
                            pageSize={6}
                            rows={actionRows}
                            rowsPerPageOptions={[5]}
                            selectedValues={handleActionSelect}
                        />
                    </div>
                </div>
            </div>
            </div>
        // <div>
        //     <Typography variant="h4">Create Role</Typography>
        //     <br/>
        //     <Typography variant="h6">Name the role</Typography>
        //     <br/>
        //     <Divider/>
        //     <br/>
        //     <Typography variant="inherit">Role Name</Typography>
        //     <br/>
        //     <Typography variant="caption">
        //         Enter a role name to assign it to users.
        //     </Typography>
        //     <br/>
        //     <br/>
        //     <br/>
        //     <Divider/>
        //     <br/>
        //     <Typography variant="h6">Add Role Description</Typography>
        //     <br/>
        //     <Typography variant="caption">
        //         Enter a description for this role.
        //     </Typography>
        //     <br/>
        //     <TextField
        //         defaultValue={description}
        //         onChange={handleChangeDescription}
        //         size="small"
        //         sx={{width: 300}}
        //     />
        //     <br/>
        //     <br/>
        //     <Divider/>
        //     <br/>
        //     <Typography variant="h6">Level of Action</Typography>
        //     <br/>
        //     <div style={{
        //         height: 400,
        //         width: "100%"
        //     }}
        //     >
        // </div>
    )
}

