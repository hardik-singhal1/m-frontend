import React, { useState, useCallback, useEffect, useContext} from 'react'
import { DataGrid } from '@material-ui/data-grid';
import {Button, Grid, Box, Typography, TextField, IconButton} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteDetails, getDetails} from '../../../../../utils/fetch-util';
import CreateCloudCredentials from '../../../../../components/CreateCloudCredentials';
import { Refresh } from '@mui/icons-material';
import {hostport} from "../../../../../next.config";
import {ErrorContext} from "../../../../../lib/errorContext";
import router, {useRouter} from "next/router";
import DataGridComponent from "../../../../../components/DataGridComponent";

export default function index({providers}) {

    const router = useRouter();

    const [create,setCreate] = useState(false)
    // const data = React.useState(providers.modules);
    const [providerslist, setProviderslist] = React.useState([]);
    const [rows,setRows] =useState([])
    const {errorTrigger} = useContext(ErrorContext)
    const [organizationName,setOrganizationName] = useState("");
    const [selected, setSelected] = useState([]);
    const columns = [
        { field: "id", headerName: "ID", width: 300 },
        { field: "name", headerName: "NAME", width: 300 },
        { field: "cloud", headerName: "CLOUD", width: 300 },
        { field: "time", headerName: "CREATED AT", width: 200 },
    ];
    const[response,setResponse] = useState({
        id:selected.id,
        cloud:selected.cloud,
    })



    const handleCreate = useCallback(() => {
        setCreate(true)
    },[])

    function converttojson(arr) {
        const orderInputObjects = [];
        arr.forEach(function (v, i) {
            if (i >= 0) orderInputObjects.push({ title: v });
        });
        return orderInputObjects;
    }
    //
    // function providersjson() {
    //     var arr = [];
    //     if(data[0]) {
    //         for (var i = 0; i < data[0].length; i++) {
    //                     if (
    //                         !arr.includes(data[0][i].provider) &&
    //                         data[0][i].provider != "opc" &&
    //                         data[0][i].provider != "alicloud"
    //                     ) {
    //                         arr.push(data[0][i].provider);
    //                     }
    //                 }
    //                 let providerselect = converttojson(arr);
    //                 setProviderslist(providerselect);
    //     }
    // }
    // useEffect(() => {
    //     providersjson()
    // }, [])
    const handleClose = useCallback(
        () => {
            setCreate(false)
            getCredentials()
        },
        [],
    )
    //
    // function onSelectedListChange(newSelectedList) {
    //     setSelected(newSelectedList);
    // }
    //
    // const onSelectCredentialsColumn =useCallback((newSelectionModel) => {
    //     onSelectedListChange(rows.filter((event) => newSelectionModel.includes(event.id)));
    // })

    const [loading,setLoading] = useState(false);

    const getCredentials = () => {
        try {
            setLoading(true);
            let Getcredentials =
                hostport +
                `/api/v1/organizations/${organizationName}/credentials/`;

            getDetails(Getcredentials, "","","","")
                .then((res) => {
                    setLoading(false);
                    if (res.response_data === null) {
                        setRows([]);
                    } else {
                        setRows(res.response_data);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err.message)
                });
        } catch (err) {
            console.log(err.message)
        }
    }

    // const handleDelete = useCallback(() => {
    //     for (var i = 0; i < selected.length; i++) {
    //         response.id = selected[i].id
    //         response.cloud = selected[i].cloud
    //         var deleteCredentials =
    //             hostport +
    //             `/api/v1/organizations/${organizationName}/credentials/`;
    //         deleteDetails(deleteCredentials, "","","", response)
    //             .catch((err) => {
    //                 errorTrigger("error", JSON.stringify(err));
    //             });
    //     }
    //     setSelected([]);
    //     getCredentials()
    //     getCredentials()
    // })

    useEffect(() => {
        if (router.isReady){
            console.log(router)
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    useEffect(()=>{
        if(organizationName){
            getCredentials();
        }
    },[organizationName])

    const handleRefresh =() => {
        getCredentials()
    }

    return (
        <div>
            <Grid>
                {create ?
                    <CreateCloudCredentials  value = {providerslist} close = {handleClose}/>
                    :
                    <div>
                        <div style = {{display:'flex' , flexDirection:'row',justifyContent:"space-between",marginBottom:"1rem"}}>
                            <div>
                                <Typography variant={"h5"} style={{marginLeft:"0.5rem"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Cloud</Typography>
                            </div>
                            <div>
                                <Button color='info' onClick={handleRefresh} size={"small"}><Refresh/></Button>
                                <Button onClick = {handleCreate} size={"small"} color={"info"} variant={"contained"}><AddIcon/>Add Credential</Button>
                            </div>
                         </div>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGridComponent
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[8]}
                                loading={loading}
                            />
                        </div>
                    </div>}

            </Grid>
        </div>
    )
}
