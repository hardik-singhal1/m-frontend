import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {hostport} from "../../../../../next.config";
import {getDetails} from "../../../../../utils/fetch-util";
import Typography from "@material-ui/core/Typography";
import DataGridComponent from "../../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";
import moment from "moment";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import {Button} from "@material-ui/core";

const Tickets = () => {
    const router = useRouter();
    const [organizationName,setOrganizationName] = useState("");
    const [loading,setLoading] = useState(false);
    const [rows,setRows] = useState([]);
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name)
        }
    },[router])

    useEffect(()=>{
        if(organizationName){
            getTickets();
        }
    },[organizationName])

    const getTickets = () =>{
        setLoading(true)
        let url=`${hostport}/api/v1/organizations/${organizationName}/tickets`;
        getDetails(url,"","","","","")
            .then((res)=>{
                setRows(res.response_data);
                setLoading(false)
            }).catch((err)=>{
                setLoading(false)
        })
    }

    const columns = [
        {
            field: "id",
            headerName: "id",
            sortable: false,
            width: 100,

        },
        {
            field: "subject",
            headerName: "subject",
            sortable: false,
            width: 500,
        },
        {
            field: "status",
            headerName: "status",
            sortable: false,
            width: 100,
        }
    ]
    return (
        <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:"1rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <Typography variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,paddingLeft:"0.5rem"}}>Tickets</Typography>
                </div>
                <div>
                    <Button
                        align="center"
                        size={"small"}
                        variant={"outlined"}
                        onClick={()=>router.push(`/organization/${organizationName}/help`)}
                        disableElevation={true}
                    >Back</Button>
                </div>
            </div>
            <div style={{height:"70vh"}}>
                <DataGridComponent
                    columns={columns}
                    height={"100%"}
                    loading={loading}
                    rows={rows}
                    width="100%"
                    pageSize={7}
                />
            </div>
        </div>

    );
};

export default Tickets;
