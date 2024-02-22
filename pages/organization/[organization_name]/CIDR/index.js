import * as React from 'react';
import {DataGrid, GridAddIcon} from '@material-ui/data-grid';
import {Button, ButtonBase} from "@material-ui/core";
import {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {hostport} from "../../../../next.config";
import {getDetails} from "../../../../utils/fetch-util";
import {Refresh} from "@material-ui/icons";
import Can from "../../../../lib/Can";
import AddIcon from "@material-ui/icons/Add";
import {AuthContext} from "../../../../lib/authContext";
import {SnackbarContext} from "../../../../lib/toaster/SnackbarContext";
import CloudIcon from "@mui/icons-material/Cloud";
import {Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DataGridComponent from "../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";

export default function CIDR() {

    const { setSnackbar } = useContext(SnackbarContext);
    const [node, setNode] = useState("")
    const [projectCIDR, setProjectCIDR] = useState([])
    const [isProjectCIDRLoading,setIsProjectCIDRLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const {userData} = useContext(AuthContext);

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    const columns = [
        {
            field: 'node_pool',
            headerName: 'Pool',
            width: 150,
            renderCell: (params) => {
                return (
                    <Link
                        onClick={() => {
                            setNode(params.value)
                            setOpen(true)
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
        },
        {
            field: 'tags',
            headerName: 'Tags',
            width: 250,
        },
        {
            field: 'cloud',
            headerName: 'Cloud',
            width: 250,
        }
    ];

    const projectcolumns = [
        {
            field: "primary_ip",
            headerName: "Primary ip",
            width: 180

        },
        {
            field: "secondary_ip",
            headerName: "Secondary ip",
            width: 180
        },
        {
            field: "project",
            headerName: "Project",
            width: 180
        }
    ];


    const router = useRouter()
    const organizationName = router.query.organization_name

    const handleCreate = useCallback(() => {
        router.push(`/organization/${organizationName}/CIDR/create`);
    })

    const [rows, setRows] = useState([])

    const getCIDR = useCallback(async () => {
        setIsProjectCIDRLoading(true);
        let getcidr = `${hostport}/api/v1/organizations/${organizationName}/cidr/`
        await getDetails(getcidr, "", "", "", "")
            .then((res) => {
                if (res.response_data) {
                    setRows(res.response_data)
                    setRows(res.response_data)
                    let cidrofanode = []
                    cidrofanode = res.response_data.filter((e) => e.id === `organization/${organizationName}/${node}`)
                    if(cidrofanode.length > 0) {
                        cidrofanode[0].cidr.map((e,i) => {
                            e.id = i
                            e.project = e.project_id.split("/")[3]
                        })
                        setProjectCIDR(cidrofanode[0].cidr)
                    }else{
                        setProjectCIDR([])
                    }
                }
                setIsProjectCIDRLoading(false);
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
                setIsProjectCIDRLoading(false);
            })
    }, [router,node])

    const handleRefresh = useCallback(() => {
        getCIDR()
    })

    const handleBack = useCallback(() => {
        setOpen(false)
    })

    useEffect(() => {
        if(organizationName){
            getCIDR()
        }
    }, [router,node,organizationName])

    const canYes = useCallback(() => (
        <>
            <Button
                startIcon={<Refresh/>}
                onClick={handleRefresh}
                size={"small"}
            />
            <Button
                startIcon={<GridAddIcon/>}
                onClick={handleCreate}
                size={"small"}
                variant={"contained"}
            >
                create
            </Button>
        </>
    ));

    const canNo = useCallback(() => (
        <Button
            startIcon={<Refresh/>}
            onClick={handleRefresh}
        />
    ));

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
                    {
                        (!open && userInfo) &&
                        <Can
                            no={canNo}
                            perform="write"
                            role={userInfo.identity.id}
                            yes={canYes}
                        />
                    }
                    {
                        open &&
                        <Button onClick={handleBack}>
                            cancel
                        </Button>
                    }
                </div>
            </div>
            { !open ?
                <div style={{height: "65vh", width: '100%'}}>
                    <DataGridComponent
                        height={"100%"}
                        rows={rows}
                        columns={columns}
                        pageSize={rows.length}
                        disableSelectionOnClick
                        loading={isProjectCIDRLoading}
                        // style={{
                        //     backgroundColor:"#fafbfb",borderRadius:"0.5rem"
                        // }}
                    />
                </div> : <div style={{height: "65vh", width: '100%'}}>
                    <DataGridComponent
                        height={"100%"}
                        rows={projectCIDR}
                        columns={projectcolumns}
                        pageSize={projectCIDR.length}
                        disableSelectionOnClick
                        loading={isProjectCIDRLoading}
                        // style={{
                        //     backgroundColor:"#fafbfb",borderRadius:"0.5rem"
                        // }}
                    />
                </div>
            }
        </div>
    );
}