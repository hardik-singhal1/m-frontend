import Typography from "@material-ui/core/Typography";
import CostDashboard from "../../../../../../../../components/dashboard/CostDashboard";
import ProjectLayout from "../../../../../../../../components/project/ProjectLayout";
import IamDashboard from "../../../../../../../../components/dashboard/IamDashboard";
import playCircleFill from '@iconify/icons-eva/play-circle-fill';
import {hostport, productname} from "../../../../../../../../next.config";
import Logo from "../../../../../../../../components/layout/Logo";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../../../../../../lib/authContext";
import {Divider} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import Card from "@mui/material/Card";
import CountUp from "react-countup";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { GrResources } from 'react-icons/gr';
import {Bar} from "react-chartjs-2";
import LayersIcon from "@mui/icons-material/Layers";
import {useRouter} from "next/router";
import {getDetails} from "../../../../../../../../utils/fetch-util";
import {SnackbarContext} from "../../../../../../../../lib/toaster/SnackbarContext";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import {Icon} from "@iconify/react";

function dashboard(){
    const { userData } = useContext(AuthContext);
    const { setSnackbar } = useContext(SnackbarContext);
    const router = useRouter();
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName]= useState("");
    const [environmentName,setEnvironmentName] = useState("");
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name);
            setEnvironmentName(router.query.environment_name);
        }
    },[router])
    useEffect(()=>{
        if(organizationName && projectName){
            getDashboardDetails();
        }
    },[organizationName,projectName]);
    const [resourceCount,setResourceCount] = useState(0);
    const [prActive,setPrActive] = useState(0);
    const [runs,setRuns] = useState(0);

    const getDashboardDetails = () =>{
        try{
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/projectdashboard`;
            getDetails(url, "", "", "", "")
                .then( res =>{
                    if(res){
                        setPrActive(res.response_data.active_PRs);
                        setRuns(res.response_data.runs);
                        setResourceCount(res.response_data.cloud_resources);
                    }
                })
                .catch((err)=>{
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                })
        }catch(err){
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }


    function card(name,total,percentage,time,filter,icon,color){
        return(
            <div style={{paddingTop:"1rem",width:"280px",minHeight:"150px"}}>
                <Card sx={{height:"100%",width:"100%",borderRadius:"12px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms','&:hover': {
                        boxShadow:"rgba(0, 0, 0, 0.25) 0px 25px 50px -12px", borderRadius:"12px"
                    }}} elevation={0}>
                    <div style={{position:"absolute"}}>
                        <div style={{position:"absolute",top:"-19px",left:"1.5rem",zIndex:9}}>
                            {/*<div style={{border:"1px solid",padding:"0 0.5rem",borderRadius:"0.2rem",color:"white",backgroundColor:"#f29b38",marginBottom:"0.5rem"}}>*/}
                            {/*    {filter}*/}
                            {/*</div>*/}
                            <div style={{height:"3.8rem",width:"3.8rem",borderRadius:"16px",backgroundColor:color,display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem"}}>
                                {icon}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",height:"100%",padding:"1.5rem",width:"100%",justifyContent:"space-between"}}>
                        <div style={{paddingTop:"2rem"}}>
                            {
                                typeof percentage === "number" && <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-start",width:"100%"}}>
                                        {percentage>=0 ? <ArrowUpwardIcon style={{fontSize:"1.1rem",color:"green"}}/> : <ArrowDownwardIcon style={{fontSize:"1.1rem",color:"red"}}/>}
                                        <Typography variant={"h7"} sx={{fontWeight:"400",fontFamily:`"Public Sans", sans-serif`}} color={"#8a8383"}>{percentage < 0 ? <span style={{color:"red"}}><CountUp end={Math.abs(percentage)} duration={0.5}/>%</span> : <span style={{color:"green"}}><CountUp end={Math.abs(percentage)} duration={0.5}/>%</span>}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant={"h7"} sx={{fontWeight:"400",fontFamily:`"Public Sans", sans-serif`}} color={"#8a8383"}>Since last {time}</Typography>
                                    </div>
                                </div>
                            }
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                            <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>{name}</Typography>
                            <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={total} duration={0.5}/></Typography>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
    function card1(name,total,percentage,time,filter,icon,color){
        return(
            <Card sx={{width:"40%",minWidth:"280px",minHeight:"150px",borderRadius:"12px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                <div style={{display:"flex",flexDirection:"row",height:"100%"}}>
                    <div style={{width:"70%",padding:"1.5rem"}}>
                        <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>{name}</Typography>
                        <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={total} duration={0.5}/></Typography>
                        {
                            typeof percentage === "number" && <div style={{display:"flex",alignItems:"center"}}>
                                {percentage>=0 ? <ArrowUpwardIcon style={{fontSize:"1.1rem",color:"green"}}/> : <ArrowDownwardIcon style={{fontSize:"1.1rem",color:"red"}}/>}
                                <Typography variant={"h7"} color={"#8a8383"}>{percentage < 0 ? <span style={{color:"red"}}><CountUp end={Math.abs(percentage)} duration={0.5}/>%</span> : <span style={{color:"green"}}><CountUp end={Math.abs(percentage)} duration={0.5}/>%</span>} Since last {time}</Typography>
                            </div>
                        }
                    </div>
                    <div style={{display:"flex",padding:"1.5rem",flexDirection:"column",alignItems:"center"}}>
                        <div style={{height:"4rem",width:"4rem",borderRadius:"50%",backgroundColor:color,display:"flex",justifyContent:"center",alignItems:"center"}}>
                            {icon}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
    const [projectValues,setProjectValues] = useState({
        Labels : [],
        Values : []
    })
    const data = {
        labels: projectValues.Labels,
        datasets: [
            {
                label: "Projects Created Per Month",
                data: projectValues.Values,
                fill: false,
                borderColor: "white",
                backgroundColor:["#241f1c","#937047","#e7dac7"]
            }

        ],
    };
    return (
            <div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center",marginBottom:"0.5rem"}}>
                    <DashboardIcon style={{color:"navy",width:"1.5rem",height:"1.5rem"}}/>
                    <Typography variant={"h5"} style={{marginLeft:"0.5rem"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Project Dashboard</Typography>
                </div>
                <div style={{width:"100%",height:"auto",display:"flex",backgroundColor:"#f5f5f5",padding:"1rem",borderRadius:"16px",flexWrap:"wrap",gap:"2rem"}}>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"}}>
                        <a onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/graph`)} style={{cursor:"pointer"}}>{card("Resources",resourceCount,"","month","Total",<LayersIcon style={{color:"white"}}/>,"#c878b7")}</a>
                        <a onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs`)} style={{cursor:"pointer"}}>{card("Runs",runs,"","day","Total",<Icon
                            height={"1.5rem"}
                            color={"white"}
                            icon={playCircleFill}
                            width={"1.5rem"}
                        />,"#00b0ae")}</a>
                        <a onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/pullrequests`)} style={{cursor:"pointer"}}>{card("PR",prActive,"","","Status",<Icon
                            height={"1.5rem"}
                            color={"white"}
                            icon={bxGitPullRequest}
                            width={"1.5rem"}
                        />,"#ffc667")}</a>
                    </div>
                    <div style={{width:"68%"}}>
                        <Card sx={{width:"100%",height:"100%",padding:"1rem",borderRadius:"16px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                                <Typography style={{paddingBottom:"1rem",alignItems:"center"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Cost Dashboard</Typography>
                            </div>
                            <CostDashboard/>
                        </Card>
                    </div>
                </div>
            </div>
    );

}

export default dashboard;
