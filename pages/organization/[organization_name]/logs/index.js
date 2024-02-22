// import Logs from "../../../../components/Logs";
import {getDetails} from "../../../../utils/fetch-util";
import {hostport} from "../../../../next.config";
import React, {useCallback, useEffect, useState} from "react";
import router, {useRouter} from "next/router";
import { Suspense, lazy } from 'react';
import {PushSpinner} from "react-spinners-kit";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import {Typography} from "@material-ui/core";
import Loading from "../../../../components/Loading";

const Logs = lazy(() => import('../../../../components/Logs'));

export default function iplogs() {
    const router = useRouter()
    const [organizationName, setOrganizationName] = useState(router.query.organization_name)

    const [
        logData,
        setLogData
    ] = useState([])

    useEffect(() => {
        setOrganizationName(router.query.organization_name)
            getIpLogs()
    }, [router])

    const getIpLogs = useCallback(() => {
        let org = router.query.organization_name
        if (org !== undefined) {
            let url = `${hostport}/api/v1/organizations/${org}/activityLogs`
            getDetails(url, "", "", "")
                .then((res) => {
                    let responseData = res.response_data
                    if (res.response_data!==null){
                        for (let i = 0; i < res.response_data.length; i++) {
                            responseData[i].id = i
                        }
                        setLogData(res.response_data)
                    }
                })
        }
    })

    useEffect(() => {
        getIpLogs()
    }, [router])

    const styles = {
        flex:{
            display:'flex',
            justifyContent:'center',
            alignItems: "center",
            height:464
        }
    }

    return (
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
                    Logs
                </Typography>
            </div>
            <Logs logData={logData}/>
        </Suspense>
    )
}
