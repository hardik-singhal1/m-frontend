import {AuthContext} from "../../../../lib/authContext";
import {
    alpha,
    Button,
    ButtonBase,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider, LinearProgress,
    TextField,
    Typography
} from "@material-ui/core";
import {DataGrid, GridOverlay} from "@material-ui/data-grid";
import moment from 'moment'
import {ErrorContext} from "../../../../lib/errorContext";
import {createDetails, deleteDetails, getDetails} from "../../../../utils/fetch-util";
import {hostport} from "../../../../next.config";
import Router, {useRouter} from "next/router";
import ArchiveIcon from '@mui/icons-material/Archive';
import {withStyles} from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import React, {useCallback, useContext, useEffect, useState} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from '@mui/icons-material/Info';
import makeStyles from "@material-ui/styles/makeStyles";
import SearchIcon from '@material-ui/icons/Search';
import { Icon } from '@iconify/react';
import cubeFill from '@iconify/icons-eva/cube-fill';
import DataGridComponent from "../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    datagirdHeaders:{
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-columnsContainer':{
            backgroundColor: "#1b4077",
            color:'white',
            borderRadius:'0.5rem',
            fontWeight:'bold'
        }},
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
export default function Projects() {
    const classes = useStyles();
    const router = useRouter();
    const [organizationName,setOrganizationName] = useState("");
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])
    const [
        search,
        setSearch
    ] = React.useState("");
    const [
        projectRows,
        setProjectRows
    ] = React.useState([]);
    const [isProjectsLoading,setIsProjectsLoading] = useState(false);
    const [
        projectName,
        setProjectName
    ] = React.useState("");
    const [
        alreadyExist,
        setAlreadyExist
    ] = React.useState(false);
    const [
        dialog,
        setDialog
    ] = React.useState(false);
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext);

    const [
        selected,
        setSelected
    ] = React.useState([]);
    const [
        open,
        setOpen
    ] = React.useState(false);

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

    const handleClickDialogOpen = useCallback(() => {
        setOpen(true);
    }, [router]);

    const handleDialogClose = useCallback(() => {
        setOpen(false);
    }, [router]);

    const [load, setLoad] = useState(false)

    const handleClickDialogOpenInfo = useCallback(() => {
        setInfoTrigger(true);
    }, [router]);

    const handleDialogCloseInfo = useCallback(() => {
        setInfoTrigger(false);
    }, [router]);
    const [tempArray, setTempArray] = useState([])

    const handleDialogCloseDeleteerror = useCallback(() => {
        setDialog(false);
    }, [router]);

    const [access,setAccess] = useState(false);

    const checkAccess = () =>{
        const checkApiValue = {
            level:"organization",
            object:`organizations/${organizationName}`,
            identity:"identity::"+userData.identity.id,
            action:"write_projects"
        }
        try{
            createDetails(`${hostport}/api/v1/iam/roles/check`,"","organization",`organizations/${organizationName}`,checkApiValue)
                .then((res) => setAccess(true))
                .catch((err) => setAccess(false))
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if(organizationName && userData!==null){
            checkAccess();
        }
    },[organizationName,userData])
    const [
        value,
        setValue
    ] = useState({
        environments: [],
        id: "",
        modules: [],
        name: projectName,
        organizationId: ""
    });

    const [
        info,
        setInfo
    ] = useState(null)

    const [
        infoTrigger,
        setInfoTrigger
    ] = useState(false)

    const [
        name,
        setName
    ] = useState("");

    function getEnvironments(data) {
        try {
            const GetEnvironment = `${hostport}/api/v1/organizations/${organizationName}/projects/${data}/environment/`;

            getDetails(GetEnvironment, "", "", "", "")
                .then((res) => {
                    let filter = res.response_data.filter((event) => event.id.includes(`organizations/${organizationName}/projects/${data}/`));

                    if (filter.length === 0) {
                        filter = "Default";
                    } else {
                        filter = filter[0].name;
                    }
                    router.push(`/organization/${organizationName}/projects/${data}/environment/${filter}/dashboard`);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    const columns = [
        {
            field: "name",
            headerName: "Name",
            renderCell: (params) => {
                setName(params.value);
                return (
                    <Link style={{textDecoration:"none"}} onClick={()=>router.push(`/organization/${organizationName}/projects/${params.value}/environment/${params.row.tags.environment_request}/pullrequests`)}>
                        <div style={{marginLeft:"-0.75rem",display:"flex",alignItems:"center",cursor:"pointer"}}>
                            {params.row.tags.cloud === "Azure" ? <img src="/azure.svg" alt="azure" width="50" height="30" /> : <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="50" height="30" />}
                            <div style={{color:"blue"}}>{`${params.value}` }</div>
                            {moment().subtract(7,'d').format('MM/DD/YY') <= params.row.created && <span style={{paddingLeft:"0.5rem"}}>(New)</span>}
                        </div>
                    </Link>
                )
            },
            width: 300
        },
        {
            field: "project_owner",
            headerName: "Project Owner",
            renderCell: (params) => {
                return params.row.tags.project_owner;
            },
            sortable: false,
            width: 250,

        },
        {
            field: "tags",
            headerName: "Env Request",
            valueFormatter: ({ value }) => value.environment_request ,
            sortable: false,
            width : 120
        },
        {
            field: "created",
            headerName: "Creation Date",
            width: 150
        },
        {
            field: "hand_over",
            headerName: "HandOver",
            renderCell: (params) => {
                let temp=params.row.tags.hand_over===true ? "Yes" : "No"
                return temp;
            },
            sortable: false,
            width : 100
        },
        {
            field: "project_info",
            headerName: "Info",
            sortable: false,
            renderCell: (params) => {
                return (
                    <InfoIcon
                        sx={{
                            cursor:"pointer"
                        }}
                        onClick={() => {
                            setInfo(params)
                            setInfoTrigger(true)
                        }}
                        style={{
                            color:"#1b4077"
                        }}
                    />
                );
            },
            width: 100
        }
    ];

    useEffect(() => {
        setLoad(false)
    }, [router])

    const getProjects = () => {
        try {
            setIsProjectsLoading(true);
            const GetProjects = `${hostport}/api/v1/organizations/${router.query.organization_name}/projects_on_approval`;
            getDetails(GetProjects, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        res.response_data.forEach((project, index, projects) => {
                            projects[index].project_id = projects[index].id;
                            projects[index].id = index + 1;
                            const temp=project.tags.commission_date.split(" ");
                            const date=`${temp[1]} ${temp[2]} ${temp[3]}`
                            project.created=moment(date).format('MM/DD/YY');
                        });
                        res.response_data.reverse();
                        if(router.query.env!==undefined){
                            let arr=[];
                            res.response_data.forEach((item)=>{
                                if(item.tags.environment_request===router.query.env) arr.push(item);
                            })
                            setProjectRows(arr);
                            setTempArray(arr)
                        }else if(router.query.hand_over!==undefined){
                            let arr=[];
                            let tempVal=router.query.hand_over==="true" ? true : false;
                            res.response_data.forEach((item)=>{
                                if(item.tags.hand_over===tempVal) arr.push(item);
                            })
                            setProjectRows(arr);
                            setTempArray(arr)
                        }else{
                            setProjectRows(res.response_data);
                            setTempArray(res.response_data)
                        }
                    } else {
                        setProjectRows([]);
                        setTempArray([])
                    }
                    setIsProjectsLoading(false);
                })
                .catch((err) => {
                    setIsProjectsLoading(false);
                    console.log("Err", err.message)
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    useEffect(() => {
        if(organizationName){
            getProjects();
        }
    }, [organizationName])

    useEffect(() => {

        const newValue = {
            ...value,
            id: `/organizations/${organizationName}/projects/${projectName}/`,
            name: projectName,
            organizationId: `/organizations/${organizationName}`
        };

        if (newValue !== value) {
            setValue(newValue);
        }

        projectRows.map((project) => {
            if (project.name === projectName) {
                if (alreadyExist !== true) {
                    setAlreadyExist(true);
                }
                return false;
            }

            if (alreadyExist !== false) {
                setAlreadyExist(false);
            }

            return true;
        });
    }, [
        organizationName,
        projectRows,
        projectName,
    ]);


    // const handleOpen = useCallback(, [router]);

    const refresh = () => {
        getProjects();
    };

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <LinearProgress/>
                </div>
            </GridOverlay>
        );
    }


    const handleDelete = useCallback(() => {
        try {
            selected.map((select) => {
                const deleteProject = `${hostport}/api/v1/organizations/${organizationName}/projects/${select.name}`;
                deleteDetails(deleteProject, "", "", "", select)
                    .catch(() => {
                        setDialog(true);
                    });
                getProjects();
            });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }

        setOpen(false);
        setSelectionModel([]);
        setSelected([]);
    }, [
        selected,
        organizationName
    ]);

    function onSelectedListChange(newSelectedList) {
        setSelected(newSelectedList);
    }

    useEffect(() => {
        setProjectRows(tempArray)
        let filter = tempArray.filter((e) => (e.name.toLowerCase().includes(search.toLowerCase()) || e.name.toUpperCase().includes(search.toUpperCase())))
        setProjectRows(filter)
    }, [search])



    const onSelectionModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedListChange(projectRows.filter((row) => newSelectionModel.includes(row.id)));
    });

    return (
        <div>
            {
                <div>
                    <div>
                        <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                            <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                                <Icon
                                    icon={cubeFill}
                                    height={22}
                                    width={22}
                                    color="navy"
                                />
                                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                    Pending Approval Projects
                                </Typography>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setSearch(e.target.value)
                                        }}
                                        // variant="standard"
                                        placeholder="Search…"
                                        size={"small"}
                                        style={{width: 300}}
                                    />
                                </div>
                            </div>
                            <Button
                                align="center"
                                onClick={refresh}
                                startIcon={<RefreshIcon align="center"/>}
                                sx={{color: "#808080"}}
                                size={"small"}
                            />
                            <Button
                                align="center"
                                onClick={
                                    ()=>router.push(`/organization/${organizationName}/`)
                                }
                                variant={"contained"}
                                size={"small"}
                            > Back
                            </Button>
                        </div>
                        <div style={{height:"60vh",paddingTop:"0.5rem"}}>
                            <DataGridComponent
                                columns={columns}
                                height={"100%"}
                                loading={isProjectsLoading}
                                rows={projectRows}
                                // search={search}
                                width="100%"
                                pageSize={7}
                            />
                        </div>
                        <div>
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogClose}
                                open={open}
                            >
                                <DialogTitle id="alert-dialog-title">Do you wish to continue?
                                    <br/>
                                    <Divider/>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <b>Project(s) once deleted cannot be retrieved.</b>
                                        <br/>
                                        <br/>
                                        Are you sure you want to delete this project?
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
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogCloseDeleteerror}
                                open={dialog}
                            >
                                <DialogTitle id="alert-dialog-title"><b>Delete Operation Cannot be Performed</b>
                                    <br/>
                                    <Divider/>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <b>Project(s) once deleted cannot be retrieved.</b>
                                        <br/>
                                        <br/>
                                        Delete All Your Modules, Variables, environments before deleting the
                                        Project.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={handleDialogCloseDeleteerror}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>

                        <div>{
                            info &&
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogCloseInfo}
                                open={infoTrigger}
                            >
                                <DialogTitle id="alert-dialog-title">{(info.row && info.row.name) && info.row.name}
                                    <br/>
                                    <Divider/>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <b>
                                    <pre>
                                        {/*{JSON.stringify((info.row && info.row.tags) && info.row.tags, null, 2)}*/}
                                        Project Owner           : {info.row.tags.project_owner} <br/>
                                        {
                                            info.row.tags.availability!=="" &&
                                            <span>
                                                Availability            : {info.row.tags.availability} <br/>
                                            </span>
                                        }
                                        Commission Date         : {info.row.tags.commission_date} <br/>
                                        {
                                            info.row.tags.compliance!=="" &&
                                            <span>
                                                Compliance              : {info.row.tags.compliance} <br/>
                                            </span>
                                        }
                                        Organization Name       : {info.row.tags.organization_name} <br/>
                                        Business Unit           : {info.row.tags.business_unit} <br/>
                                        {
                                            info.row.tags.disaster_recovery.RTO!=="" &&
                                            <span>
                                                RTO                     : {info.row.tags.disaster_recovery.RTO} <br/>
                                                RPO                     : {info.row.tags.disaster_recovery.RPO}<br/>
                                            </span>
                                        }
                                        <span>
                                        {info.row.tags.cost_centre?.map((cost, costIndex) => (
                                            <div key={costIndex}>
                                                Cost Centre Name        : {cost.costcentrename} <br/>
                                                Percentage              : {cost.percentage}<br/>
                                            </div>
                                        ))}
                                        </span>
                                        Details and attachments : {info.row.tags.details_and_attachments} <br/>
                                        Environment Request     : {info.row.tags.environment_request} <br/>
                                    </pre>
                                        </b>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={handleDialogCloseInfo}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        }</div>
                    </div>
                </div>
            }
        </div>

    )
}

