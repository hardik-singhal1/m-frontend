import {Button, Typography} from "@mui/material";
import {DataGrid} from "@material-ui/data-grid";
import {hostport} from "../../../../../../../../next.config";
import {getDetails} from "../../../../../../../../utils/fetch-util";
import ProjectLayout from "../../../../../../../../components/project/ProjectLayout";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudIcon from '@mui/icons-material/Cloud';
import { Icon } from '@iconify/react';
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import AddIcon from "@material-ui/icons/Add";
import Can from "../../../../../../../../lib/Can";
import {AuthContext} from "../../../../../../../../lib/authContext";
import DataGridComponent from "../../../../../../../../components/DataGridComponent";

export default function PullRequests() {

    const [isloading,setisloading] = useState(false);

    const [
        rows,
        setRows
    ] = useState([]);

    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environmentName = router.query.environment_name;

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 180

        },
        {
            field: "tag",
            headerName: "Tag",
            width: 300
        },
        {
            field: "network_cidr",
            headerName: "Network CIDR",
            width: 180
        },
        {
            field:"master_node_pool",
            headerName:"MASTER NODE POOL",
            width:250
        }
    ];

    const getCIDR = useCallback(() => {
        let cidr = `${hostport}/api/v1/organizations/${organizationName}/cidr/projects/${projectName}`
        try {
            setisloading(true);
            getDetails(cidr, "","","","")
                .then((res) => {
                    if(res.response_data) {
                        res.response_data.map((e,i) => {
                            e.node = e.id
                            e.id = i+1
                        })
                        setRows(res.response_data)
                    }else {
                        setRows([])
                    }
                    setisloading(false);
                })
                .catch((err) => {
                    setisloading(false);
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    })

    useEffect(() => {
        if(router.isReady){
            getCIDR()
        }
    },[router])

    const refresh = useCallback(() => {
        getCIDR()
    });

    const handleClickOpenCidr = () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/CIDR/create`)
    };

    function canCreate(){
        return(
            <Button onClick={handleClickOpenCidr} startIcon={<AddIcon/>} variant={"contained"} size={"small"}>
                create
            </Button>
        )
    }


    const {userData} = useContext(AuthContext);

    const [userInfo, setuserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setuserInfo(userData)
        }
    }, [userData])

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <CloudIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        CIDR
                    </Typography>
                </div>
                <div>
                    <Button
                        align="center"
                        onClick={refresh}
                        startIcon={<RefreshIcon align="center" />}
                        sx={{ color: "#808080" }}
                        size={"small"}
                    />
                    {
                        userInfo &&
                        <Can
                            perform="write_module"
                            role={userInfo.identity.id}
                            yes={canCreate}
                        />
                    }
                </div>
            </div>
            <div style={{height: "60vh", width: "100%"}}>
                <DataGridComponent
                    columns={columns}
                    height={"100%"}
                    loading={isloading}
                    rows={rows}
                    // search={search}
                    width="100%"
                    pageSize={rows !== null ? rows.length : 0}
                />
                {/*<DataGrid*/}
                {/*    columns={columns}*/}
                {/*    disableSelectionOnClick*/}
                {/*    pageSize={rows !== null ? rows.length : 0}*/}
                {/*    rows={rows}*/}
                {/*    rowsPerPageOptions={[5]}*/}
                {/*    style={{*/}
                {/*        backgroundColor:"#fafbfb",borderRadius:"0.5rem"*/}
                {/*    }}*/}
                {/*/>*/}
            </div>
        </div>
    );
}
