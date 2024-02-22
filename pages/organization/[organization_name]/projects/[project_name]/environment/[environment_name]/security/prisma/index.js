import Typography from "@material-ui/core/Typography";
import SecurityIcon from '@mui/icons-material/Security';
import React, {useContext, useEffect, useState} from "react";
import {Doughnut} from "react-chartjs-2";
import Card from "@mui/material/Card";
import Chart from 'chart.js/auto';
import {hostport} from "../../../../../../../../../next.config";
import {getDetails} from "../../../../../../../../../utils/fetch-util";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import {useRouter} from "next/router";
import CountUp from "react-countup";
import {Box} from "@mui/system";
import {Button} from "@material-ui/core";
import DataGridComponent from "../../../../../../../../../components/DataGridComponent";
import Loading from "../../../../../../../../../components/Loading";

export default function Prisma(){
    const [severity,setSeverity] = useState(null);
    const [alertDetails,setAlertDetails] = useState(null);
    const [loading,setLoading] = useState(false);
    const [rows,setRows] = useState([]);
    const [colors]=useState({
        "high":"#ea4545",
        "medium":"#de7c56",
        "low":"#dab317"
    })
    const columns=[
        {
            field: "resource_name",
            headerName: "Resource Name",
            width: 600
        },
        {
            field: "alert_id",
            headerName: "Alert Id",
            width: 150
        },
        {
            field: "type",
            headerName: "Type",
            width: 150
        },
        {
            field: "severity",
            headerName: "Severity",
            width: 150,
            renderCell: params => {
                return (
                    <Typography sx={{color:colors[alertDetails.severity]}}>{params.value}</Typography>
                )
            }
        },
            ]
    const prismaData = {
        labels: ["High","Medium","Low"],
        datasets: [
            {
                label: "Severity",
                data: severity,
                borderColor: "white",
                backgroundColor:["#ea4545","#de7c56","#dab317"],
                pointBackgroundColor: 'black',
                borderRadius: 5,
                hoverOffset: 5
            }
        ]
    }
    const prismaOptions = {
        cutout:75,
        onHover: (event, chartElement) => {
            const target = event.native ? event.native.target : event.target;
            target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        title: {
            display: true,
            text: "Chart Title"
        },
        plugins:{
            legend: {
                position: 'bottom',
                labels:{
                    usePointStyle:true,
                },
            }
        },
        // onClick: function(evt, element) {
        //     if(element.length > 0)
        //     {
        //         router.push(`/organization/${organizationName}/projects/?env=${Object.keys(info.env_request)[element[0].index]}`)
        //     }
        // }
    }
    const { setSnackbar } = useContext(SnackbarContext);
    const router = useRouter();
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName]= useState("");
    const [environmentName,setEnvironmentName] = useState("");
    const [policyDetails,setPolicyDetails] = useState(null);
    useEffect(()=>{
        if(alertDetails!==null){
            let temp=alertDetails.alter_details;
            temp.map((item,index)=>{
                item.id=index;
                item.type=alertDetails.type;
                item.severity=alertDetails.severity;
            })
            setRows(temp);
        }
    },[alertDetails])
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name);
            setEnvironmentName(router.query.environment_name);
        }
    },[router])
    useEffect(()=>{
        if(organizationName && projectName){
            getPrismaDetails();
        }
    },[organizationName,projectName]);
    const getPrismaDetails = () =>{
        setLoading(true);
        const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/dashboard/security`;
        getDetails(url, "", "", "", "")
            .then( res =>{
                setLoading(false);
                if(res){
                    setSeverity([res.severity_count.high,res.severity_count.medium,res.severity_count.low])
                    setPolicyDetails(res.policy_details)
                }
            })
            .catch((err)=>{
                setLoading(false);
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
    }
    return(
        loading ? <Loading /> :
        <div style={{height: "65vh",}}>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <SecurityIcon style={{color:"navy",width:"1.5rem",height:"1.5rem"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Prisma
                    </Typography>
                </div>
                <div>
                    {
                        alertDetails &&
                        <Button color="primary" onClick={()=>{
                            setAlertDetails(null)
                            setRows([]);
                        }} variant={"outlined"} size={"small"}>
                            Cancel
                        </Button>
                    }
                </div>
            </div>
            <div style={{height:'100%',overflow:"auto",backgroundColor: alertDetails!==null ? "White" : "#fafbfb",borderRadius:"0.5rem"}}>
                <div style={{padding:"0.5rem",height:"100%"}}>
                    <div style={{display:"flex",flexDirection:"row",gap:"1rem",height:"100%"}}>
                        {
                            severity &&
                            (
                                alertDetails===null ?
                                    <div style={{display:"flex",flexWrap:"wrap",width:"100%",justifyContent:"space-around"}}>
                                        <div style={{width:"29%"}}>
                                            <Card sx={{padding:"1rem",borderRadius:"16px",minWidth:"240px",height:"90%",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px;", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                                    <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}} style={{paddingBottom:"1rem",alignItems:"center"}}>Total Alerts</Typography>
                                                    <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"2rem"}} style={{paddingBottom:"1rem",alignItems:"center"}}><CountUp end={severity[0]+severity[1]+severity[2]} duration={0.5}/></Typography>
                                                </div>
                                                <Doughnut data={prismaData} options={prismaOptions}/>
                                            </Card>
                                        </div>
                                        <div style={{width:"69%",minWidth:"400px"}}>
                                            <Card sx={{padding:"1rem",borderRadius:"16px",minWidth:"240px",height:"90%",width:"100%",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px;", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                                    <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}} style={{paddingBottom:"0.5rem",alignItems:"center"}}>Incidents & Risks</Typography></div>
                                                <div style={{display:"flex"}}>
                                                    <Typography sx={{fontWeight:"600",width:"90%",color:"#8a8585"}}>Policy Type / Name</Typography>
                                                    <Typography sx={{fontWeight:"600",color:"#8a8585"}}>Alerts</Typography>
                                                </div>
                                                <div style={{overflow:"auto",height:"50vh",paddingBottom:"1rem"}}>
                                                    {
                                                        policyDetails &&
                                                        policyDetails.map((item)=>{
                                                            return <Box style={{display:"flex",padding:"0.3rem 0"}} sx={{cursor:"pointer",'&:hover, &:focus': {
                                                                    color: "#1c56de"
                                                                }}} onClick={()=>{
                                                                         setAlertDetails(item)
                                                            }}>
                                                                <div style={{width:"90%",display:"flex",alignItems:"flex-start",gap:"0.25rem"}}>
                                                                    <div style={{height:"1rem",width:"1rem",borderRadius:"0.5rem",backgroundColor:colors[item.severity],marginTop:"0.25rem"}} />
                                                                    <Typography sx={{fontFamily:`"Public Sans", sans-serif`}}>{item.name}</Typography>
                                                                </div>
                                                                <Typography sx={{fontFamily:`"Public Sans", sans-serif`}}><CountUp end={item.policy_count} duration={0.5}/>/<CountUp end={severity[0]+severity[1]+severity[2]} duration={0.5}/></Typography>
                                                            </Box>
                                                        })
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                    : <div style={{padding:"0.5rem",width:"100%"}}>
                                        <div>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <Typography sx={{fontWeight:"600",color:"black",fontFamily:`"Public Sans", sans-serif`}}>Name</Typography>
                                                    </td>
                                                    <td>
                                                        <Typography sx={{fontWeight:"600",color:"black",fontFamily:`"Public Sans", sans-serif`}}>:</Typography>
                                                    </td>
                                                    <td>
                                                        <Typography sx={{color:"black",fontFamily:`"Public Sans", sans-serif`}}>{alertDetails.name}</Typography>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div style={{paddingTop:"0.5rem",height:"88%",width:"100%"}}>
                                            <DataGridComponent
                                                columns={columns}
                                                pageSize={7}
                                                rows={rows}
                                                rowsPerPageOptions={[5]}
                                            />
                                        </div>
                                    </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
