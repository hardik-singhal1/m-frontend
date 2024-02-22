import React, {Suspense, lazy, useCallback, useEffect, useState} from "react";
import {getDetails} from "../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../next.config";
import {useRouter} from "next/router";
import {PushSpinner} from "react-spinners-kit";
import ProjectLayout from "../../../../../../../../components/project/ProjectLayout";
import {Button, Typography} from "@material-ui/core";
import Loading from "../../../../../../../../components/Loading";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const Logs = lazy(() => import('../../../../../../../../components/Logs'));

export default function projlogs() {
    const router = useRouter()
    const [organizationName,setOrganizationName]=useState(router.query.organization_name)
    const [projectName,setProjectName]=useState(router.query.project_name)

    useEffect(()=>{
        setOrganizationName(router.query.organization_name)
        setProjectName(router.query.project_name)
        getIpLogs()
    },[router])

    const [
        logData,
        setLogData
    ] = useState([])

    const getIpLogs=useCallback(()=>{
        let org = router.query.organization_name
        let project = router.query.project_name
        let url=`${hostport}/api/v1/organizations/${org}/projects/${project}/activityLogs`
        if(org!==undefined){
        getDetails(url,"","","")
            .then((res)=>{
                let responseData = res.response_data
                for (let i = 0; i < res.response_data.length; i++) {
                    responseData[i].id = i
                }
                setLogData(res.response_data)
            })}
    })

    useEffect(() => {
        getIpLogs()
    },[])

    const styles = {
        flex:{
            display:'flex',
            justifyContent:'center',
            alignItems: "center",
            height:464
        }
    }

    return (
        <div>
            <Suspense fallback={
                <div style={styles.flex}>
                    <div>
                        <Loading />
                    </div>
                </div>
            }>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <EqualizerIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Project Logs
                    </Typography>
                </div>
                <div style={{backgroundColor:"#fafbfb",borderRadius:"0.5rem",height:"65vh"}}>
                    <Logs logData={logData}/>
                </div>
            </Suspense>
        </div>
    )
}
