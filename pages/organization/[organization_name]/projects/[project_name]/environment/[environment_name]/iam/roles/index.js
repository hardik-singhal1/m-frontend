import * as React from "react";
import {AuthContext} from "../../../../../../../../../lib/authContext";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../../../../../../../../../lib/errorContext";
import {Refresh} from "@material-ui/icons";
import {createDetails, getDetails} from "../../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../../next.config";
import {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import AddIcon from "@material-ui/icons/Add";
import Can from "../../../../../../../../../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import TableRowsIcon from "@mui/icons-material/TableRows";
import DataGridComponent from "../../../../../../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";

const actionColumn = [
    {
        field: "name",
        headerAlign: "center",
        headerName: "Name",
        width: 250
    },
    {
        field: "description",
        headerAlign: "center",
        headerName: "Description",
        width: 350
    }
];

export default function Roles() {
    const { setSnackbar } = useContext(SnackbarContext);
    const actions = [];
    const [
        listRoles,
        setListRoles
    ] = useState([]);
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const environmentName = router.query.environment_name;
    const projectName = router.query.project_name;
    const {errorTrigger} = useContext(ErrorContext);

    const roleColumn = [
        {
            field: "id",
            headerName: "Name",
            renderCell: (params) => (
                <Link
                    onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/iam/roles/${params.value}`)}
                    style={{
                        textDecoration:"none",
                        cursor:"pointer",
                        color:"blue"
                    }}
                >
                    {params.value}
                </Link>
            ),
            width: 250
        },
        {
            field: "description",
            headerName: "Description",
            width: 600
        }
    ];

    const [
        open,
        setOpen
    ] = useState(false);

    const [
        roleSelected,
        setRoleSelected
    ] = useState([]);
    function handleRolesSelect(selectedValue) {
        setRoleSelected(selectedValue);
    }
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);
    const {userData} = useContext(AuthContext);

    const handleOpen = useCallback(() => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/iam/roles/create`)
    });

    const handleClickDialogOpen = useCallback(() => {
        setOpen(true);
    });

    const handleDialogClose = useCallback(() => {
        setOpen(false);
    });

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    let headerObject = "";

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`;
        }
    }, [router]);


    const handleDelete = useCallback(() => {
        // console.log(roleSelected)
        setOpen(false);
    });

    const getRoles = () => {
        try {
            const GetRoles = `${hostport}/api/v1/iam/roles/list`;

            const getRolesValue = {
                "level": "project"
            }


            getDetails(GetRoles, "", "project", `organizations/${organizationName}/projects/${projectName}`, getRolesValue)
                .then((res) => {
                    for (let iter = 0; iter < res.response_data.length; iter++) {
                        res.response_data[iter].id = res.response_data[iter].id.slice(6,);
                    }

                    setListRoles(res.response_data);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    function onSelectedRoleListChange(newSelectedList) {
        setRoleSelected(newSelectedList);
    }

    useEffect(() => {
        if (router.isReady) {
            getRoles();
        }
    }, [router]);



    const handleSelectRoleColumn = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedRoleListChange(listRoles.filter((role) => newSelectionModel.includes(role.id)));
    });

    const onClickRefresh = useCallback(() => {
        getRoles();
    });

    const handleYes = useCallback(() => (
        <div align="right">
            <Button onClick={onClickRefresh} size={"small"} startIcon={<Refresh/>}/>
            <Button onClick={handleOpen} variant={"contained"} size={"small"} startIcon={<AddIcon/>}>
                Create Role
            </Button>
            <Button
                color="error"
                disabled={!roleSelected.length}
                startIcon={<DeleteIcon/>}
                variant={"contained"}
                style={{marginLeft:"0.5rem"}}
                size={"small"}
            >
                Delete
            </Button>
        </div>
    ));

    const handleNo = useCallback(() => (
        <div align="right">
            <Button onClick={onClickRefresh} startIcon={<Refresh/>}/>
        </div>
    ));

    return (
        <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <ManageAccountsIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Roles
                    </Typography>
                </div>
                {userInfo &&
                    <Can
                        no={handleNo}
                        perform="write_role"
                        role={userInfo.identity.id}
                        yes={handleYes}
                    />
                }
            </div>
            <div>
                    <Grid>
                        <div style={{
                            height: "55vh",
                            width: "100%"
                        }}
                        >
                            <DataGridComponent
                                columns={roleColumn}
                                pageSize={6}
                                rows={listRoles}
                                rowsPerPageOptions={[5]}
                                selectedValues={handleRolesSelect}
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
                                    <Button color="primary" onClick={handleDialogClose} variant={"contained"}>
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
            </div>
        </div>
    );
}
