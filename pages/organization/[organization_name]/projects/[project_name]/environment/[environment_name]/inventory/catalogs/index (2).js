import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {Box} from "@mui/system";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import SearchIcon from "@material-ui/icons/Search";
import {alpha, Button, ButtonBase, TextField} from "@material-ui/core";
import Can from "../../../../../../../../../lib/Can";
import RefreshIcon from "@mui/icons-material/Refresh";
import makeStyles from "@material-ui/styles/makeStyles";
import {hostport} from "../../../../../../../../../next.config";
import {createDetails, deleteDetails, getDetails} from "../../../../../../../../../utils/fetch-util";
import {DataGrid} from "@material-ui/data-grid";
import {AuthContext} from "../../../../../../../../../lib/authContext";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import DataGridComponent from "../../../../../../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";


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

export default function Catalogs () {

    const router = useRouter();
    const { setSnackbar } = useContext(SnackbarContext);
    const classes = useStyles();
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName] = useState("");
    const [environmentName,setEnvironmentName] = useState("");
    const [catalogRows, setCatalogRows] = useState([]);
    const [tempArray, setTempArray] = useState([]);
    const [access,setAccess] = useState(false);
    const {userData} = useContext(AuthContext);
    const [selectionModel, setSelectionModel] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(()=>{
        if(organizationName && userData!==null){
            checkAccess();
        }
    },[organizationName,userData])

    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name);
            setEnvironmentName(router.query.environment_name);
        }
    },[router])

    useEffect(()=>{
        if(organizationName && projectName) {
            getCatalogs();
        }
    },[organizationName,projectName])

    const handleDelete = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs`;
            deleteDetails(url, "", "", "", selected)
                .then(()=>{
                    setSnackbar("application catalog deleted successfully","success");
                    getCatalogs();
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            err.response?.data?.response_message || err.message
        }
        setSelectionModel([]);
        setSelected([]);
    }

    const getCatalogs = () =>{
        if(organizationName && projectName){
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs`;
            let data = [];
            try{
                getDetails(url, "", "", "", "")
                    .then((res)=>{
                        res.response_data.map((item)=>{
                            data.push(item);
                        })
                        setCatalogRows(data);
                        setTempArray(data)
                    })
                    .catch((err)=>{
                        setCatalogRows([]);
                        setTempArray([]);
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    })
            }catch (err) {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            }
        }
    }

    const onSelectedListChange = (newSelectedList)=> {
        setSelected(newSelectedList);
    }

    const onSelectionModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedListChange(catalogRows.filter((row) => newSelectionModel.includes(row.id)));
    });

    const checkAccess = () =>{
        const checkApiValue = {
            level:"organization",
            object:`organizations/${organizationName}`,
            identity:"identity::"+userData.identity.id,
            action:"write_projects"
        }
        try{
            createDetails(`${hostport}/api/v1/iam/roles/check`,"","project",`organizations/${organizationName}/projects/${projectName}`,checkApiValue)
                .then((res) => setAccess(true))
                .catch((err) => setAccess(false))
        }catch(e){
            console.log(e);
        }
    }

    function handleCatalogsSelect(selectedValue) {
        setSelected(selectedValue);
    }
    const handleTabChange = (e,newValue) => {
        if(newValue==="Resources"){
            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/resources`)
        }
    };
    const columns = [
        {
            field: "name",
            headerName: "Name",
            renderCell: (params) => {
                return (
                    <Link
                        onClick={() => {
                            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/catalogs/${params.value}`)
                        }}
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
            width: 200
        },
        {
            field: "endpoint",
            headerName: "Endpoints",
            width: 150
        },
        {
            field: "owner_details",
            headerName: "Owner Details",
            width: 200
        },
        {
            field: "cost_centre",
            headerName: "Cost Centre",
            width: 200
        }
    ];

    return(
        <div>
            <div style={{height:"400px"}}>
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={"Catalogs"}
                        onChange={handleTabChange}
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "orange"
                            }
                        }}
                    >
                        <Tab value="Catalogs" label={<span style={{color:"navy"}}>Catalogs</span>} sx={{fontWeight:"bold",fontSize:"1.5rem"}}/>
                        <Tab value="Resources" label="Resources" sx={{fontWeight:"bold"}}/>
                    </Tabs>
                </Box>
                <div style={{display: "flex", flexDirection: "row",paddingTop:"1.5rem",paddingBottom:"0.5rem"}}>
                    <div className={classes.root}>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <TextField
                                onChange={(e) => {
                                    // setSearch(e.target.value)
                                }}
                                variant="standard"
                                placeholder="Search…"
                                size={"small"}
                                style={{width: 300}}
                            />
                        </div>
                    </div>
                    <Button
                        align="center"
                        onClick={getCatalogs}
                        startIcon={<RefreshIcon align="center"/>}
                        sx={{color: "#808080"}}
                        size={"small"}
                    />
                    {
                        access &&
                        <div>
                            <Button
                                color="primary"
                                onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/catalogs/create`)}
                                startIcon={<AddIcon/>}
                                variant={"contained"}
                                style={{marginRight:"0.5rem"}}
                                size={"small"}
                            >
                                Create
                            </Button>
                            <Button
                                color="error"
                                onClick={handleDelete}
                                disabled={!selected.length}
                                startIcon={<DeleteIcon/>}
                                variant={"contained"}
                                size={"small"}
                            >
                                Delete
                            </Button>
                        </div>
                    }
                </div>
                <div style={{height:"50vh",overflow:"auto"}}>
                    <DataGridComponent
                        selectedValues={access ? setSelected : null}
                        checkboxSelection={access}
                        columns={columns}
                        pageSize={5}
                        rows={catalogRows}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </div>
        </div>
    )
}
