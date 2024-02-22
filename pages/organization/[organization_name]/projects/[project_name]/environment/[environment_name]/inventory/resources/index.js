import {useRouter} from "next/router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {hostport} from "../../../../../../../../../../../next.config";
import {deleteDetails, getDetails, updateDetails} from "../../../../../../../../../../../utils/fetch-util";
import {ErrorContext} from "../../../../../../../../../../../lib/errorContext";
import InfoIcon from "@mui/icons-material/Info";
import {DataGrid, GridOverlay} from "@material-ui/data-grid";
import {
    alpha,
    Button,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider,
    LinearProgress,
    TextField
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import makeStyles from "@material-ui/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import ProjectLayout from "../../../../../../../../../../../components/project/ProjectLayout";
import {DialogContent, ListItem} from "@mui/material";
import Chip from "@mui/material/Chip";
import Can from "../../../../../../../../../../../lib/Can";
import {AuthContext} from "../../../../../../../../../../../lib/authContext";
import {SnackbarContext} from "../../../../../../../../../../../lib/toaster/SnackbarContext";


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


export default function resource(){
    const classes = useStyles();
    const router = useRouter();
    const {resource,organization_name,project_name,id}=router.query;
    const {userData} = useContext(AuthContext);
    const [userInfo, setUserInfo]  = useState(userData)
    const { setSnackbar } = useContext(SnackbarContext);
    const handleDialogCloseInfo = useCallback(() => {
        setInfoTrigger(false);
    }, [router]);
    const [
        info,
        setInfo
    ] = useState(null)

    const [
        infoTrigger,
        setInfoTrigger
    ] = useState(false)
    const [
        searchRows,
        setSearchRows
    ] = React.useState("");
    const [
        searchFilteredRows,
        setSearchFilteredRows
    ] = React.useState("");

    const [
        selectedCatalog,
        setSelectedCatalog
    ] = React.useState([]);

    const [
        selectedFilteredCatalog,
        setSelectedFilteredCatalog
    ] = React.useState([]);


    const [tempArray, setTempArray] = useState([])
    const [filteredTempArray, setFilteredTempArray] = useState([])
    const [resourceData,setResourceData]=React.useState({});
    const [
        resourceCatalogRows,
        setResourceCatalogRows
    ] = React.useState([]);
    const [
        filteredResourceCatalogRows,
        setFilteredResourceCatalogRows
    ] = React.useState([]);

    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);

    const [
        selectionFilteredModel,
        setFilteredSelectionModel
    ] = useState([]);

    const handleClose = useCallback(() => {
        router.push(`/organization/${organization_name}/projects/${project_name}/environment/DEV/inventory/resources`);
    }, [router]);

    function onSelectedListChange(newSelectedList) {
        setSelectedCatalog(newSelectedList);
    }

    function onSelectedFilteredListChange(newSelectedList) {
        setSelectedFilteredCatalog(newSelectedList);
        setSelectedFilteredCatalog(newSelectedList);
    }

    function onSelectionModelChange(newSelectionModel){
        setSelectionModel(newSelectionModel.selectionModel);
        onSelectedListChange(resourceCatalogRows.filter((row) => newSelectionModel.includes(row.id)));
    }

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <LinearProgress/>
                </div>
            </GridOverlay>
        );
    }


    const getResourceData = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/resources/${id}`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if(res.response_data) {
                        setResourceData(res.response_data);
                        getCatalog(res.response_data);
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }

    const getCatalog = (item) => {
        try{
            const url=`${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/catalogs`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    let data1=[];
                    let data2=[];
                    if(item !== undefined){
                        console.log(res.response_data,item)
                        if(!item.application_catalog || !item.application_catalog.length){
                            setResourceCatalogRows([])
                            setFilteredResourceCatalogRows(res.response_data);
                            setFilteredTempArray(res.response_data);
                        }else{
                            res.response_data.map((items)=>{
                                if(item.application_catalog.includes(items.id)){
                                    data1.push(items);
                                }else{
                                    data2.push(items);
                                }
                            })
                            setResourceCatalogRows(data1);
                            setTempArray(data1);
                            setFilteredResourceCatalogRows(data2);
                            setFilteredTempArray(data2);
                        }
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        }catch(err){
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    const AddCatalog=(tempCatalog)=>{
        const url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/catalogs/Mapresource`;
        let payload={
            "resource":[resourceData["resource_id"]],
            "application_catalog":tempCatalog,
            "organization_id":`organizations/${organization_name}`
        }
        updateDetails(url, "", payload, "", "")
            .then((res) => {
                setSnackbar(res.response_message,"success");
                getResourceData();
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            });
    }

    const DeleteCatalog = (tempCatalog) => {
        const url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/catalogs/DeleteMapresource`;
        let payload={
            "resource":[resourceData["resource_id"]],
            "application_catalog":tempCatalog,
            "organization_id":`organizations/${organization_name}`
        }
        updateDetails(url, "", payload)
            .then((res) => {
                setSnackbar(res.response_message,"success");
                getResourceData()
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            });
    }

    const handleDelete = useCallback(() => {
        try {
            let tempCatalog = [];
            if(resourceData.application_catalog){
                selectedCatalog.forEach((item)=> {
                    tempCatalog.push(item.id);
                })
                DeleteCatalog(tempCatalog);
            }
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
        setSelectionModel([]);
        setSelectedCatalog([]);
    }, [
        selectedCatalog,
        organization_name,
        project_name
    ]);

    const handleAdd = useCallback(() => {
        try {
            let tempCatalog = [];
            if(resourceData.application_catalog){
            selectedFilteredCatalog.forEach((item)=> {
                tempCatalog.push(item.id);
            })
                AddCatalog(tempCatalog);
            }
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
        setFilteredSelectionModel([]);
        setSelectedFilteredCatalog([]);
    }, [
        selectedFilteredCatalog,
        organization_name,
        project_name
    ]);

    const refresh = useCallback(() => {
        getResourceData();
    });


    useEffect(() => {
        if(router.isReady) {
           getResourceData();
        }
    },[router])

    useEffect(() => {
        setResourceCatalogRows(tempArray)
        let filter = tempArray.filter((e) => (e.name.includes(searchRows)))
        setResourceCatalogRows(filter)
    }, [searchRows])

    useEffect(() => {
        setFilteredResourceCatalogRows(filteredTempArray)
        let filter = filteredTempArray.filter((e) => (e.name.includes(searchFilteredRows)))
        setFilteredResourceCatalogRows(filter)
    }, [searchFilteredRows])


    const columns = [
        {
            field: "name",
            headerName: "Name",
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

    function handleAddCatalog() {
        return (
            <Button
                color="primary"
                disabled={!selectedFilteredCatalog.length}
                startIcon={<AddIcon/>}
                onClick={() => handleAdd()}
                variant={"contained"}
                style={{marginRight:"0.5rem",marginBottom:"0.5rem"}}
            >
                Add
            </Button>
        )
    }

    function handleDeleteCatalog(){
        return (
            <Button
                color="error"
                disabled={!selectedCatalog.length}
                startIcon={<DeleteIcon/>}
                onClick={() => handleDelete()}
                variant={"contained"}
                style={{marginRight:"0.5rem",marginBottom:"0.5rem"}}
            >
                Delete
            </Button>
        )
    }

    useEffect(() => {
        setUserInfo(userData)
    },[userData])

    return(
        <div>
        <div>
            <Typography variant="h4">Resource Catalogs</Typography>
            <br/>
            {
                <div style={{
                    height: 400,
                    width: "100%"
                }}
                >
                    <div style={{
                        height: 400,
                        width: "100%"
                    }}
                    >
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setSearchRows(e.target.value)
                                        }}
                                        variant={"standard"}
                                        placeholder="Search…"
                                        size={"small"}
                                        style={{width: 300}}
                                    />
                                </div>

                            </div>
                            {
                                (userInfo && organization_name !== undefined) &&
                                <Can
                                    perform={"write_module"}
                                    role={userInfo ? userInfo.identity.id : ""}
                                    yes={handleDeleteCatalog}
                                />
                            }
                            <Button
                                align="center"
                                onClick={refresh}
                                startIcon={<RefreshIcon align="center"/>}
                                sx={{color: "#808080"}}
                            />
                        </div>
                        <DataGrid
                            checkboxSelection
                            columns={columns}
                            onSelectionModelChange={onSelectionModelChange}
                            pageSize={5}
                            rows={resourceCatalogRows}
                            rowsPerPageOptions={[5]}
                            selectionModel={selectionModel}
                            components={{
                                LoadingOverlay: CustomLoadingOverlay,
                            }}
                        />
                        <br/>
                        <Divider/>
                        <br/>
                        <Typography variant="h4">Add Catalogs</Typography>
                        <br/>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div className={classes.root}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <TextField
                                        onChange={(e) => {
                                            setSearchFilteredRows(e.target.value)
                                        }}
                                        variant={"standard"}
                                        placeholder="Search…"
                                        size={"small"}
                                        style={{width: 300}}
                                    />
                                </div>
                            </div>
                            {
                               (userInfo && organization_name !== undefined) &&
                                <Can
                                    perform={"write_module"}
                                    role={userInfo ? userInfo.identity.id : ""}
                                    yes={handleAddCatalog}
                                />
                            }
                            <Button
                                align="center"
                                onClick={refresh}
                                startIcon={<RefreshIcon align="center"/>}
                                sx={{color: "#808080"}}
                            />
                        </div>
                        <DataGrid
                            checkboxSelection
                            columns={columns}
                            onSelectionModelChange={(newSelectionModel) => {
                                setFilteredSelectionModel(newSelectionModel.selectionModel);
                                onSelectedFilteredListChange(filteredResourceCatalogRows.filter((row) => newSelectionModel.includes(row.id)));
                            }
                            }
                            pageSize={5}
                            rows={filteredResourceCatalogRows}
                            rowsPerPageOptions={[5]}
                            selectionModel={selectionFilteredModel}
                            components={{
                                LoadingOverlay: CustomLoadingOverlay,
                            }}
                        />
                        <br/>
                        <div align="right">
                            <Button
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <br/>
                            <br/>
                        </div>
                        <div>{
                            info &&
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                onClose={handleDialogCloseInfo}
                                open={infoTrigger}
                            >
                                <DialogTitle width="250px" height="100px" id="alert-dialog-title">{(info.row && info.row.name) && info.row.name}
                                    <Divider/>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <paper>
                                            {info.row.technology_details.map((data) => {
                                                return (
                                                    <ListItem key={data}>
                                                        <Chip
                                                            label={data}
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                            <br/>
                                        </paper>
                                    </DialogContentText>
                                </DialogContent>
                            </Dialog>
                        }</div>
                    </div>
                </div>
            }
        </div>
        </div>
    )
}
