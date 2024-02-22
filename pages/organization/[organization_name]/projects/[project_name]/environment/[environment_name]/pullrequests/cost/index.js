import {Button, Stack} from "@mui/material";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../../../../../../../../../lib/errorContext";
import {hostport} from "../../../../../../../../../next.config";
import {createDetails, getDetails, updateDetails} from "../../../../../../../../../utils/fetch-util";
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import React, {useContext, useEffect, useState} from "react";
import router, {useRouter} from "next/router";
import {AuthContext} from "../../../../../../../../../lib/authContext";
import Can from "../../../../../../../../../lib/Can";
import RefreshIcon from "@mui/icons-material/Refresh";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import CollapsibleTableComponent from "../../../../../../../../../components/CostEstimationTable";
import {Alert, TabContext, TabList, TabPanel} from "@mui/lab";
import {Box} from "@mui/system";
import Tab from "@mui/material/Tab";
import {BallSpinner, CircleSpinner, PushSpinner, StageSpinner} from "react-spinners-kit";
import Loading from "../../../../../../../../../components/Loading";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {Typography} from "@material-ui/core";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// this object matches the enum in backend: ChangeRequestState
const STATE = {
    PENDINGFIRSTAPPROVAL: 0,
    PENDINGSECONDAPPROVAL: 1,
    CLOSEDWITHCOMMENTS: 2,
    CLOSED: 3,
    APPROVEDANDCLOSED: 4,
    UNKNOWN: 5
}

export default function PullRequests() {
    const { setSnackbar } = useContext(SnackbarContext);
    const {errorTrigger} = useContext(ErrorContext);
    const router = useRouter();
    const {userData} = useContext(AuthContext);

    const [userInfo, setUserInfo] = useState(userData)

    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName]= useState("");
    const [environmentName,setEnvironmentName] = useState("");

    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name)
            setEnvironmentName(router.query.environment_name);
            setBranchName(router.query.branch)
        }
    },[router])


    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    const [
        rows,
        setRows
    ] = useState([]);

    const [
        runsState,
        setRunsState
    ] = useState();

    const [
        reservedBasedResources,
        setReservedBasedResources
    ] = useState();

    const [
        usageBasedResources,
        setUsageBasedResources
    ] = useState();

    const [
        branchName,
        setBranchName
    ] = useState();

    const [
        value,
        setValue
    ] = useState(0);




    function getCostData() {
        if (branchName){
            const getRolesValue = {
                branch_name: branchName,
                type: "breakdown"
            };
            getDetails(`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/cost/estimate`, "", "project", `organizations/${organizationName}`, getRolesValue)
                .then((res)=>{
                    if (res.response_data !== null) {
                        const resBased = res.response_data?.resources?.filter((event) => event.resource_type === "reserved");
                        const usageBased = res.response_data?.resources?.filter((event) => event.resource_type === "usage-based");
                        setReservedBasedResources(resBased);
                        setUsageBasedResources(usageBased);
                    }
                }).catch((err)=>{
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
        }
    }

    useEffect(()=>{
        getCostData()
    },[branchName])

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };


    return (
        <div changeRequestTitle={(res) => {
        }}>
            <div style={{height: 400, width: "100%"}}
            >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5rem"}}>
                    <div style={{display:"flex",alignItems:"center"}}>
                        <MonetizationOnIcon style={{color:"navy"}}/>
                        <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                            Cost Estimation
                        </Typography>
                    </div>
                    <Button size={"small"} variant={"outlined"} onClick={()=>router.back()}>
                        Back
                    </Button>
                </div>
                <div>
                        <TabContext value={value}>
                            <Box>
                                <TabList
                                    aria-label="lab API tabs example"
                                    centered
                                    onChange={handleChange}
                                >
                                    <Tab label="Reserved Resources" value={0}/>
                                    <Tab label="Usage Based Resources" value={1}/>
                                </TabList>
                            </Box>
                            <TabPanel value={0}>
                                <div>
                                    {reservedBasedResources &&
                                        <CollapsibleTableComponent
                                            rows={reservedBasedResources}
                                            type="reserved"
                                        />
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={1}>
                                <div>
                                    {usageBasedResources &&
                                        <CollapsibleTableComponent
                                            rows={usageBasedResources}
                                            type="usageBased"
                                        />
                                    }
                                </div>
                            </TabPanel>
                        </TabContext>
                </div>
            </div>
        </div>
    );
}
