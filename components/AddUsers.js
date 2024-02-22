import * as React from "react";
import {AuthContext} from "../lib/authContext";
import {
    alpha, Autocomplete,
    Button,
    ButtonBase,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider, FormControl,
    Grid, InputLabel, TextField,
    Typography
} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../lib/errorContext";
import {createDetails, deleteDetails, getDetails} from "../utils/fetch-util";
import {hostport, hostport1} from "../next.config";
import {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import AddIcon from "@material-ui/icons/Add";
import Box from '@mui/material/Box';
import Can from "../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import propTypes from "prop-types";
import Link from "next/link";
import {withStyles} from "@material-ui/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/styles/makeStyles";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";
import DataGridComponent from "./DataGridComponent";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 33),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));


export default function AddUsers({level}) {
    const { setSnackbar } = useContext(SnackbarContext);
    const classes = useStyles()
    const render = useCallback((params) => params.value === "active"
        ? <Button sx={{color: "green"}}>{`${params.value}`}</Button>
        : <Button sx={{color: "red"}}>{`${params.value}`}</Button>);

    const DialogContent = withStyles(() => ({
        root: {
            height: 100,
            width: 600
        }
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1)
        }
    }))(MuiDialogActions);

    const [
        userSelectionModel,
        setUserSelectionModel
    ] = useState([]);

    const groupColumn = [
        {
            field: "name",
            headerName: "Group Name",
            renderCell: (params) => (
                <Link
                    href={`/organization/${organizationName}/iam/groups/${params.value}`}
                >
                    <ButtonBase
                        sx={{color: "blue"}}
                    >{`${params.value}`}
                    </ButtonBase>
                </Link>
            ),
            width: 200
        },
        {
            field: "users",
            headerName: "Users",
            width: 150
        },
        {
            field: "organization_id",
            headerName: "Organization Id",
            width: 200
        },
        {
            field: "email",
            headerName: "Email",
            width: 250
        },
        {
            field: "principal_name",
            headerName: "Principle Name",
            width: 250
        }
    ];

    const inheritedColumns = [
        {
            editable: true,
            field: "name",
            headerName: "Name",
            width: 200,
        },
        {
            editable: true,
            field: "type",
            headerName: "Type",
            width: 200,
        },
        {
            editable: true,
            field: "from",
            headerName: "From",
            width: 200,
        },
        {
            field: "email",
            headerName: "Email",
            width: 250
        },
        {
            field: "principal_name",
            headerName: "Principle Name",
            width: 250
        }
    ];

    const assignmentsColumns = [
        {
            editable: true,
            field: "name",
            headerName: "Name",
            width: 200,
            renderCell: (params) => {
                if (params.row.type === "Group") {
                    return (
                        <Link
                            href={`/organization/${organizationName}/iam/groups/${params.value}`}
                        >
                            <ButtonBase
                                sx={{color: "blue"}}
                            >{`${params.value}`}
                            </ButtonBase>
                        </Link>
                    )
                }
            },
        },
        {
            editable: true,
            field: "type",
            headerName: "Type",
            width: 150
        },
        {
            field: "email",
            headerName: "Email",
            width: 250
        },
        {
            field: "principal_name",
            headerName: "Principle Name",
            width: 250
        }
    ];

    const [
        userIdentity,
        setUserIdentity
    ] = useState([]);

    const [tempUserIdentity,setTempUserIdentity]=useState([]);
    const [roleAssignments, setRoleAssignments] = useState([]);
    const [tempRoleAssignments,setTempRoleAssignments]=useState([]);
    // const [selectedRoleAssignment,setSelectedRoleAssignment]=useState("Direct");
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environmentName = router.query.environment_name;
    const {role} = router.query;
    const [
        userSelected,
        setUserSelected
    ] = useState([]);
    const [
        roleAssignmentsSelected,
        setRoleAssignmentsSelected,
    ] = useState([]);
    const [
        groupSelected,
        setGroupSelected
    ] = useState([]);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext);
    const [roleUserSelectionModel, setRoleUserSelectionModel] = useState([]);
    const [groupRows, setGroupRows] = useState([]);
    const [inheritedRows, setInheritedRows] = useState([]);
    const [addUsersOpen, setAddUsersOpen] = useState(false);
    const [removeUsersOpen, setRemoveUsersOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(userData)
    const [selectedRoleAssignment, setSelectedRoleAssignment] = useState('Direct');

    const handleChange = (event, newAlignment) => {
        setSelectedRoleAssignment(event.target.value);
    };
    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    const [assignRoleValue, setAssignRoleValue] = useState({
        level: "",
        object: "",
        role: "",
        subject: [],
    });

    const handleAssignDialogOpen = useCallback(() => {
        setAddUsersOpen(true)
    }, []);

    const handleRemoveDialogOpen = useCallback(() => {
        setRemoveUsersOpen(true)
    }, []);

    let headerObject = "";
    let getIdentityObjId = "";

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`
            getIdentityObjId = `organizations/${organizationName}`
            if (level === "project") {
                headerObject = `organizations/${organizationName}/projects/${projectName}`
            }
        }
    })

    const getIdentity = () => {
        try {
            const GetUsers = `${hostport}/api/v1/iam/identities`;

            getDetails(GetUsers, "", "organization", getIdentityObjId, "")
                .then((res) => {
                    res = res.response_data;
                    res.forEach((value, index) => {
                        res[index].id = "identity::" + value.id
                    })
                    setUserIdentity(res);
                    setTempUserIdentity(res);
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };
    let GetRoleUsersValue = ""

    const [assignRoleSearch,setAssignRoleSearch]=useState("");
    const [ removeRoleSearch,setRemoveRoleSearch] = useState("");
    useEffect(() => {
        setRoleAssignments(tempRoleAssignments)
        let filter = tempRoleAssignments.filter((e) => (e.name.toLowerCase().includes(removeRoleSearch.toLowerCase()) || e.name.toUpperCase().includes(removeRoleSearch.toUpperCase())))
        setRoleAssignments(filter)
    }, [removeRoleSearch])

    useEffect(() => {
        setUserIdentity(tempUserIdentity)
        let filter = tempUserIdentity.filter((e) => (e.name.toLowerCase().includes(assignRoleSearch.toLowerCase()) || e.name.toUpperCase().includes(assignRoleSearch.toUpperCase())))
        setUserIdentity(filter)
    }, [assignRoleSearch])

    useEffect(() => {
        GetRoleUsersValue = {
            role: {
                id: "role::" + role
            },
            object: "",
            level: level
        }
        GetRoleUsersValue.object = `organizations/${organizationName}`
        if (level === "project") {
            GetRoleUsersValue.object = `organizations/${organizationName}/projects/${projectName}`
        }
    }, [projectName, organizationName, level, role])


    const getRoleUsers = () => {
        try {
            const GetRoleUsers = `${hostport}/api/v1/iam/roles/users`;

            getDetails(GetRoleUsers, "", level, headerObject, GetRoleUsersValue)
                .then((res) => {
                    // filtering the role and its identities based on "role_name" because if a role inherits another role
                    // then multiple identities would be fetched for a single role
                    let roleAssignments = res?.response_data?.filter((element) => element?.Role?.id === "role::" + role)
                    let newRoleAssignments = [];
                    // eg: "organization_owner" inherits "project_owner" role such that in the response body the "users" of both
                    // the roles would be fetched while trying to list "project_owner" users

                    roleAssignments?.forEach(role => {
                        role?.Identities?.forEach(id => {
                            let newAssignmentRow = {
                                id: `identity::${id.id}`,
                                name: id.name,
                                email: id.email,
                                principal_name: id.principal_name,
                                type: "User",
                            };

                            newRoleAssignments.push(newAssignmentRow);
                        });

                        role?.Groups?.forEach(group => {
                            let newAssignmentRow = {
                                id: `group::${group.id}`,
                                name: group.name,
                                email: "NA",
                                principal_name: "NA",
                                type: "Group",
                            };

                            newRoleAssignments.push(newAssignmentRow);
                        });
                    });
                    setRoleAssignments(newRoleAssignments);
                    setTempRoleAssignments(newRoleAssignments);

                    // inherited principals filter
                    let inheritedPrincipals = res?.response_data.filter(v => v?.Role?.id !== "role::" + role);
                    let newInheritedRows = [];

                    inheritedPrincipals?.forEach(role => {
                        role?.Identities?.forEach(id => {
                            let newInheritedRow = {
                                id: `identity::${id.id}`,
                                name: id.name,
                                email: id.email,
                                principal_name: id.principal_name,
                                type: "User",
                                from: role?.Role?.name,
                            };

                            newInheritedRows.push(newInheritedRow);
                        });

                        role?.Groups?.forEach(group => {
                            let newInheritedRow = {
                                id: `group::${group.id}`,
                                name: group.name,
                                email: "NA",
                                principal_name: "NA",
                                type: "Group",
                                from: role?.Role?.name,
                            };

                            newInheritedRows.push(newInheritedRow);
                        });
                    });

                    setInheritedRows(newInheritedRows);
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    const onClickRefresh = useCallback(() => {
        if (router.isReady) {
            getIdentity();
            getRoleUsers();
            getGroupRows();
        }
    }, []);

    const onChangeUserColumn = useCallback((newSelectionModel) => {
        setUserSelectionModel(newSelectionModel);
        onSelectedUserListChange(userIdentity.filter((event) => newSelectionModel.includes(event.id)));
    });

    const onSelectedUserListChange = useCallback((newSelectedList) => {
        setUserSelected(newSelectedList);
    }, []);

    const onChangeRoleUserColumn = useCallback((newSelectionModel) => {
        setRoleUserSelectionModel(newSelectionModel)
        onSelectedRoleUserListChange(roleAssignments.filter((event) => newSelectionModel.includes(event.id)));
    });

    const onSelectedRoleUserListChange = useCallback((newSelectedList) => {
        setRoleAssignmentsSelected(newSelectedList);
    }, []);

    const onSelectedGroupListChange = useCallback((newSelectedList) => {
        setGroupSelected(newSelectedList);
    }, []);

    const onSelectionGroupModelChange = useCallback((newSelectionModel) => {
        onSelectedGroupListChange(groupRows.filter((group) => newSelectionModel.includes(group.id)));
    });

    const handleDialogClose = useCallback(() => {
        setAddUsersOpen(false);
        setRemoveUsersOpen(false);
    });

    useEffect(() => {
        let newAssignRoleValue = {...assignRoleValue};

        if (level === "organization") {
            newAssignRoleValue.level = "organization";
            newAssignRoleValue.object = `organizations/${organizationName}`
        } else {
            newAssignRoleValue.level = "project";
            newAssignRoleValue.object = `organizations/${organizationName}/projects/${projectName}`
        }
        newAssignRoleValue.role = "role::" + role;

        setAssignRoleValue(newAssignRoleValue);
    }, [organizationName, role, level]);

    useEffect(() => {
        let newAssignRoleValue = {...assignRoleValue};
        let users = userSelected.map(i => i.id);
        let groups = groupSelected.map(g => `group::organizations/${organizationName}/groups/${g.name}`);

        if (level === "organization") {
            newAssignRoleValue.level = "organization";
            newAssignRoleValue.object = `organizations/${organizationName}`
        } else {
            newAssignRoleValue.level = "project";
            newAssignRoleValue.object = `organizations/${organizationName}/projects/${projectName}`
        }

        newAssignRoleValue.role = "role::" + role;
        newAssignRoleValue.subject = [...users, ...groups];

        setAssignRoleValue(newAssignRoleValue);
    }, [userSelected, groupSelected]);

    function handleGroupSelected(selectedValue) {
        setGroupSelected(selectedValue);
    }

    function handleUserSelected(selectedValue) {
        setUserSelected(selectedValue);
    }

    function handleRemoveAssignment(selectedValue) {
        setRoleAssignmentsSelected(selectedValue)
    }

    const onClickAssignRole = useCallback(() => {
        try {
            const assignRole = `${hostport}/api/v1/iam/roles/assign`;
            createDetails(assignRole, "", level, headerObject, assignRoleValue)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success")
                        onClickRefresh();
                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
        setAddUsersOpen(false)
        setUserSelected([])
    });

    const getGroupRows = () => {
        try {
            const GetGroups = `${hostport}/api/v1/iam/groups`;
            const getGroupValue = {
                organization_id: `organizations/${organizationName}`
            }

            getDetails(GetGroups, "", "organization", getGroupValue.organization_id, getGroupValue)
                .then((res) => {
                    res = res.response_data;
                    if (res) {
                        for (let index = 0; index < res.length; index++) {
                            res[index].users = res[index].users.length;
                            res[index].organization_id = res[index].object;
                        }

                        setGroupRows(res);
                    } else {
                        setGroupRows([]);
                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    useEffect(() => {
        if (router.isReady) {
            getGroupRows()
            getRoleUsers()
            getIdentity()
        }
    }, [router])

    const onClickBack = useCallback(() => {
        if (level === "organization") {
            router.push(`/organization/${organizationName}/iam/roles`);
        } else {
            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/iam/roles`);
        }
    }, [
        environmentName,
        projectName,
        organizationName,
        level,
        router
    ]);

    const [removeUserValue] = useState({
        role: "",
        object: "",
        subject: "",
        level: level
    })

    useEffect(() => {
        let subject=[]
        roleAssignmentsSelected.map((i)=>{
            subject.push(i.id)
        })
        removeUserValue.role = "role::" + role
        removeUserValue.subject = subject

        if (level === "organization") {
            removeUserValue.object = `organizations/${organizationName}`
        } else {
            removeUserValue.object = `organizations/${organizationName}/projects/${projectName}`
        }
    }, [organizationName, roleAssignmentsSelected, role, level, roleUserSelectionModel])

    const handleRemove = useCallback(() => {
        try {
            const revokeUser = `${hostport}/api/v1/iam/roles/revoke`;
            deleteDetails(revokeUser, "", level, headerObject, removeUserValue)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success")
                        onClickRefresh();
                    }
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }

        setRemoveUsersOpen(false)
    });

    return (
        <Grid sx={{paddingTop:"2rem"}}>
            {userInfo &&
                <Can
                    perform="write_role_assignment"
                    role={userInfo.identity.id}
                    yes={() =>
                        <div style={{display:"flex"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setRemoveRoleSearch(e.target.value)
                                        }}
                                        variant={"standard"}
                                        placeholder="Search…"
                                        size={"small"}
                                        style={{width: 300}}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',alignItems:'center'}}>
                                <Button
                                    align="center"
                                    onClick={onClickRefresh}
                                    size={"small"}
                                    startIcon={<RefreshIcon align="center"/>}
                                    sx={{color: "#808080"}}
                                />
                                {level==="project"&&
                                <ToggleButtonGroup
                                    color="primary"
                                    size={"small"}
                                    value={selectedRoleAssignment}
                                    exclusive
                                    onChange={handleChange}
                                    style={{height: 30}}
                                    aria-label="Platform"
                                >
                                    <ToggleButton value="Direct">Direct</ToggleButton>
                                    <ToggleButton value="Inherited">Inherited</ToggleButton>
                                </ToggleButtonGroup>
                                }
                                <Button
                                    size={"small"}
                                    variant={"contained"}
                                    sx={{ml:1}}
                                    onClick={()=> {
                                        level==="organization"?
                                        router.push(`/organization/${organizationName}/iam/roles/${role}/addusers/add`)
                                            :
                                        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/iam/roles/${role}/add`)
                                    }}
                                >
                                    Add Assignment
                                </Button>
                                <Button
                                    color="error"
                                    variant={"contained"}
                                    sx={{ml:1}}
                                    size={"small"}
                                    startIcon={<DeleteIcon/>}
                                    onClick={handleRemoveDialogOpen}
                                    disabled={roleAssignmentsSelected.length === 0}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    }
                    no={()=><div style={{display:"flex"}}>
                        <div className={classes.root}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <TextField
                                    onChange={(e) => {
                                        setRemoveRoleSearch(e.target.value)
                                    }}
                                    variant={"standard"}
                                    placeholder="Search…"
                                    size={"small"}
                                    style={{width: 300}}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                align="center"
                                onClick={onClickRefresh}
                                startIcon={<RefreshIcon align="center"/>}
                                sx={{color: "#808080"}}
                            />
                        </div>
                    </div>}
                />}
            <div style={{
                height: 400,
                width: "100%"
            }}
            >
                <br/>
                <DataGridComponent
                    autoHeight
                    checkboxSelection
                    columns={assignmentsColumns}
                    onSelectionModelChange={onChangeRoleUserColumn}
                    selectionModel={roleUserSelectionModel}
                    pageSize={5}
                    rows={selectedRoleAssignment=="Direct"?roleAssignments:inheritedRows}
                    rowsPerPageOptions={[5]}
                    selectedValues={selectedRoleAssignment=="Direct"?handleRemoveAssignment:null}
                />
            </div>
            <div>
                <Dialog
                    aria-describedby="alert-dialog-description"
                    aria-labelledby="alert-dialog-title"
                    onClose={handleDialogClose}
                    open={removeUsersOpen}
                >
                    <DialogTitle id="alert-dialog-title">
                        Remove user(s) from {`${role}`}
                        <br/>
                        <Divider/>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <b>Do you wish to remove {`${roleAssignmentsSelected.length}`} user(s) from {`${role}`}</b>
                            <br/>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                        <div>
                            <Button
                                autoFocus
                                color="error"
                                onClick={handleRemove}
                                variant="contained"
                            >
                                Remove Access
                            </Button>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        </Grid>
    );
}

AddUsers.propTypes = {
    level: propTypes.string.isRequired
};
