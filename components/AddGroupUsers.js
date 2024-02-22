import * as React from "react";
import {AuthContext} from "../lib/authContext";
import {
    Button,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography
} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../lib/errorContext";
import {Refresh} from "@material-ui/icons";
import {createDetails, deleteDetails, getDetails, updateDetails} from "../utils/fetch-util";
import {hostport, hostport1} from "../next.config";
import {useCallback, useContext, useEffect, useState} from "react";
import {withStyles} from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import Box from '@mui/material/Box';
import Can from "../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from '@mui/material/Grid';
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import {useRouter} from "next/router";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";

export default function AddGroupUsers() {
    const { setSnackbar } = useContext(SnackbarContext);
    const [
        groupUsers,
        setGroupUsers
    ] = useState([]);
    const [
        users,
        setUsers
    ] = useState([]);
    const router = useRouter();
    const {organization_name: organizationName} = router.query;
    const {groupname} = router.query;
    const [
        groupUserSelected,
        setGroupUserSelected
    ] = useState([]);
    const [
        userSelected,
        setUserSelected
    ] = useState([]);
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);
    const [
        open,
        setOpen
    ] = useState(false);
    const [addUsersOpen, setAddUsersOpen] = useState(false);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext);


    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    function render(params) {
        if (params.value === "active") {
            return <Button sx={{color: "green"}}>{`${params.value}`}</Button>;
        }

        return <Button sx={{color: "red"}}>{`${params.value}`}</Button>;
    }

    const userColumn = [
        {
            editable: true,
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            editable: true,
            field: "email",
            headerName: "Mail",
            width: 300
        }
    ];

    const groupUserColumn = [
        {
            editable: true,
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            editable: true,
            field: "email",
            headerName: "Mail",
            width: 300
        }
    ];

    const handleClickDialogOpen = useCallback(() => setOpen(true), []);

    const handleAddUsersOpen = useCallback(() => setAddUsersOpen(true), []);

    const handleDialogClose = useCallback(() => {
        setOpen(false);
        setAddUsersOpen(false);
    });

    function onSelectedGroupUserListChange(newSelectedList) {
        setGroupUserSelected(newSelectedList);
    }

    function onSelectedUserListChange(newSelectedList) {
        const arr = [];
        for (let index = 0; index < newSelectedList.length; index++) {
            arr.push(newSelectedList[index].id);
        }
        setUserSelected(arr);
    }

    let headerObject = "";

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`
        }
    })

    const getUserRows = () => {
        {
            try {
                const GetUsers = `${hostport}/api/v1/iam/identities`;

                getDetails(GetUsers, "", "organization", headerObject, "")
                    .then((res) => {
                        setUsers(res.response_data);
                    })
                    .catch((err) => {
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    });
            } catch (err) {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            }
        }
    }

    const getGroupUserRows = () => {
        try {
            const GetUsers = `${hostport}/api/v1/iam/groups/members`;

            const groupId = {
                group_id: `organizations/${organizationName}/groups/${groupname}`
            };

            getDetails(GetUsers, "", "organization", headerObject, groupId)
                .then((res) => {
                    if (res.response_data) {
                        setGroupUsers(res.response_data);
                    } else {
                        setGroupUsers([]);
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    const onClickRefresh = useCallback(() => {
        getUserRows();
        getGroupUserRows();
    }, []);

    const [groupMember, setGroupMember] = useState({
        id: "",
        object: "",
        users: []
    })

    let deleteDetailsValue = "";

    useEffect(() => {
        deleteDetailsValue = {
            id: `organizations/${organizationName}/groups/${groupname}`,
            object: `organizations/${organizationName}`,
            // Datagrid's "selectionModel" provides the value of the field "id" as an array,
            // which can be passed as a value here..
            users: selectionModel
        };
    })

    const handleDelete = () => {
        try {
            const removeUser = `${hostport}/api/v1/iam/groups/users`;
            deleteDetails(removeUser, "", "organization", headerObject, deleteDetailsValue)
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
            getGroupUserRows();
            setGroupUserSelected([]);
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
        setOpen(false);
    };

    useEffect(() => {
        const addGroupMember = {
            ...groupMember,
            id: `organizations/${organizationName}/groups/${groupname}`,
            object: `organizations/${organizationName}`,
            users: userSelected
        }
        console.log(addGroupMember)
        setGroupMember(addGroupMember)
    }, [organizationName, groupname, userSelected, handleAddUsersOpen])

    const handleAddUsers = () => {
        try {
            const addUsers = `${hostport}/api/v1/iam/groups/users`;

            console.log(groupMember)
            createDetails(addUsers, "", "organization", headerObject, groupMember)
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
        setAddUsersOpen(false)
        setGroupUserSelected([])
    };

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

    useEffect(() => {
        if (router.isReady) {
            getUserRows();
            getGroupUserRows();
        }
    }, [router]);

    const canNoComponent = useCallback(() => (
        <div align="right">
            <Button onClick={onClickRefresh} startIcon={<Refresh/>}/>
        </div>));

    const canYesComponent = useCallback(() => (
        <div>
            <Button onClick={onClickRefresh} startIcon={<Refresh/>}/>
            {
                userSelected.length > 0 ?
                    <Button
                        onClick={handleAddUsersOpen}
                        startIcon={<AddIcon/>}
                    >Add Users
                    </Button> : < Button
                        autoFocus
                        startIcon={<AddIcon/>}
                        disabled
                    >
                        Add Users
                    </Button>
            }
            {groupUserSelected.length === 0
                ? <Button
                    color="error"
                    disabled
                    startIcon={<DeleteIcon/>}
                >Remove
                </Button>
                : <Button
                    color="error"
                    onClick={handleClickDialogOpen}
                    startIcon={<DeleteIcon/>}
                > Remove
                </Button>}
        </div>));

    return (
        <div>
            <div align="left">
                <Typography variant="h5">{groupname}</Typography>
            </div>
            <div align="right">
                {userInfo &&
                    <Can
                        no={canNoComponent}
                        perform="write_role"
                        role={userInfo.identity.id}
                        yes={canYesComponent}
                    />
                }
                <div style={{
                    height: 400,
                    width: "100%"
                }}
                >
                    <br/>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{
                                height: 400,
                                width: "100%"
                            }}>
                                <div align="left">
                                    <Typography variant="h7">Group Users</Typography>
                                </div>
                                <br/>
                                <DataGrid
                                    checkboxSelection
                                    columns={groupUserColumn}
                                    disableSelectionOnClick
                                    onSelectionModelChange={useCallback((newSelectionModel) => {
                                        setSelectionModel(newSelectionModel);
                                        onSelectedGroupUserListChange(groupUsers.filter((user) => newSelectionModel.includes(user.id)));
                                    })}
                                    pageSize={5}
                                    rows={groupUsers}
                                    rowsPerPageOptions={[5]}
                                    selectionModel={selectionModel}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{
                                height: 400,
                                width: "100%"
                            }}>
                                <div align="left">
                                    <Typography variant="h7">Add Users to this Group</Typography>
                                </div>
                                <br/>
                                <DataGrid
                                    checkboxSelection
                                    columns={userColumn}
                                    disableSelectionOnClick
                                    onSelectionModelChange={useCallback((newSelectionModel) => {
                                        setSelectionModel(newSelectionModel.selectionModel);
                                        onSelectedUserListChange(users.filter((user) => newSelectionModel.includes(user.id)));
                                    })}
                                    pageSize={5}
                                    rows={users}
                                    rowsPerPageOptions={[5]}
                                    selectionModel={selectionModel}
                                />
                            </Grid>
                        </Grid>
                    </Box>
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
                                <b>Do you wish to remove this user?.</b>
                                <br/>
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
                <div>
                    <Dialog
                        aria-describedby="alert-dialog-description"
                        aria-labelledby="alert-dialog-title"
                        onClose={handleDialogClose}
                        open={addUsersOpen}
                    >
                        <DialogTitle id="alert-dialog-title">
                            Add Users to {`${groupname}`}
                            <br/>
                            <Divider/>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <b>Do you wish to add {`${userSelected.length}`} user(s) to {`${groupname}`}</b>
                                <br/>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={handleDialogClose}>
                                Cancel
                            </Button>
                            <Button
                                autoFocus
                                color="primary"
                                onClick={handleAddUsers}
                                variant="contained"
                            >
                                Add Users
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
