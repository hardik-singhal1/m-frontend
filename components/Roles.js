import * as React from "react";
import { AuthContext } from "../lib/authContext";
import { Button, Dialog, DialogContentText, DialogTitle, Divider, Grid, TextField, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { ErrorContext } from "../lib/errorContext";
import {createDetails, deleteDetails, getDetails} from "../utils/fetch-util";
import { hostport } from "../next.config";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { withStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import Can from "../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import RefreshIcon from "@mui/icons-material/Refresh";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DataGridComponent from "./DataGridComponent";
import Link from "@material-ui/core/Link";
export default function Roles() {
    const { setSnackbar } = useContext(SnackbarContext);
    const actions = [];
    const [
        roles,
        setRoles
    ] = useState([]);
    const [
        customRoles,
        setCustomRoles
    ] = useState([]);
    const router = useRouter();
    const {organization_name: organizationName} = router.query;
    const { errorTrigger } = useContext(ErrorContext);
    const [
        createOpen,
        setCreateOpen
    ] = useState(true);
    const [
        open,
        setOpen
    ] = useState(false);
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
    const [
        roleSelected,
        setRoleSelected
    ] = useState([]);
    const [selectionModel] = useState([]);
    const { userData } = useContext(AuthContext);

    const handleOpen = useCallback(() => {
        setCreateOpen(false);
    });

    const handleClickDialogOpen = useCallback(() => {
        setOpen(true);
    });

    const handleClose = useCallback(() => {
        setCreateOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setOpen(false);
    }, []);

    const [
        createRoleValue,
        setCreateRoleValue
    ] = useState({
        actions: [],
        description: "",
        id:"",
        level: "",
        name: "",
        object:"",
        organization_id: ""
    });

    let headerObject = "";

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`
        }
    });

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])


    function onSelectedActionListChange(newSelectedList) {
        setActionSelected(newSelectedList);
    }

    function handleRoleSelect(selectedValue) {
        setRoleSelected(selectedValue);
    }
    function handleActionSelect(selectedValue) {
        setActionSelected(selectedValue);
    }
    function onSelectedRoleListChange(newSelectedList) {
        setRoleSelected(newSelectedList);
    }

    const onSelectedRoleColumn = useCallback((newSelectionModel) => {
        onSelectedRoleListChange(combinedRoles.filter((event) => newSelectionModel.includes(event.id)));
    });

    const onChangeRoleName = useCallback((event) => {
        setRoleName(event.target.value);
    });

    const onChangeDescription = useCallback((event) => {
        setDescription(event.target.value);
    })

    const handleActions = (obj) => {
        for (const key in obj) {
            let val = "";
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

    const onSelectedUserColumn = useCallback((newSelectionModel) => {
        onSelectedActionListChange(actionRows.filter((event) => newSelectionModel.includes(event.id)));
    });

    useEffect(() => {
        if (roleName.length > 0 && description.length > 0 && actionRows !== null) {

            const newValue = {
                ...createRoleValue,
                actions: actionSelected,
                description,
                id:"role::"+roleName,
                level:"organization",
                name: roleName,
                object: `organizations/${organizationName}`,
                organization_id: `organizations/${organizationName}`
            };

            setCreateRoleValue(newValue);
        }
    }, [
        roleName,
        description,
        actionSelected,
        actionRows,
        organizationName,
        router
    ]);

    const handleCloseCreate = useCallback(() => {
        try {
            const createRole = `${hostport}/api/v1/iam/roles`;

            createDetails(createRole, "","organization",headerObject, createRoleValue)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success")
                        getCustomRoles();
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }

        setCreateOpen(true);
    });

    const DialogContent = withStyles(() => ({
        root: {
            height: 200,
            width: 600
        }
    }))(MuiDialogContent);
    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1)
        }
    }))(MuiDialogActions);

    const getActions = () => {
        try {
            const GetActions = `${hostport}/api/v1/iam/roles/actions`;

            const GetActionValue = {
                level:"organization",
            }

            getDetails(GetActions, "","organization",headerObject,GetActionValue)
                .then((res) => {
                    res = res.response_data;
                    if (res) {
                        for (let iter = 0; iter < res[0].length; iter++) {
                            res[0][iter].id = iter + 1;
                        }

                        const obj = res[0].Actions;

                        handleActions(obj);
                    } else {
                        setActionRows([]);
                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    const roleColumn = [
        {
            field: "id",
            headerName: "Name",
            renderCell: (params) => {
                return (
                    <Link
                        onClick={()=>router.push(`/organization/${organizationName}/iam/roles/${params.value}/addusers`)}
                        style={{
                            textDecoration:"none",
                            cursor:"pointer",
                            color:"blue"
                        }}
                    >
                        {params.value}
                    </Link>
                )
            },
            width: 250
        },
        {
            field: "description",
            headerName: "Description",
            width: 700

        }
    ];
    const actionColumn = [
        {
            field: "name",
            // headerAlign: "center",
            headerName: "Name",
            width: 250

        },
        {
            field: "description",
            // headerAlign: "center",
            headerName: "Description",
            width: 350

        }
    ];

    let deleteRoleValue = ""

    useEffect(() => {
        if (roleSelected !== [] && roleSelected[0] !== undefined) {
            deleteRoleValue = {
                "role_id": "role::" + roleSelected[0].name
            }
        }
    })

    const handleDelete = () => {

        const deleteRole = `${hostport}/api/v1/iam/roles`

        deleteDetails(deleteRole, "", "organization",headerObject,deleteRoleValue)
            .then((res) => {
                if(!res?.is_error) {
                    setSnackbar("Role deleted successfully","success")
                    setRoleSelected([]);
                    getRoles();
                    getCustomRoles();
                }
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
        setOpen(false);
    };

    let combinedRoles = [];

    const getCustomRoles = () => {
        try {
            const GetCustomRoles = `${hostport }/api/v1/iam/roles/list`;

            const getRolesValue = {
                kind : "custom",
                level : "organization"
            }

            getDetails(GetCustomRoles, "","organization",headerObject,getRolesValue)
                .then((res) => {
                    for (let iter = 0; iter < res.response_data?.length; iter++) {
                        res.response_data[iter].id = res.response_data[iter].id.slice(6,);
                    }
                    setCustomRoles(res.response_data);
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };
    combinedRoles.push(...roles)

    const getRoles = () => {
        try {
            const GetRoles = `${hostport }/api/v1/iam/roles/list`;

            const getRolesValue = {
                kind : "pre",
                level : "organization"
            }

            getDetails(GetRoles, "","organization",headerObject,getRolesValue)
                .then((res) => {
                    for (let iter = 0; iter < res.response_data.length; iter++) {
                        res.response_data[iter].id = res.response_data[iter].id.slice(6,);
                    }
                    setRoles(res.response_data);
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    if(customRoles?.length>0) combinedRoles.push(...customRoles)
    const refresh = useCallback(() => {
            getRoles();
            getCustomRoles();
    });

    useEffect(() => {
        if(router.isReady){
            getRoles();
            getActions();
            getCustomRoles();
        }
    },[router]);

    const yes = useCallback(() => (<div align="right">
        <Button
            align="center"
            onClick={refresh}
            startIcon={<RefreshIcon align="center" />}
            sx={{ color: "#808080" }}
            size={"small"}
        />
        <Button
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{marginRight:"0.5rem"}}
            variant={"contained"}
            size={"small"}
        >
            Create Role
        </Button>
        {
            roleSelected.length === 0
                  ? <Button
                          color="error"
                          disabled
                          startIcon={<DeleteIcon />}
                          variant={"contained"}
                          size={"small"}
                    >
                      Delete
                  </Button>
                  :
            <Button
                color="error"
                onClick={handleClickDialogOpen}
                startIcon={<DeleteIcon />}
                variant={"contained"}
                size={"small"}
            >
                Delete
            </Button>
        }
    </div>));

    const no = useCallback(() => (
        <div align="right">
            <Button
                align="center"
                onClick={refresh}
                startIcon={<RefreshIcon align="center" />}
                sx={{ color: "#808080" }}
                size={"small"}
            />
        </div>
    ));

    return (
        <div>
            {createOpen
                ? (
                    <Grid>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5rem"}}>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <ManageAccountsIcon style={{color:"navy"}}/>
                                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                    Roles
                                </Typography>
                            </div>
                            {userInfo &&
                                <Can
                                    no={no}
                                    perform="write_role"
                                    role={userInfo.identity.id}
                                    yes={yes}
                                />
                            }
                        </div>
                        <div style={{
                            height: "65vh",
                            width: "100%"
                        }}
                        >
                            <DataGridComponent
                                columns={roleColumn}
                                selectedValues={handleRoleSelect}
                                pageSize={7}
                                rows={combinedRoles}
                                rowsPerPageOptions={[5]}
                            />
                        </div>
                        <div>
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogClose}
                                open={open}
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Do you wish to continue?
                                    <br/>
                                    <Divider/>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <b>Role(s) once deleted cannot be retrieved.</b>
                                        <br/>
                                        <br/>
                                        Are you sure you want to delete this role?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={handleDialogClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        autoFocus
                                        color="error"
                                        onClick={handleDelete}
                                        variant="contained"
                                    >
                                        Yes, Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </Grid>
                )
                : (
                    <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5rem"}}>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <ManageAccountsIcon style={{color:"navy"}}/>
                                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                    Create Role
                                </Typography>
                            </div>
                            <div>
                                <Button onClick={handleClose} variant={"outlined"} size={"small"} style={{marginRight:"0.5rem"}}>Cancel</Button>
                                {
                                    (roleName.length > 0 && description.length > 0 && actionRows !== null && actionSelected.length > 0) ?
                                        <Button onClick={handleCloseCreate} variant="contained" size={"small"}>
                                            Create
                                        </Button> : <Button disabled variant="contained" size={"small"}>
                                            Create
                                        </Button>
                                }
                            </div>
                        </div>
                        <div style={{height:"65vh",width:"100%",overflow:"auto",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                            <div style={{display:"flex",flexWrap:"wrap"}}>
                                <div style={{width:"30%",paddingTop:"2rem"}}>
                                    <div style={{paddingBottom:"1rem"}}>
                                        <Typography variant={"h7"}>Role Name</Typography>
                                        <div>
                                            <TextField
                                                defaultValue={roleName}
                                                onChange={onChangeRoleName}
                                                size="small"
                                                sx={{width: 242,pt:"0.5rem"}}
                                                placeholder={"Enter a Role Name"}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant={"h7"}>Role Description</Typography>
                                        <div>
                                            <TextField
                                                defaultValue={description}
                                                onChange={onChangeDescription}
                                                size="small"
                                                sx={{width: 242,pt:"0.5rem"}}
                                                placeholder={"Enter Description for the Role"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{width:"65%",height:"58vh",margin:"0 1.1rem 1.1rem 1.1rem"}}>
                                    <div style={{display:"flex",justifyContent:"center",padding:"0.5rem 0"}}>
                                        <Typography variant={"h7"}>Level of Action</Typography>
                                    </div>
                                    <DataGridComponent
                                        columns={actionColumn}
                                        selectedValues={handleActionSelect}
                                        pageSize={5}
                                        rows={actionRows}
                                        rowsPerPageOptions={[5]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
