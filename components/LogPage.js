import {IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@material-ui/core/Box";
import RefreshIcon from "@mui/icons-material/Refresh";
import {Button} from "@material-ui/core";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import * as React from "react";
import Router, {useRouter} from 'next/router';
import Convert from "ansi-to-html";
import {useCallback, useEffect, useState} from "react";
import {hostport} from "../next.config";
import {useStream} from "react-fetch-streams";

export default function LogPage({logs}) {

    const router = useRouter();
    const [logsState, setLogsState] = useState(logs);

    const Convert = require('ansi-to-html');
    const convert = new Convert();
    const { project_name : projectName } = router.query;
    const { organization_name: organizationName } = router.query;
    const { environment_name: environmentName } = router.query;

    useEffect(() => {
        setLogsState(logs);
    }, [logs]);

    const onNext = useCallback(async res => {
        const data = await res.text();

        let sI = data.indexOf("data:") + 5;
        let eI = data.length - 1;

        let dataProper = data.slice(sI, eI);

        let dataJs = JSON.parse(dataProper);

        let newLogsState = [...logsState, ...dataJs];
        setLogsState(newLogsState);
    }, []);

    const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/terraform/logs?branch=master`
    const fetchParams = {credentials: "include"}

    let stream = useStream(url, {onNext, fetchParams});
    useEffect(() => {
        return () => {
            stream.close();
        }
    }, []);

    return (
        <>
            <div align="left" style={{display: "flex", flexFlow: "row wrap", marginBottom: "20px"}}>
                <IconButton
                    aria-label="back"
                    onClick={() => Router.back()}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{flexGrow: 1}}/>
                <IconButton aria-label="refresh" sx={{marginRight: "20px"}}>
                    <RefreshIcon />
                </IconButton>
                <Button startIcon={<HighlightOffIcon />}
                        variant={"outlined"}
                        sx={{ height: "50%", margin: "auto", marginRight: "20px"}}
                        color={"error"}>
                    cancel
                </Button>
            </div>
            {
                logsState.map(v => (
                    <div style={{
                        backgroundColor: "#24292f",
                        color: "#ffffff",
                        padding: "8px 8px 0px 8px",
                        fontFamily: "courier new",
                        width: "100%",
                        fontSize: "12px"
                    }} className="content" dangerouslySetInnerHTML={{__html: convert.toHtml(v)}}/>
                ))
            }
        </>
    )
}