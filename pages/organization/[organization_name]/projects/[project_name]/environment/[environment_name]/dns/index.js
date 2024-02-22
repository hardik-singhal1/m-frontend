import DnsIcon from "@mui/icons-material/Dns";
import {Typography} from "@material-ui/core";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";
import Card from "@mui/material/Card";
import Divider from "@material-ui/core/Divider";
import React, {useContext, useEffect, useState} from "react";
import {hostport} from "../../../../../../../../next.config";
import {getDetails} from "../../../../../../../../utils/fetch-util";
import {SnackbarContext} from "../../../../../../../../lib/toaster/SnackbarContext";


export default function dnsPage(){
    const { setSnackbar } = useContext(SnackbarContext);
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environmentName = router.query.environment_name;

    const [changeRequestDetails, setChangeRequestDetails] = useState(null);

    const STATE = {
        PENDINGFIRSTAPPROVAL: 0,
        PENDINGSECONDAPPROVAL: 1,
        CLOSEDWITHCOMMENTS: 2,
        CLOSED: 3,
        APPROVEDANDCLOSED: 4,
        UNKNOWN: 5
    }

    const dummy_data=
        {
            cf_value:'192.392.211.32',
            cf_type:'A',
            cf_domain:'devsecops',
            cf_name:'mpaas'
        }

    function getChangeRequest() {
        const getChangeRequestDetails = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/workflow/details`;
        getDetails(getChangeRequestDetails, "", "", "", "")
            .then(r => {
            if (r !== null) {
                if (r.state === STATE.UNKNOWN) {
                    setChangeRequestDetails(null)
                } else {
                    setChangeRequestDetails(r);
                }
            }
        })
            .then(

            )
    }

    console.log(changeRequestDetails)

    useEffect(() => {
        if (router.isReady) {
            getChangeRequest();
        }
    }, [router]);

    return(
        <div>
            <div style={{height: "80vh",}}>
                <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                    <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                        <DnsIcon style={{color:"navy"}}/>
                        <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                            DNS
                        </Typography>
                    </div>
                    <Button size={"small"} variant={"contained"} onClick={()=>{
                        if(changeRequestDetails!==null){
                            setSnackbar("A Pull Request already exists","error")
                        }else{
                            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/dns/create`)
                        }
                    }}>
                        Create
                    </Button>
                </div>
                <div style={{height:'65vh',overflow:"auto",backgroundColor:"#f5f5f5",paddingLeft:"1rem",borderRadius:"16px",display:'flex',flexDirection:'column',gap:'1rem'}}>
                    {changeRequestDetails?.cloud_flare_details?.zone_id?
                        <div style={{padding:'2rem 2rem 0rem 2rem'}}>
                            <Typography fontSize={'1.2rem'}>
                                <b>Cloudflare record mapping requested by: </b>{changeRequestDetails?.raised_by?.name}
                            </Typography>
                            <br/>
                            <Divider/>
                            <br/>
                            <Card elevation={0} style={{padding:"1.5rem",height:"10rem",width:"32rem",boxShadow:'rgb(145 158 171 / 20%) 0px 0px 2px 0px'}}>
                                <Typography fontSize={'1.2rem'}>
                                    <b>Domain:</b> {changeRequestDetails?.cloud_flare_details?.zone_id}
                                </Typography>
                                <Typography fontSize={'1.2rem'}>
                                    <b>Name:</b> {changeRequestDetails?.cloud_flare_details?.name}
                                </Typography >
                                <Typography fontSize={'1.2rem'}>
                                    <b>Type:</b> {changeRequestDetails?.cloud_flare_details?.record_type}
                                </Typography>
                                <Typography fontSize={'1.2rem'}>
                                    <b>Value:</b> {changeRequestDetails?.cloud_flare_details?.value}
                                </Typography>
                            </Card>
                            <div style={{display:'flex',flexDirection:"column",gap:'10px',padding:"0.5rem",height:"10rem",width:"32rem",justifyContent:"start",alignItems:'center'}}>
                                <div style={{margin:"0 1rem", height:'1rem',width:'2px'}}>
                                    <Divider style={{borderRadius:'1rem'}} orientation={"vertical"} color={"navy"}/>
                                </div>
                                <div style={{margin:"0 1rem", height:'1rem',width:'2px'}}>
                                    <Divider style={{borderRadius:'1rem'}} orientation={"vertical"} color={"navy"}/>
                                </div>
                                <div style={{margin:"0 1rem", height:'1rem',width:'2px'}}>
                                    <Divider style={{borderRadius:'1rem'}} orientation={"vertical"} color={"navy"}/>
                                </div>
                                <div style={{paddingTop:'0.4rem'}}>
                                    <Button variant={"contained"} onClick={()=>router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/pullrequests`)}>Go to approval</Button>
                                </div>
                            </div>
                        </div>
                        :
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                            <Typography variant={"h5"} style={{marginRight: "0.5rem"}} sx={{fontFamily:`"Public Sans", sans-serif`}}> No requests</Typography>
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}
