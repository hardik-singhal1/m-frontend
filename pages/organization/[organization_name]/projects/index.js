import {AuthContext} from "../../../../lib/authContext";
import {
    alpha,
    Button,
    ButtonBase,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    Typography
} from "@material-ui/core";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import moment from 'moment'
import { BiCube } from 'react-icons/bi'
import DoneIcon from '@mui/icons-material/Done';
import {ErrorContext} from "../../../../lib/errorContext";
import CircularProgress from '@mui/material/CircularProgress';
import {createDetails, deleteDetails, getDetails, updateDetails} from "../../../../utils/fetch-util";
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
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SearchIcon from '@material-ui/icons/Search';
import { Icon } from '@iconify/react';
import cubeFill from '@iconify/icons-eva/cube-fill';
import DataGridComponent from "../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {DialogActions, DialogContent} from "@mui/material";
import CountUp from "react-countup";
import {SnackbarContext} from "../../../../lib/toaster/SnackbarContext";
import Loading from "../../../../components/Loading";
import Box from "@mui/material/Box";


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
    const { setSnackbar } = useContext(SnackbarContext);
    const [showInProgress, setShowInProgress] = useState("Done");
    const [awsProjectProgress,setAwsProjectProgress] = useState(true);
    const handleChange = (event, value) => {
        setShowInProgress(event.target.value);
    };
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
    const createProject = () =>{
        router.push(`/organization/${router.query.organization_name}/projects/create`)
    }
    const [
        projectRows,
        setProjectRows
    ] = React.useState([]);
    const [
        inProgressProjectRows,
        setInProgressProjectRows
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
    const [loadingStage,setLoadingStage] = useState(["Account Requested","Enrolling Account in AWS","Sharing VPC to the Account","Done"]);
    const [loadingStageValue,setLoadingStageValue] = useState([true,false,false,false])
    const [selectedProject,setSelectedProject] = useState("");
    const [textInput,setTextInput] = useState("");
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

    const [OUs,setOUs] = useState(null);
    const [loading,setLoading] = useState(false);
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

    const handleDialogClose = () => {
        setTextInput("");
        setAwsProjectProgress(true);
        setSelectedProject("");
        setOUs(null);
        setOpen(false);
        setLoadingStageValue([true,false,false,false])
    }

    const handleDialogCreate = () => {
        if(!OUs){
            validateAwsDetails(selectedProject,textInput);
        }else{
            updateAwsDetails(selectedProject,textInput);
            setOUs(null);
            setTextInput("");
            setSelectedProject("");
            setOpen(false);
        }
    }

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

    function getAwsProjectDetails(project){
        getDetails(`${hostport}/api/v1/organizations/${organizationName}/projects/${project}/awsAccountDetails`, "", "", "", "")
            .then((res) => {
                let temp= res.response_data?.environment_ou[0];
                if(temp.account_id==""){
                    setLoadingStageValue([true,false,false,false])
                }else if(!res.response_data.registered){
                    setLoadingStageValue([true,true,false,false])
                }else{
                    setLoadingStageValue([true,true,true,true])
                }
            })
            .catch((err) => {
                console.log("error", JSON.stringify(err.message));
            });
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

    const handleHeaderClick = (params) =>{
        if(showInProgress !== "Done"){
            setSelectedProject(params.value);
            getAwsProjectDetails(params.value);
            setOpen(true);
        }else{
            router.push(`/organization/${organizationName}/projects/${params.value}/environment/${params.row.tags.environment_request}/dashboard`)
        }
    }

    const columns = [
        {
            field: "name",
            headerName: "Name",
            renderCell: (params) => {
                setName(params.value);
                return (
                    <Link style={{textDecoration:"none"}} onClick={()=>handleHeaderClick(params)}>
                        <div style={{marginLeft:"-0.75rem",display:"flex",alignItems:"center",cursor:"pointer"}}>
                            {params.row.tags.cloud === "Azure" ? <img src="/azure.svg" alt="azure" width="50" height="30" /> : ( params.row.tags.cloud === "AWS" ? <img src="/aws-icon.svg" alt="AWS" width="50" height={"17"} /> : <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="50" height="30" /> )}
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
        // {
        //     field: "cloud",
        //     headerName: "Cloud",
        //     width: 150,
        //     renderCell: (params) => {
        //         return params.row.tags.cloud;
        //     },
        //     sortable: false,
        //
        // },
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

    const getFilteredProjects = () => {
        try {
            const GetProjects = `${hostport}/api/v1/organizations/${router.query.organization_name}/pending_projects`;
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
                        setInProgressProjectRows(res.response_data);
                    } else {
                        setInProgressProjectRows([]);
                    }
                })
                .catch((err) => {
                    console.log("Err", err.message)
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    const getProjects = () => {
        try {
            setIsProjectsLoading(true);
            const GetProjects = `${hostport}/api/v1/organizations/${router.query.organization_name}/projects/`;
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
                        }else if(router.query.cloud!==undefined){
                            let arr=[];
                            let tempVal=router.query.cloud;
                            if(tempVal==="azure"){
                                res.response_data.forEach((item)=>{
                                    if(item.tags.cloud==="Azure") arr.push(item);
                                })
                            }else if(tempVal==="aws"){
                                res.response_data.forEach((item)=>{
                                    if(item.tags.cloud==="AWS") arr.push(item);
                                })
                            }else{
                                res.response_data.forEach((item)=>{
                                    if(item.tags.cloud==="Google") arr.push(item);
                                })
                            }
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
            getFilteredProjects();
        }
    }, [organizationName,router])

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
        getFilteredProjects();
    };


    function onSelectedListChange(newSelectedList) {
        setSelected(newSelectedList);
    }

    useEffect(() => {
        setProjectRows(tempArray)
        let filter = tempArray.filter((e) => (e.name.toLowerCase().includes(search.toLowerCase()) || e.name.toUpperCase().includes(search.toUpperCase())))
        setProjectRows(filter)
    }, [search])

    const updateAwsDetails = (params,id) =>{
        let url= `${hostport}/api/v1/organizations/${router.query.organization_name}/projects/${params}/updateAwsAccountDetails/${id}`;

        updateDetails(url, "", "", "", "")
            .then((res) => {
                setSnackbar(res.response_message,"success");
                setShowInProgress("Done");
                refresh();
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            });
    }

    const validateAwsDetails = (params,id) =>{
        let url= `${hostport}/api/v1/organizations/${router.query.organization_name}/projects/${params}/validateAwsAccount/${id}`;
        setLoading(true);
        getDetails(url, "", "", "", "")
            .then((res) => {
                setLoading(false);
                setOUs(res.response_data.reverse());
            })
            .catch((err) => {
                setLoading(false);
                setSnackbar("Account ID is Invalid","error")
            });
    }



    const yes = useCallback(() => (<div style={{display: "flex", flexDirection: "row",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
        <Button
            onClick={createProject}
            startIcon={<AddIcon/>}
            size={"small"}
            variant={"contained"}
            style={{marginRight:"0.5rem"}}
            sx={{
                "&.MuiButton-contained": { backgroundColor: "#1b4077" },
                height:"2rem"
            }}
        >
            Create Project
        </Button>

    </div>), [router, selected]);

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
                                <Typography variant={"h5"} style={{paddingLeft:"0.3rem",fontWeight:"600"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>
                                    Projects
                                </Typography>
                            </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center"}}>
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
                            <div style={{display: "flex", flexDirection: "row",flexWrap:"wrap"}}>
                                <ButtonBase
                                    onClick={refresh}
                                    sx={{color: "#808080",marginRight:"0.5rem"}}
                                ><RefreshIcon/></ButtonBase>
                            </div>
                            <ToggleButtonGroup
                                color="primary"
                                value={showInProgress}
                                exclusive
                                onChange={handleChange}
                                aria-label="Platform"
                                size={"small"}
                                style={{height:"2rem",marginRight:"0.5rem"}}

                            >
                                <ToggleButton value="Done">Active</ToggleButton>
                                <ToggleButton value="In Progress">In Progress</ToggleButton>
                            </ToggleButtonGroup>
                            {access && yes()}
                        </div>
                        <div style={{height:"60vh",paddingTop:"0.5rem"}}>
                            <DataGridComponent
                                columns={columns}
                                height={"100%"}
                                loading={isProjectsLoading}
                                rows={showInProgress==="Done" ? projectRows : inProgressProjectRows}
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
                                PaperProps={{
                                    style: { borderRadius: "10px" }
                                }}>
                                <DialogTitle id="alert-dialog-title"
                                             style={{backgroundColor:"#f4f6f8",height:"3.5rem",alignItems:"center",display:"flex"}}
                                >
                                    <div style={{display:"flex",alignItems:"center",width:"100%"}}>
                                        {!awsProjectProgress ?
                                            <AppRegistrationIcon style={{color:"navy",marginRight:"0.5rem"}}/> : <PublishedWithChangesIcon style={{color:"navy",marginRight:"0.5rem"}}/>
                                        }
                                        <Typography fontWeight={"bold"} variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,width:"100%"}}>
                                            {!awsProjectProgress ?
                                                `Register ${selectedProject}` : <>
                                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                                        <div>
                                                            Progress
                                                        </div>
                                                        <div>
                                                            <Typography sx={{
                                                                fontFamily: `"Public Sans", sans-serif`
                                                            }}>
                                                                Register Manually? <ButtonBase style={{color:"blue"}} onClick={()=>{
                                                                setAwsProjectProgress(false);
                                                            }
                                                            }>Click here</ButtonBase>
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </Typography>
                                    </div>
                                </DialogTitle>
                                <DialogContent>
                                    {!awsProjectProgress ?
                                        <>{
                                        loading ? <div style={{ display: 'flex',height:"100%",width:"100%",alignItems:"center",justifyContent:"center" }}>
                                            <CircularProgress />
                                        </div> : <>
                                            {
                                                OUs === null  ?
                                                    <>
                                                        <DialogContentText id="alert-dialog-description">
                                                            <Typography sx={{
                                                                fontFamily: `"Public Sans", sans-serif`,
                                                                marginTop: "1rem"
                                                            }}>Please make sure that all the OU's of this project are <span
                                                                style={{color: "red", fontWeight: "bold"}}>registered</span> and
                                                                account is <span style={{
                                                                    color: "red",
                                                                    fontWeight: "bold"
                                                                }}>enrolled</span> in AWS Control Tower before performing this
                                                                action.</Typography>
                                                        </DialogContentText>
                                                        <DialogContentText id="alert-dialog-information">
                                                            <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"black",paddingTop:"1rem"}}>To confirm registration, enter the <span style={{color:"red",fontWeight:"bold",fontFamily:`"Public Sans", sans-serif`,paddingTop:"1rem"}}>ID</span> of the account in the below text input field.
                                                            </Typography>
                                                            <TextField
                                                                onChange={(e) => {
                                                                    setTextInput(e.target.value)
                                                                }}
                                                                value={textInput}
                                                                placeholder={"Account ID"}
                                                                size={"small"}
                                                                style={{width: "100%",background:"#ebeded",marginTop:"0.5rem"}}
                                                                autoFocus={true}
                                                            />
                                                        </DialogContentText>
                                                    </> :
                                                    <>
                                                        <DialogContentText id="alert-dialog-description">
                                                            <div style={{display:"flex",alignItems:"center",margin:"-0.75rem 0"}}>
                                                                <ConfirmationNumberIcon sx={{color:"navy",height:"1.5rem",width:"1.5rem",marginTop:"1rem",marginRight:"0.25rem"}}/>
                                                                <Typography sx={{
                                                                    fontFamily: `"Public Sans", sans-serif`,
                                                                    marginTop: "1rem",
                                                                    fontWeight:"bold"
                                                                }}>Confirm the Parent OUs of the account.</Typography>
                                                            </div>
                                                        </DialogContentText>
                                                        <DialogContentText id="alert-dialog-description">
                                                            <div style={{display:"flex",flexDirection:"column",maxHeight:"10rem",overflow:"auto",marginTop:"1rem"}}>
                                                                {
                                                                    OUs.map((myList,index) =>
                                                                        <ul style={{margin:"0 0 0.25rem 0",padding:"0"}}>
                                                                            <div style={{display:"flex",marginLeft:`${(index) * 1}rem`,}}>
                                                                                {index === OUs.length-1 ? <BiCube color={"navy"} style={{marginRight:"0.2rem",height:"1.4rem",width:"1.4rem"}}/>: <FolderOutlinedIcon sx={{color:"navy",marginRight:"0.2rem"}}/>}
                                                                                <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"black"}}>{myList}</Typography>
                                                                            </div>
                                                                        </ul>
                                                                    )
                                                                }
                                                            </div>
                                                        </DialogContentText>
                                                    </>
                                            }</>
                                          }</>:
                                        <>
                                        {
                                            loadingStage.map((stage,index)=>{
                                                return (
                                                    <DialogContentText id="alert-dialog-description">
                                                        <Typography sx={{
                                                            fontFamily: `"Public Sans", sans-serif`,
                                                            marginTop: "1rem"
                                                        }}>
                                                            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                                                                {
                                                                    loadingStageValue[index] ?
                                                                        <>
                                                                            <div style={{height:"1.2rem",width:"1.2rem",borderRadius:"0.6rem",backgroundColor:"green",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                                                                <DoneIcon style={{color:"white",height:"1rem"}}/>
                                                                            </div>
                                                                            <b>{stage}</b>
                                                                        </> :
                                                                        <>
                                                                            {
                                                                                loadingStageValue[index-1] ? <CircularProgress size={"1.2rem"} thickness={5}/> :
                                                                                    <div style={{height:"1.2rem",width:"1.2rem",borderRadius:"0.6rem",backgroundColor:"green",display:"flex",justifyContent:"center",alignItems:"center",opacity:"50%"}}>
                                                                                        <DoneIcon style={{color:"white",height:"1rem"}}/>
                                                                                    </div>
                                                                            }
                                                                            {stage}
                                                                        </>
                                                                }
                                                            </div>
                                                        </Typography>
                                                    </DialogContentText>
                                                    )
                                            })
                                        }
                                        </>
                                    }
                                </DialogContent>
                                {
                                    <DialogActions style={{marginRight:"1rem",marginTop:"-1rem"}}>
                                        <Button color="primary" onClick={handleDialogClose} variant={"outlined"} size={"small"} style={{marginRight:"0.5rem",borderRadius:"10px"}}>
                                            Cancel
                                        </Button>
                                        <div>
                                            {
                                                !awsProjectProgress &&
                                                <Button
                                                    onClick={()=>{
                                                        handleDialogCreate();
                                                    }}
                                                    disabled={loading}
                                                    variant="contained"
                                                    style={{borderRadius:"10px"}}
                                                    size={"small"}
                                                >
                                                    {
                                                        !OUs ? "Register" : "Confirm"
                                                    }
                                                </Button>
                                            }
                                        </div>
                                    </DialogActions>
                                }
                            </Dialog>
                        </div>

                        <div>{
                            info &&
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogCloseInfo}
                                open={infoTrigger}
                                PaperProps={{
                                    style: { borderRadius: "16px" }
                                }}>
                                <DialogTitle id="alert-dialog-title"
                                             style={{backgroundColor:"#f4f6f8",height:"3.5rem",alignItems:"center",display:"flex"}}
                                >{(info.row && info.row.name) && <div style={{display:"flex",alignItems:"center",gap:"0.1rem"}}>
                                    {info.row.tags.cloud === "Azure" ? <img src="/azure.svg" alt="azure" width="30" height="30" /> : (info.row.tags.cloud === "AWS" ? <img src="/aws-icon.svg" alt="AWS" width="30" height={"20"}/> : <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="30" height="30" />)}
                                    <Typography variant={"h6"} style={{fontWeight:"600"}} sx={{fontFamily:`"Public Sans", sans-serif`}}>{info.row.name}</Typography>
                                </div>}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <Typography style={{fontWeight:"500",color:"black"}}>
                                    <pre>
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
                                        </Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <Divider />
                                <DialogActions>
                                    <Button color="primary" onClick={handleDialogCloseInfo} variant={"outlined"} size={"small"}>
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

