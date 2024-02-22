import React, {useContext, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {useRouter} from "next/router";
import ProjectsList from "../../../../components/Profile/Projects";
import SelfInfo from "../../../../components/Profile/SelfInfo";
import {getDetails} from "../../../../utils/fetch-util";
import {hostport} from "../../../../next.config";
import {ErrorContext} from "../../../../lib/errorContext";
import Chip from "@mui/material/Chip";
import {CircularProgress, ListItem} from "@mui/material";

export default function ProfileSet() {
    const { errorTrigger } = useContext(ErrorContext);
    const [projectsResponse,setProjectsResponse]=useState([]);
    const router = useRouter();
    const [roles,setRoles]=useState([]);
    const [organizationName,setOrganizationName]=useState("");
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    useEffect(()=>{
        if(organizationName){
            getProfile();
        }
    },[organizationName])

    const getProfile = async() => {
        setLoading(true);
        try{
            const url = `${hostport}/api/v1/organizations/${organizationName}/userprofile`;
            let data =await getDetails(url, "", "", "", "")
            let arr=[];
            if(data?.response_data?.Roles!==null){
                setRoles(data.response_data.Roles);
            }
            data?.response_data?.Projects?.map((item)=>{
                let obj={};
                obj.name=item.name;
                obj.env=item.tags.environment_request;
                obj.org=item.organization_id.slice(14);
                arr.push(obj);
            })
            setProjectsResponse(arr);
            setLoading(false);
        }
        catch(err){
            errorTrigger("error",JSON.stringify(err.message));
            setLoading(false);
        }
    }

    const loadingIcon = () =>{
        return(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>
                <CircularProgress />
            </div>
        )
    }

    const getRoles = () =>{
        return (
            <div style={{display:"flex",flexDirection:"column"}}>
                {
                    roles?.map((role)=>{
                        return(
                            <Chip label={role} color="primary" variant="outlined" key={role} style={{marginBottom:"0.5rem"}} />
                        )
                    })
                }
            </div>
        )
    }


    return (
        <div style={{width:"100%",height:"83vh",display:"flex",flexWrap:"wrap"}}>
            <div style={{width:"30%",minWidth:"350px",display:"flex",justifyContent:"center"}}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",height:"100%"}}>
                    <div>
                        <SelfInfo/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <h2 style={{ color: "grey"}}>Assigned Roles</h2>
                        {loading ? loadingIcon() : getRoles()}
                    </div>
                </div>
            </div>
            <Paper style={{width:"50%",minWidth:"350px"}}>
                <h2 style={{ color: "grey",width:"100%",textAlign:"center" }}>Your Ongoing Projects</h2>
                <ProjectsList projects={projectsResponse} loading={loading}/>
            </Paper>
        </div>
    );
}
