import {
    alpha,
    Button,
    ButtonBase,
    Dialog, DialogActions, DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    Typography
} from "@material-ui/core";
import Can from "../lib/Can";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@material-ui/icons/Add";
import DataGridComponent from "./DataGridComponent";
import * as React from "react";
import {useCallback, useContext, useEffect, useState} from "react";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";
import Link from "next/link";
import {useRouter} from "next/router";
import {ErrorContext} from "../lib/errorContext";
import {AuthContext} from "../lib/authContext";
import {hostport} from "../next.config";
import {createDetails, deleteDetails, getDetails} from "../utils/fetch-util";
import propTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";


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



function RoleAssignment({level}) {
    const { setSnackbar } = useContext(SnackbarContext);

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

    const classes = useStyles()
    const [tempUserIdentity,setTempUserIdentity]=useState([]);
    const [roleAssignments, setRoleAssignments] = useState([]);
    const [tempRoleAssignments,setTempRoleAssignments]=useState([]);
    const [addUsersOpen, setAddUsersOpen] = useState(false);
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
        groupSelected,
        setGroupSelected
    ] = useState([]);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext);
    const [groupRows, setGroupRows] = useState([])
    const [removeUsersOpen, setRemoveUsersOpen] = useState(false);



    const [assignRoleValue, setAssignRoleValue] = useState({
        level: "",
        object: "",
        role: "",
        subject: [],
    });

    const handleAssignDialogOpen = useCallback(() => {
        setAddUsersOpen(true)
    }, []);

    let headerObject = level==="project"?`organizations/${organizationName}/projects/${projectName}`:`organizations/${organizationName}`

    let getIdentityObjId = `organizations/${organizationName}`;

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

    const onClickRefresh = useCallback(() => {
        if (router.isReady) {
            getIdentity();
            getGroupRows();
        }
    }, []);

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

    const handleDialogClose = useCallback(() => {
        setAddUsersOpen(false);
        setRemoveUsersOpen(false);
    });

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
            getIdentity()
        }
    }, [router])

    return<>
    <div>
        <div style={{display:"flex",alignItems:"center"}}>
            <ManageAccountsIcon style={{color:"navy"}}/>
            <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                New Assignment
            </Typography>
        </div>
        <br/>
        <div align="left">
            <Typography variant="h7">Assign Role to Users</Typography>
        </div>
        <br/>
        <div>
            {userData &&
                <Can
                    perform="write_role_assignment"
                    role={userData.identity.id}
                    yes={() =>
                        <div style={{display:"flex"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setAssignRoleSearch(e.target.value)
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
                                <Button
                                    startIcon={<AddIcon/>}
                                    onClick={handleAssignDialogOpen}
                                    disabled={assignRoleValue.subject.length === 0}
                                >
                                    Assign Role
                                </Button>
                                <Button
                                    onClick={()=>router.back()}
                                    variant={"contained"}
                                    sx={{ml:1}}
                                    size={"small"}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    }
                    no={()=>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setAssignRoleSearch(e.target.value)
                                        }}
                                        variant={"standard"}
                                        placeholder="Search…"
                                        size={"small"}
                                        style={{width: 300}}
                                    />
                                </div>
                            </div>
                            <Button
                                align="center"
                                onClick={onClickRefresh}
                                startIcon={<RefreshIcon align="center"/>}
                                sx={{color: "#808080"}}
                            />
                        </div>
                    }
                />
            }
        </div>
        <br/>
        <div style={{height:'25rem'}}>
            <DataGridComponent
                checkboxSelection
                columns={assignmentsColumns}
                // onSelectionModelChange={onChangeUserColumn}
                pageSize={5}
                rows={userIdentity}
                rowsPerPageOptions={[5]}
                // selectionModel={userSelectionModel}
                selectedValues={handleUserSelected}
            />
        </div>

        <div align="left">
            <Typography variant="h7">Assign Role to Groups</Typography>
        </div>
        <br/>
        <div style={{height:'25rem'}}>
            <DataGridComponent
                height={"100"}
                checkboxSelection
                columns={groupColumn}
                disableSelectionOnClick
                // onSelectionModelChange={onSelectionGroupModelChange}
                pageSize={5}
                rows={groupRows}
                rowsPerPageOptions={[5]}
                selectedValues={handleGroupSelected}
            />
        </div>
        <div>
            <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                onClose={handleDialogClose}
                open={addUsersOpen}
            >
                <DialogTitle id="alert-dialog-title">
                    Add Users to {`${role}`}
                    <br/>
                    <Divider/>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>Do you wish to assign {`${userSelected.length}`} user(s)
                            and {`${groupSelected.length}`} group(s) to {`${role}`}</b>
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
                            color="primary"
                            onClick={onClickAssignRole}
                            variant="contained"
                        >
                            Assign Role
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    </div>
    </>
}

RoleAssignment.propTypes = {
    level: propTypes.string.isRequired
};
export default RoleAssignment