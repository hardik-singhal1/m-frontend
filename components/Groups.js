import * as React from "react";
import {AuthContext} from "../lib/authContext";
import {
    Button,
    ButtonBase,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    Typography
} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../lib/errorContext";
import {Refresh} from "@material-ui/icons";
import {createDetails, deleteDetails, getDetails} from "../utils/fetch-util";
import {hostport, hostport1} from "../next.config";
import {useCallback, useContext, useEffect, useState} from "react";
import {withStyles} from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import Can from "../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import {useRouter} from "next/router";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";
import {MdGroups} from "react-icons/md";
import DataGridComponent from "./DataGridComponent";
import Link from "@material-ui/core/Link";

export default function Groups() {
    const { setSnackbar } = useContext(SnackbarContext);
    const [
        userIdentity,
        setUserIdentity
    ] = useState([]);
    const router = useRouter();
    const {organization_name: organizationName} = router.query;
    const [
        groupRows,
        setGroupRows
    ] = useState([]);
    const [
        createOpen,
        setCreateOpen
    ] = useState(true);
    const [
        groupName,
        setGroupName
    ] = useState("");
    const [
        userSelected,
        setUserSelected
    ] = useState([]);
    const [
        groupSelected,
        setGroupSelected
    ] = useState([]);
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);
    const [
        description,
        setDescription
    ] = useState("");
    const [
        open,
        setOpen
    ] = useState(false);
    const {errorTrigger} = useContext(ErrorContext);
    const [
        alreadyExist,
        setAlreadyExist
    ] = useState("");
    const {userData} = useContext(AuthContext);
    const [
        createGroupValue,
        setCreateGroupValue
    ] = useState({
        "description": "",
        "id": "",
        "name": "",
        "object": "",
        "users": []
    });

    let headerObject = ""

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`
        }
    })

    function handleGroupSelect(selectedValue) {
        setGroupSelected(selectedValue);
    }
    function handleUsersSelect(selectedValue) {
        setUserSelected(selectedValue);
    }

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
            field: "state",
            headerName: "Status",
            renderCell: render,
            width: 150
        },
        {
            editable: true,
            field: "email",
            headerName: "Mail",
            width: 300
        }
    ];

    const groupColumn = [
        {
            field: "name",
            headerName: "Group Name",
            // headerAlign: "center",
            renderCell: (params) => (
                <Link
                    onClick={()=>router.push(`/organization/${organizationName}/iam/groups/${params.value}`)}
                    style={{
                        textDecoration:"none",
                        cursor:"pointer",
                        color:"blue"
                    }}
                >
                    {params.value}
                </Link>
            ),
            width: 200
        },
        {
            field: "users",
            headerName: "Users",
            // headerAlign: "center",
            width: 150
        },
        {
            field: "description",
            headerName: "Description",
            // headerAlign: "center",
            width: 400
        }
    ];

    const handleOpen = useCallback(() => setCreateOpen(false));

    const handleClose = useCallback(() => setCreateOpen(true));

    const handleDialogClose = useCallback(() => setOpen(false));

    const onSelectionGroupModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel);
        onSelectedListChange(groupRows.filter((group) => newSelectionModel.includes(group.id)));
    });

    const getGroupRows = () => {
        try {
            const GetGroups = `${hostport}/api/v1/iam/groups`;
            const getGroupValue = {
                organization_id: `organizations/${organizationName}`
            }

            getDetails(GetGroups, "", "organization", headerObject, getGroupValue)
                .then((res) => {
                    if (res.response_data) {
                        for (let index = 0; index < res.response_data.length; index++) {
                            res.response_data[index].users = res.response_data[index].users.length;
                            // SetOrgId res[index].organization_id = res[index].object;
                        }

                        setGroupRows(res.response_data);
                    } else {
                        setGroupRows([]);
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    const onClickRefresh = useCallback(() => getGroupRows());

    useEffect(() => {
        const newValue = {
            ...createGroupValue,
            description,
            id: `organizations/${organizationName}/groups/${groupName}`,
            name: groupName,
            object: `organizations/${organizationName}`,
            users: [],
        };

        setCreateGroupValue(newValue);
    }, [groupName, description, organizationName])

    const handleCloseCreate = () => {
        try {
            const createGroup = `${hostport}/api/v1/iam/groups`;
            const tempUsers=[];
            userSelected?.forEach((user)=>{
                tempUsers.push(user.id);
            })
            createGroupValue.users=tempUsers;

            createDetails(createGroup, "", "organization", headerObject, createGroupValue)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success")
                        getGroupRows();
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
        setCreateOpen(true);
    };

    const getUserRows = () => {
        try {
            const GetUsers = `${hostport}/api/v1/iam/identities`;

            getDetails(GetUsers, "", "organization", headerObject, "")
                .then((res) => {
                    setUserIdentity(res.response_data);
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    let groupID = "";

    useEffect(() => {
        if (groupSelected !== [] && groupSelected[0] !== undefined) {
            groupID = {
                "group_id": `organizations/${organizationName}/groups/${groupSelected[0].name}`
            };
        }
    })

    const handleDelete = useCallback(() => {
        try {
            const deleteGroup = `${hostport}/api/v1/iam/groups`;
            deleteDetails(deleteGroup, "", "organization", headerObject, groupID)
                .then((res) => {
                    if(!res?.is_error) {
                        setSnackbar(res.response_message,"success")
                        getGroupRows();
                        setGroupSelected([]);
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }

        setOpen(false);
        setSelectionModel([]);
        getGroupRows();
    });

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

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

    const handleClickDialogOpen = useCallback(() => setOpen(true));

    useEffect(() => {
        for (let index = 0; index < groupRows.length; index++) {
            if (groupRows[index].name === groupName) {
                setAlreadyExist(true);
                break;
            } else {
                setAlreadyExist(false);
            }
        }

    }, [
        groupName,
        open,
        createOpen
    ]);

    function onSelectedListChange(newSelectedList) {
        setGroupSelected(newSelectedList);
    }

    function onSelectedUserListChange(newSelectedList) {
        const arr = [];
        for (let index = 0; index < newSelectedList.length; index++) {
            arr.push(newSelectedList[index].id);
        }

        setUserSelected(arr);
    }

    useEffect(() => {
        if (router.isReady) {
            getGroupRows();
            getUserRows();
        }
    }, [router]);

    const canYes = useCallback(() => (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <MdGroups style={{color:"navy",width:"30",height:"30"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Groups
                    </Typography>
                </div>
                <div>
                    <Button
                        onClick={onClickRefresh}
                        startIcon={<Refresh/>}
                        size={"small"}
                    />
                    <Button onClick={handleOpen} startIcon={<AddIcon/>} size={"small"} variant={"contained"} style={{marginRight:"0.5rem"}}>
                        Create Group
                    </Button>
                    {groupSelected.length === 0
                        ? <Button
                            color="error"
                            disabled
                            startIcon={<DeleteIcon/>}
                            size={"small"} variant={"contained"}
                        >Delete
                        </Button>
                        : <Button
                            color="error"
                            onClick={handleClickDialogOpen}
                            startIcon={<DeleteIcon/>}
                            size={"small"} variant={"contained"}
                        >Delete
                        </Button>}
                </div>
            </div>
        </div>));

    const canNo = useCallback(() => (
        <div align="right">
            <Button onClick={onClickRefresh} startIcon={<Refresh/>} size={"small"}/>
        </div>
    ));

    const onSelectionUserModelChange = useCallback((newSelectionModel) => {
        onSelectedUserListChange(userIdentity.filter((user) => newSelectionModel.includes(user.id)));
    });

    const onChangeDescription = useCallback((event) => {
        setDescription(event.target.value);
    });

    const onChangeGroupName = useCallback((event) => {
        setGroupName(event.target.value);
    });

    return (
        <div>
            {createOpen
                ? (
                    <div>
                        {userInfo &&
                            <Can
                                no={canNo}
                                perform="write_group"
                                role={userInfo.identity.id}
                                yes={canYes}
                            />
                        }
                        <div style={{
                            height: "65vh",
                            width: "100%"
                        }}
                        >
                            <DataGridComponent
                                // checkboxSelection
                                columns={groupColumn}
                                // disableSelectionOnClick
                                // onSelectionModelChange={onSelectionGroupModelChange}
                                pageSize={5}
                                rows={groupRows}
                                rowsPerPageOptions={[7]}
                                selectedValues={handleGroupSelect}
                                // selectionModel={selectionModel}
                                // style={{
                                //     backgroundColor:"#fafbfb",borderRadius:"0.5rem"
                                // }}
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
                                        <b>Groups(s) once deleted cannot be retrieved.</b>
                                        <br/>
                                        <br/>
                                        Are you sure you want to delete this group?
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
                    </div>
                )
                : (
                    <div>
                        <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                            <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                                <MdGroups style={{color:"navy",width:"30",height:"30"}}/>
                                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                    Create Group
                                </Typography>
                            </div>
                            <div>
                                <Button onClick={handleClose} variant={"outlined"} size={"small"} style={{marginRight:"0.5rem"}}>Cancel</Button>
                                {(groupName !== "" && !alreadyExist && userSelected?.length > 0 && description.length > 0)
                                    ? (
                                        <Button onClick={handleCloseCreate} variant="contained" size={"small"}>
                                            Create
                                        </Button>
                                    )
                                    : (
                                        <Button disabled variant="contained" size={"small"}>
                                            Create
                                        </Button>
                                    )}
                            </div>
                        </div>
                        {/*<div style={{height:"65vh",width:"100%",overflow:"auto",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>*/}
                        {/*    <div style={{display:"flex",flexWrap:"wrap"}}>*/}
                        {/*        <div style={{width:"30%",paddingTop:"2rem"}}>*/}
                        {/*            <div style={{paddingBottom:"1rem"}}>*/}
                        {/*                <Typography variant={"h7"}>Group Name</Typography>*/}
                        {/*                <TextField*/}
                        {/*                    defaultValue={roleName}*/}
                        {/*                    onChange={onChangeRoleName}*/}
                        {/*                    size="small"*/}
                        {/*                    sx={{width: 242,pt:"0.5rem"}}*/}
                        {/*                    placeholder={"Enter a Role Name"}*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                <Typography variant={"h7"}>Role Description</Typography>*/}
                        {/*                <TextField*/}
                        {/*                    defaultValue={description}*/}
                        {/*                    onChange={handleChangeDescription}*/}
                        {/*                    size="small"*/}
                        {/*                    sx={{width: 242,pt:"0.5rem"}}*/}
                        {/*                    placeholder={"Enter Description for the Role"}*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div style={{width:"65%",height:"58vh",margin:"0 1.1rem 1.1rem 1.1rem"}}>*/}
                        {/*            <div style={{display:"flex",justifyContent:"center",padding:"0.5rem 0"}}>*/}
                        {/*                <Typography variant={"h7"}>Level of Action</Typography>*/}
                        {/*            </div>*/}
                        {/*            <DataGrid*/}
                        {/*                checkboxSelection*/}
                        {/*                columns={actionColumn}*/}
                        {/*                disableSelectionOnClick*/}
                        {/*                onSelectionModelChange={handleActionColumnChange}*/}
                        {/*                pageSize={6}*/}
                        {/*                rows={actionRows}*/}
                        {/*                rowsPerPageOptions={[5]}*/}
                        {/*                style={{*/}
                        {/*                    backgroundColor:"white",borderRadius:"0.5rem"*/}
                        {/*                }}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div style={{height:"65vh",width:"100%",overflow:"auto",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                            <div style={{display:"flex",flexWrap:"wrap"}}>
                                <div style={{width:"30%",paddingTop:"2rem"}}>
                                    <div style={{paddingBottom:"1rem"}}>
                                        <Typography variant={"h7"}>Group Name</Typography>
                                        <div>
                                            {
                                                alreadyExist
                                                    ? <TextField
                                                        defaultValue={groupName}
                                                        error
                                                        helperText="Already Exists"
                                                        onChange={onChangeGroupName}
                                                        size="small"
                                                        sx={{width: 300,pt:"0.5rem"}}
                                                    />
                                                    : <TextField
                                                        defaultValue={groupName}
                                                        onChange={onChangeGroupName}
                                                        size="small"
                                                        sx={{width: 300,pt:"0.5rem"}}
                                                    />
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant={"h7"}>Group Description</Typography>
                                        <div>
                                            <TextField
                                                defaultValue={description}
                                                onChange={onChangeDescription}
                                                size="small"
                                                sx={{width: 300,pt:"0.5rem"}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{width:"65%",height:"58vh",margin:"0 1.1rem 1.1rem 1.1rem"}}>
                                    <div style={{display:"flex",justifyContent:"center",padding:"0.5rem 0"}}>
                                        <Typography variant={"h7"}>Users</Typography>
                                    </div>
                                    <DataGridComponent
                                        columns={userColumn}
                                        selectedValues={handleUsersSelect}
                                        pageSize={100}
                                        rows={userIdentity}
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
