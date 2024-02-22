import ProjectLayout from "../../../../../../../../../../components/project/ProjectLayout";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import SearchIcon from "@material-ui/icons/Search";
import {alpha, Button, ButtonBase, TextField} from "@material-ui/core";
import RefreshIcon from "@mui/icons-material/Refresh";
import makeStyles from "@material-ui/styles/makeStyles";
import {hostport} from "../../../../../../../../../../next.config";
import {createDetails, deleteDetails, getDetails, updateDetails} from "../../../../../../../../../../utils/fetch-util";
import {DataGrid} from "@material-ui/data-grid";
import {AuthContext} from "../../../../../../../../../../lib/authContext";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {SnackbarContext} from "../../../../../../../../../../lib/toaster/SnackbarContext";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";


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
    const [tempArray, setTempArray] = useState([]);
    const [access,setAccess] = useState(false);
    const {userData} = useContext(AuthContext);
    const [selectionModel, setSelectionModel] = useState([]);
    const [selectionModel2, setSelectionModel2] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selected2, setSelected2] = useState([]);
    const [allResources,setAllResources] = useState([]);
    const [catalogName,setCatalogName] = useState("");

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
            setCatalogName(router.query.catalog);
        }
    },[router])

    useEffect(()=>{
        if(organizationName && projectName) {
            getResources();
        }
    },[organizationName,projectName])

    const handleClose = () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/DEV/inventory/catalogs`);
    };

    const handleDelete = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs/DeleteMapresource`;
            // let payload = _.cloneDeep(catalog);
            let arr=[];
            let payload={
                "resource":[""],
                "application_catalog":[`organizations/${organizationName}/applicationCatalog/${catalogName}`],
                "organization_id":`organizations/${organizationName}`
            }
            selected.forEach((i)=>{
                arr.push(i.resource_id)
            })
            payload.resource=arr;
            updateDetails(url, "", payload)
                .then((res)=>{
                    setSnackbar(res.response_message,"success");
                    getResources();
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

    const handleAdd = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs/Mapresource`;
            let arr=[];
            selected2.forEach((i)=>{
                arr.push(i.resource_id)
            })
            let payload={
                "resource":[""],
                "application_catalog":[`organizations/${organizationName}/applicationCatalog/${catalogName}`],
                "organization_id":`organizations/${organizationName}`
            }
            payload.resource=arr;
            updateDetails(url, "", payload)
                .then((res)=>{
                    setSnackbar(res.response_message,"success");
                    getResources();
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            err.response?.data?.response_message || err.message
        }
        setSelectionModel2([]);
        setSelected2([]);
    }

    const [catalogResources,setCatalogResources] = useState([]);
    const [filteredResources,setFilteredResources] = useState([]);
    const [catalog,setCatalog] = useState("");

    const getCatalogResources =(data)=>{
        if(organizationName && projectName){
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs/${catalogName}`;
            try{
                getDetails(url, "", "", "", "")
                    .then((res)=>{
                        let arr1=[];
                        let arr2=[];
                        setCatalog(res.response_data);
                        if(!res.response_data.cloud_resource){
                            setFilteredResources(data);
                        }else{
                            res.response_data.cloud_resource.forEach((item)=>{
                                data.forEach((item2)=>{
                                    if(item2.resource_id===item){
                                        arr1.push(item2);
                                        return;
                                    }
                                })
                            })
                            setCatalogResources(arr1);
                            setFilteredResources(data.filter(x => !arr1.includes(x)));
                        }
                    })
                    .catch((err)=>setSnackbar(err.response?.data?.response_message || err.message,"error"))
            }catch (err) {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            }
        }
    }

    const getResources = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/resources/`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if(res.response_data){
                        res.response_data.map((item,i)=>{
                            item.id = i
                        })
                        setAllResources(res.response_data);
                        setTempArray(res.response_data)
                    }
                    getCatalogResources(res.response_data);
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    const onSelectedListChange = (newSelectedList)=> {
        setSelected(newSelectedList);
    }

    const onSelectedListChange2 = (newSelectedList)=> {
        setSelected2(newSelectedList);
    }

    const onSelectionModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedListChange(allResources.filter((row) => newSelectionModel.includes(row.id)));
    });

    const onSelectionModelChange2 = useCallback((newSelectionModel) => {
        setSelectionModel2(newSelectionModel.selectionModel);
        onSelectedListChange2(allResources.filter((row) => newSelectionModel.includes(row.id)));
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

    const handleTabChange = (e,newValue) => {
        if(newValue==="Resources"){
            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/resources`)
        }
    };
    const columns = [
        {
            field: "type",
            headerName: "Resource",
            width: 400
        },
        {
            field: "resource_id",
            headerName: "Resource ID",
            width: 300
        }
    ];

    return(
        <div>
            <div style={{height:"400px"}}>
                <Typography variant="h4">Catalog Resources </Typography>
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
                    {
                        access &&
                        <div>
                            <Button
                                color="error"
                                onClick={handleDelete}
                                disabled={!selected.length}
                                startIcon={<DeleteIcon/>}
                                variant={"contained"}
                            >
                                Delete
                            </Button>
                        </div>
                    }

                    <Button
                        align="center"
                        onClick={getResources}
                        startIcon={<RefreshIcon align="center"/>}
                        sx={{color: "#808080"}}
                    />
                </div>
                <DataGrid
                    checkboxSelection={access}
                    columns={columns}
                    disableSelectionOnClick
                    onSelectionModelChange={onSelectionModelChange}
                    pageSize={5}
                    rows={catalogResources}
                    rowsPerPageOptions={[5]}
                    selectionModel={selectionModel}
                />
                <Typography variant="h4" style={{paddingTop:"1rem"}}>Add Resources </Typography>
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
                    {
                        access &&
                        <div>
                            <Button
                                color="primary"
                                disabled={!selected2.length}
                                onClick={handleAdd}
                                startIcon={<AddIcon/>}
                                variant={"contained"}
                                style={{marginRight:"0.5rem"}}
                            >
                                Add
                            </Button>
                        </div>
                    }

                    <Button
                        align="center"
                        onClick={getResources}
                        startIcon={<RefreshIcon align="center"/>}
                        sx={{color: "#808080"}}
                    />
                </div>
                <DataGrid
                    checkboxSelection={access}
                    columns={columns}
                    disableSelectionOnClick
                    onSelectionModelChange={onSelectionModelChange2}
                    pageSize={5}
                    rows={filteredResources}
                    rowsPerPageOptions={[5]}
                    selectionModel={selectionModel2}
                />
                <div align="right" style={{padding:"1rem 0"}}>
                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
