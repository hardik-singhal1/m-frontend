import {IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@material-ui/core/Box";
import RefreshIcon from "@mui/icons-material/Refresh";
import {Button} from "@material-ui/core";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import * as React from "react";
import {useEffect, useState} from "react";
import Router, {useRouter} from 'next/router';
import {useStream} from "react-fetch-streams";
import {hostport} from "../../../../../../../../../../next.config";
import http from "stream-http";
import ProjectLayout from "../../../../../../../../../../components/project/ProjectLayout";
import { SiTerraform } from "react-icons/si";
// import {Icon} from "@iconify/react/dist/iconify";
import playCircleFill from "@iconify/icons-eva/play-circle-fill";
import Typography from "@material-ui/core/Typography";


export default function LogPage({mainRef}) {

    const router = useRouter();
    const [logsState, setLogsState] = useState({
        logs: [],
        triggered: false
    });

    var AU = require('ansi_up');

    const Convert = require('ansi-to-html');
    const convert = new Convert({
        newline: true
    });
    const { project_name : projectName } = router.query;
    const { organization_name: organizationName } = router.query;
    const { environment_name: environmentName } = router.query;
    const { logs_number: logsNumber } = router.query;
    let unmounted = false;

    useEffect(() => {
        setLogsState({logs: [], triggered: true});
    }, [projectName, organizationName, environmentName]);

    useEffect(() => {
        return () => {
            evtSource?.close();
        };
    }, []);

    useEffect(() => {
        if (logsState.logs.length === 0 && logsState.triggered === true) {
            stream(`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/terraform/logs?id=${logsNumber}`);
        } else if (logsState.triggered === false && isAtBottom) {
            mainRef.scrollTop = mainRef.scrollHeight;
        }
    }, [logsState]);

    var evtSource;

    function stream(url) {
        const fetchParams = {withCredentials: true};
        evtSource?.close();
        evtSource = new EventSource(url, fetchParams);

        evtSource.addEventListener("logs", function (event) {
            let dataJs = JSON.parse(event.data);

            if (dataJs !== null && typeof dataJs !== "undefined") {
                setLogsState((prevState => {
                    return {logs: [...prevState.logs, ...dataJs], triggered: false};
                }));
            }
        }, false);

        evtSource.onerror = function (event) {
            evtSource?.close();
        }
    }

    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        if (mainRef) {
            mainRef.onscroll = e => {
                const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
                if (bottom && e.target.clientHeight) {
                    setIsAtBottom(true);
                } else {
                    setIsAtBottom(false);
                }
            }
        }
    }, [mainRef]);

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <SiTerraform style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Runs
                    </Typography>
                </div>
                <div>
                    <IconButton onClick={() => {
                        setLogsState({logs: [], triggered: true});
                    }} aria-label="refresh" sx={{marginRight: "20px"}}>
                        <RefreshIcon/>
                    </IconButton>
                    <Button onClick={()=>{
                        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs`)
                    }} variant="outlined" style={{marginRight:"0.5rem"}} size={"small"}>back</Button>
                </div>
            </div>
            <div style={{
                paddingTop: "30px",
                backgroundColor: "#24292f",
                fontFamily: "courier new",
                fontSize: "13px"
            }}
            >
                {
                    logsState.logs.map((v, i) =>
                        (
                            <div style={{
                                display: "flex",
                            }}>
                                <div key={i + "a"} style={{
                                    color: "rgb(140 149 159 / 75%)",
                                    paddingLeft: "50px",
                                    paddingRight: "20px"
                                }}
                                >{i}</div>
                                <div key={i} style={{
                                    color: "#d0d7de"
                                }} className="test" dangerouslySetInnerHTML={{__html: convert.toHtml(v)}}/>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}
