import {Button, DialogActions, DialogContent, Divider, IconButton, Popover} from "@mui/material";
import {ErrorContext} from "../../../../../../../../lib/errorContext";
import {hostport} from "../../../../../../../../next.config";
import {createDetails, getDetails} from "../../../../../../../../utils/fetch-util";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../../../../../../../../lib/authContext";
import Can from "../../../../../../../../lib/Can";
import RefreshIcon from "@mui/icons-material/Refresh";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {SnackbarContext} from "../../../../../../../../lib/toaster/SnackbarContext";
import { Icon } from '@iconify/react';
import playCircleFill from "@iconify/icons-eva/play-circle-fill";
import Typography from "@material-ui/core/Typography";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import { RiGitBranchFill } from "react-icons/ri";
import Card from "@mui/material/Card";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ApprovalIcon from '@mui/icons-material/Approval';
import { FaCheck } from 'react-icons/fa';
import Loading from "../../../../../../../../components/Loading";
import CountUp from 'react-countup';
import {Dialog, DialogContentText, DialogTitle, Tooltip} from "@material-ui/core";
import WarningIcon from '@mui/icons-material/Warning';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {toInteger, toNumber} from "lodash";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import {styled} from "@mui/material/styles";
import {tooltipClasses} from "@mui/material/Tooltip";


// this object matches the enum in backend: ChangeRequestState
const STATE = {
    PENDINGFIRSTAPPROVAL: 0,
    PENDINGSECONDAPPROVAL: 1,
    CLOSEDWITHCOMMENTS: 2,
    CLOSED: 3,
    APPROVEDANDCLOSED: 4,
    UNKNOWN: 5
}

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export default function PullRequests() {
    const { setSnackbar } = useContext(SnackbarContext);
    const {errorTrigger} = useContext(ErrorContext);
    const router = useRouter();
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;
    const {userData} = useContext(AuthContext);

    const [userInfo, setUserInfo] = useState(userData)
    const [loading,setLoading] = useState(true);

    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])

    const [changeRequestDetails, setChangeRequestDetails] = useState(null);

    const [
        rows,
        setRows
    ] = useState([]);

    const [added,setAdded] = useState([]);
    const [destroyed,setDestroyed] = useState([]);
    const [updated,setUpdated] = useState([]);
    const [replaced, setReplaced] = useState([]);

    function sendSignal(runID, approved, approvedByID, approvalStage) {
        const postSignal = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/workflow/signal`;

        createDetails(postSignal, "", "", "", {
            approved: approved,
            approved_by_id: approvedByID,
            approval_stage: approvalStage
        })
            .then(res => {
                getChangeRequest();
                if(approved) setSnackbar("PR Approved successfully","success")
                else setSnackbar("PR Rejected","success")
            })
            .catch(err => {
                getChangeRequest();
                setSnackbar("approval failed","error");
            });
    }

    const ProjectYes= () => {
        if (changeRequestDetails !== null) {
            switch (changeRequestDetails.state) {
                case STATE.PENDINGFIRSTAPPROVAL:
                    return (
                        <>
                            {
                                cost.length>0 &&
                                <div style={{display:"flex",justifyContent:"flex-start",marginTop:"-0.7rem",paddingBottom:"0.5rem"}}>
                                    <Typography variant="caption">
                                        <LightTooltip title={"For usage based resources cost or detailed info on reserved cost go to cost page"}>
                                            <InfoTwoToneIcon
                                                sx={{color: "green",height:"1rem",width:"1rem",marginTop:"0.125rem",marginRight:"0.2rem"}}
                                            />
                                        </LightTooltip>
                                    </Typography>
                                    <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"black",fontWeight:"600",fontSize:"14px"}}>Monthly Cost :</Typography>
                                    <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"red",fontWeight:"600",fontSize:"14px",paddingLeft:"0.2rem"}}>$<CountUp end={cost[1]} duration={0.5}/></Typography>
                                </div>
                            }
                            <Button startIcon={<CheckCircleOutlineIcon/>}
                                    color={"success"}
                                    variant={"outlined"}
                                    onClick={() => sendSignal(changeRequestDetails.run_id, true, userData.identity.id, 1)
                                    // {
                                    //     if(summaryData.length===0){
                                    //         setSnackbar("PR can be approved only when the plan is completed!")
                                    //     }else if(summaryData[1]>0){
                                    //         setDialogOpen(true)
                                    //     }else{
                                    //         sendSignal(changeRequestDetails.run_id, true, userData.identity.id, 1);
                                    //     }
                                    // }
                            }
                                    sx={{marginRight: "20px",width:"7rem",borderRadius:"10px",border:"1.5px solid"}}
                                    size={"small"}
                                    disableElevation>
                                <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Approve</Typography>

                            </Button>
                            <Button startIcon={<HighlightOffIcon/>}
                                    color={"error"}
                                    variant={"outlined"}
                                    onClick={() => {
                                        sendSignal(changeRequestDetails.run_id, false, userData.identity.id, 1);
                                    }}
                                    sx={{width:"7rem",borderRadius:"10px",border:"1.5px solid"}}
                                    size={"small"}
                                    disableElevation>
                                <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Deny</Typography>
                            </Button>
                        </>
                    )
                case STATE.PENDINGSECONDAPPROVAL:
                case STATE.CLOSED:
                case STATE.CLOSEDWITHCOMMENTS:
                case STATE.APPROVEDANDCLOSED:
                    return (
                        <div>
                            Approved By {changeRequestDetails.first_level_approved_by.name}
                        </div>
                    )

            }
        }
        return <></>
    }

    const ProjectNo=() => {
        if (changeRequestDetails !== null) {
            switch (changeRequestDetails.state) {
                case STATE.PENDINGFIRSTAPPROVAL:
                    return (
                        <>Approval Pending</>
                    )
                case STATE.PENDINGSECONDAPPROVAL:
                case STATE.CLOSED:
                case STATE.CLOSEDWITHCOMMENTS:
                case STATE.APPROVEDANDCLOSED:
                    return (
                        <div>
                            Approved By {changeRequestDetails.first_level_approved_by.name}
                        </div>
                    )

            }
        }
        return <></>
    }

    const OrgYes=() => {
        if (changeRequestDetails !== null) {
            switch (changeRequestDetails.state) {
                case STATE.PENDINGFIRSTAPPROVAL:
                    return (
                        <>Project Owner Approval Pending</>
                    )
                case STATE.PENDINGSECONDAPPROVAL:
                    return (
                        <>
                            {
                                cost.length>0 &&
                                <div style={{display:"flex",justifyContent:"flex-start",marginTop:"-0.7rem",paddingBottom:"0.5rem"}}>
                                    <Typography variant="caption">
                                        <LightTooltip title={"For usage based resources cost or detailed info on reserved cost go to cost page"}>
                                            <InfoTwoToneIcon
                                                sx={{color: "green",height:"1rem",width:"1rem",marginTop:"0.125rem",marginRight:"0.2rem"}}
                                            />
                                        </LightTooltip>
                                    </Typography>
                                    <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"black",fontWeight:"600",fontSize:"14px"}}>Monthly Cost :</Typography>
                                    <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"red",fontWeight:"600",fontSize:"14px",paddingLeft:"0.2rem"}}>$<CountUp end={cost[1]} duration={0.5}/></Typography>
                                </div>
                            }
                            <Button startIcon={<CheckCircleOutlineIcon/>}
                                    color={"success"}
                                    variant={"outlined"}
                                    onClick={() => {
                                        if(summaryData.length!==0 && summaryData[1]>0){
                                            setDialogOpen(true)
                                        }else{
                                            sendSignal(changeRequestDetails.run_id, true, userData.identity.id, 2);
                                        }
                                    }}
                                    sx={{width:"7rem",borderRadius:"10px",marginRight:"20px",border:"1.5px solid"}}
                                    size={"small"}
                                    disableElevation
                            >
                                <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Approve</Typography>
                            </Button>
                            <Button startIcon={<HighlightOffIcon/>}
                                    color={"error"}
                                    variant={"outlined"}
                                    onClick={() => {
                                        sendSignal(changeRequestDetails.run_id, false, userData.identity.id, 2);
                                    }}
                                    sx={{width:"7rem",borderRadius:"10px",border:"1.5px solid"}}
                                    size={"small"}
                                    disableElevation
                            >
                                <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Deny</Typography>
                            </Button>
                        </>
                    )
                case STATE.CLOSED:
                case STATE.CLOSEDWITHCOMMENTS:
                case STATE.APPROVEDANDCLOSED:
                    return (
                        <div>
                            Approved By {changeRequestDetails.second_level_approved_by.name}
                        </div>
                    )

            }
        }
        return <></>
    }

    const OrgNo=() => {
        if (changeRequestDetails !== null) {
            switch (changeRequestDetails.state) {
                case STATE.PENDINGFIRSTAPPROVAL:
                    return (
                        <>Project Owner Approval Pending</>
                    )
                case STATE.PENDINGSECONDAPPROVAL:
                    return (
                        <>Approval Pending</>
                    )
                case STATE.CLOSED:
                case STATE.CLOSEDWITHCOMMENTS:
                case STATE.APPROVEDANDCLOSED:
                    return (
                        <div>
                            Approved By {changeRequestDetails.second_level_approved_by.name}
                        </div>
                    )

            }
        }
        return <></>
    }

    function getChangeRequest() {
        setLoading(true);
        const getChangeRequestDetails = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/workflow/details`;

        getDetails(getChangeRequestDetails, "", "", "", "").then(r => {
            if (r !== null) {
                if (r.state === STATE.UNKNOWN) {
                    setRows([]);
                    setChangeRequestDetails(null)
                    setLoading(false);
                } else {
                    setRows([
                        {
                            id: r.run_id,
                            author: r.raised_by.name,
                            time: r.time,
                            branch_name: r.branch_name
                        }
                    ])
                    setChangeRequestDetails(r);
                    getPlanSummary(r.branch_name);
                }
            }
        })
    }

    const [
        summaryData,
        setSummaryData
    ] = useState([])

    const [cost ,setCost] = useState([]);


    const [currentCard,setCurrentCard] = useState([]);
    const [currentValues,setCurrentValues] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    });

    useEffect(()=>{
        if(summaryData.length>0){
            if(added.length) setCurrentCard(added),setCurrentValues(["#128600","Added"])
            else if(destroyed.length) setCurrentCard(destroyed),setCurrentValues(["#d70000","Destroyed"])
            else if(updated.length) setCurrentCard(updated),setCurrentValues(["#fab300","Updated"])
            else if(replaced.length) setCurrentCard(updated),setCurrentValues(["#fab300","Updated"])
        }
    },[summaryData])


    const getPlanSummary = (branchName) =>{
        let url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/terraform/plan/pr/summary`;
        const data = {
            branch_name: branchName
        };
        getDetails(url,"","","",data,"").then((res)=>{
            setLoading(false);
            let added = 0;
            let destroyed = 0;
            let updated = 0;
            let replaced = 0;
            let temp = [];
            let tempAdded=[]
            let tempDestroyed=[];
            let tempUpdated=[];
            let tempReplaced=[];
            res.response_data?.map((event, iter) => {
                event.id = iter
                if (event.action === "create") {
                    tempAdded.push(event.resources)
                    added += 1
                }
                else if (event.action === "delete") {
                    tempDestroyed.push(event.resources);
                    destroyed += 1
                }
                else if (event.action === "update") {
                    tempUpdated.push(event.resources)
                    updated += 1
                }
                else if(event.action === "delete_and_create"){
                    tempReplaced.push(event.resources)
                    replaced +=1
                }
            })
            temp[0] = added, temp[1] = destroyed, temp[2] = updated, temp[3]=replaced;
            setAdded(tempAdded);
            setDestroyed(tempDestroyed);
            setUpdated(tempUpdated);
            setReplaced(tempReplaced);
            if(res.response_data!==null) setSummaryData(temp);
            getCostData(branchName);
        }).catch((err)=>{
            setLoading(false);
            // setSnackbar("error",err)
        })
    }

    function getCostData(branchName) {
        if (branchName){
            const getRolesValue = {
                branch_name: branchName,
                type: "breakdown"
            };
            getDetails(`${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/cost/estimate`, "", "project", `organizations/${organization_name}`, getRolesValue)
                .then((res)=>{
                    if (res.response_data !== null) {
                        let hourlyCost=0;
                        let monthlyCost=0;
                        let temp = res.response_data?.resources?.filter((event) => event.resource_type === "reserved");
                        temp.forEach((item)=>{
                            hourlyCost+=toNumber(item.hourlyCost);
                            monthlyCost+=toNumber(item.monthlyCost);
                        })
                        setCost([hourlyCost.toFixed(2),monthlyCost.toFixed(2)]);
                    }
                }).catch((err)=>{
                    // setSnackbar(err.response?.data?.response_message || err.message,"error")
                    console.log(err.response?.data?.response_message || err.message)
            })
        }
    }

    useEffect(() => {
        if (router.isReady) {
            getChangeRequest();
        }
    }, [router]);

    function card(name,count,color){
        return(
            <>
                <Card style={{height:"5rem",width:"9.2rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderBottom:"5px solid",borderColor:color,boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px;", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                    <Typography fontWeight={"bold"} variant={"h7"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>{name}</Typography>
                    <Typography variant={"h4"} color={color} fontWeight={"bold"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}><CountUp end={count} duration={0.5}/></Typography>
                </Card>
            </>
        )
    }

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem",flexWrap:"wrap"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <Icon
                        icon={bxGitPullRequest}
                        height={22}
                        width={22}
                        color="navy"

                    />
                    <Typography  variant={"h5"} style={{paddingLeft:"0.3rem",fontWeight:"600"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>
                        Pull-Requests
                    </Typography>
                </div>
                <div>
                    <Button
                        onClick={getChangeRequest}
                        startIcon={<RefreshIcon align="center"/>}
                        sx={{color: "#808080"}}
                    />
                    {
                        rows.length>0 &&
                        <Button
                            onClick={()=>router.push(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/pullrequests/cost?branch=${rows[0].branch_name}`)}
                            variant={"contained"}
                            size={"small"}
                            disabled={!summaryData.length}
                            style={{marginRight:"0.5rem"}}
                        >
                            Cost
                        </Button>
                    }
                    <Button
                        onClick={()=>router.push(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/pullrequests/prhistory/`)}
                        variant={"contained"}
                        size={"small"}
                    >
                        Comments and History
                    </Button>
                </div>
            </div>
            <div style={{height: "60vh",overflow:"auto",borderRadius:"10px"}}>
                {
                    loading === true ? <Card style={{height: "100%", padding: "3rem", backgroundColor: "#f5f5f5",alignItems:"center",display:"flex"}}><Loading/></Card> :
                        <Card style={{height: "100%", padding: "1.5rem", backgroundColor: "#f5f5f5",overflow:"auto"}} elevation={0} sx={{fontFamily:`"Public Sans", sans-serif`}}>
                            {
                                rows.length > 0 ?
                                    <div style={{display:"flex",height:"100%",alignItems: summaryData.length>0 ? "center" : "flex-start",gap:"1rem"}}>
                                        <div>
                                            <div style={{display:"flex",gap:"2rem",flexWrap:"wrap"}}>
                                                <div>
                                                    <div style={{color: "#676565", paddingBottom: "0.5rem"}}>
                                                        <div style={{marginBottom: "0.5rem", display: "flex", alignItems: "center"}}>
                                                            <AccountCircleIcon style={{paddingRight:"0.2rem",color:"navy"}}/>
                                                            <Typography style={{
                                                                paddingRight: "7.9rem",
                                                                color: "black",
                                                                fontWeight: "bold"
                                                            }} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Author</Typography>:<span
                                                            style={{paddingLeft: "2rem",fontSize:"14px"}}>{rows[0].author}</span>
                                                        </div>
                                                        <div style={{marginBottom: "0.5rem", display: "flex", alignItems: "center"}}>
                                                            <RiGitBranchFill color={"navy"} style={{marginRight:"0.5rem"}}/>
                                                            <Typography
                                                                style={{paddingRight: "4.75rem", color: "black", fontWeight: "bold"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Branch Name</Typography>:<span
                                                            style={{paddingLeft: "2rem",fontSize:"14px"}}>{rows[0].branch_name}</span>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center"}}>
                                                            <AccessTimeFilledIcon style={{paddingRight:"0.2rem",color:"navy"}}/>
                                                            <Typography
                                                                style={{paddingRight: "6.25rem", color: "black", fontWeight: "bold"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Created
                                                                at</Typography>:<span
                                                            style={{paddingLeft: "2rem",fontSize:"14px"}}>{rows[0].time}</span>
                                                        </div>
                                                    </div>
                                                    {
                                                        summaryData.length!==0 &&<div style={{display:"flex",width:"100%",gap:"1rem",flexWrap:"wrap",margin:"1rem 0"}}>
                                                            <div style={{cursor:"pointer"}} onClick={()=>{setCurrentCard(added),setCurrentValues(["#128600","Added"])}}>{card("To be Added",summaryData[0],"#128600")}</div>
                                                            <div style={{cursor:"pointer"}} onClick={()=>{setCurrentCard(destroyed),setCurrentValues(["#d70000","Destroyed"])}}>{card("To be Destroyed",summaryData[1],"#d70000")}</div>
                                                            <div style={{cursor:"pointer"}} onClick={()=>{setCurrentCard(updated),setCurrentValues(["#fab300","Updated"])}}>{card("To be Updated",summaryData[2],"#fab300")}</div>
                                                            <div style={{cursor:"pointer"}} onClick={()=>{setCurrentCard(replaced),setCurrentValues(["#e1704b","Replaced"])}}>{card("To be Replaced",summaryData[3],"#e1704b")}</div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{display: "flex",alignItems:"center"}}>
                                                    <ApprovalIcon style={{color: "navy", height: "1.5rem", width: "1.5rem"}}/>
                                                    <Typography style={{color: "black", paddingLeft: "0.2rem"}}
                                                                sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Approvals</Typography>
                                                </div>
                                                <div style={{marginBottom:"0.5rem"}}>
                                                    <Typography variant={"caption"} sx={{fontFamily:`"Public Sans", sans-serif`}}>Please wait for the plan to be completed before approving the PR.</Typography>
                                                </div>
                                                <div style={{display: "flex", flexDirection: "row",alignItems:"center"}}>
                                                    <Card style={{padding:"1rem",height:"7.5rem",paddingBottom: "1rem",width:"17.5rem",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",borderRadius:"10px"}} elevation={0}>
                                                        <Typography fontWeight={"bold"}
                                                                    style={{color: "navy",paddingBottom: "1rem",textDecoration:"underline"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Project Owner</Typography>
                                                        <Can perform={"approve"}
                                                             role={userInfo.identity.id}
                                                             object={`organizations/${organization_name}/projects/${project_name}`}
                                                             yes={ProjectYes}
                                                             no={ProjectNo}
                                                        />
                                                    </Card>
                                                    <div style={{width:"3rem",margin:"0 1rem"}}>
                                                        <Divider orientation={"horizontal"} color={"navy"} style={{height:"0.2rem",borderRadius:"2px"}}/>
                                                    </div>
                                                    <Card style={{padding:"1rem",height:"7.5rem",paddingBottom: "1rem",width:"17.5rem",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",borderRadius:"10px"}} elevation={0}>
                                                        <Typography  fontWeight={"bold"}
                                                                     style={{color: "navy",paddingBottom: "1rem",textDecoration:"underline"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Organization
                                                            Owner</Typography>
                                                        <Can perform={"approve"}
                                                             role={userInfo.identity.id}
                                                             object={`organizations/${organization_name}`}
                                                             yes={OrgYes}
                                                             no={OrgNo}
                                                        />
                                                    </Card>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
                                            {
                                                currentCard.length>0 &&
                                                <div style={{width:"100%",height:"45%"}}>
                                                    <Card style={{height:"100%",width:"75%",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",borderRadius:"10px",minWidth:"15rem"}} elevation={0}>
                                                        <div style={{height:"3rem",backgroundColor:currentValues[0],display:"flex",alignItems:"center",justifyContent:"center"}}>
                                                            <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"white"}}>Resources To Be {currentValues[1]}</Typography>
                                                        </div>
                                                        <div style={{padding:"1rem",overflow:"auto",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem",height:"100%"}}>
                                                            {
                                                                currentCard.map((item)=>{
                                                                    return <Typography variant={"h7"} sx={{fontFamily:`"Public Sans", sans-serif`,color:"navy",fontSize:"14px"}}>{item}</Typography>
                                                                })
                                                            }
                                                        </div>
                                                    </Card>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    : <>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "80%"
                                        }}>
                                            <Typography variant={"h5"} style={{marginRight: "0.5rem"}} sx={{fontFamily:`"Public Sans", sans-serif`}}>All Good, No active
                                                PRs found</Typography>
                                            <ThumbUpIcon style={{color: "navy", width: "3rem", height: "3rem"}}/>
                                        </div>
                                    </>
                            }
                        </Card>
                }
            </div>
            <div>
                <Dialog
                    aria-describedby="alert-dialog-description"
                    aria-labelledby="alert-dialog-title"
                    onClose={handleDialogClose}
                    open={dialogOpen}
                    PaperProps={{
                        style: { borderRadius: "10px" }
                    }}>
                    <DialogTitle id="alert-dialog-title"
                                 style={{backgroundColor:"#f4f6f8",height:"3.5rem",alignItems:"center",display:"flex"}}
                    >
                        <div style={{display:"flex",alignItems:"center"}}>
                            <WarningIcon style={{color:"red",marginRight:"0.5rem"}}/>
                            <Typography fontWeight={"bold"} variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Approve Pull-Request</Typography>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography sx={{fontFamily:`"Public Sans", sans-serif`,marginTop:"1rem"}}>Are you sure to Approve this PR? Below <span style={{color:"red",fontWeight:"bold"}}><CountUp end={summaryData[1]} duration={0.2}/></span> resource(s) will be <span style={{color:"red",fontWeight:"bold"}}>destroyed</span>.</Typography>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-information">
                            <div style={{maxHeight:"8rem",overflow:"auto",border:"1px solid lightgray",padding:"1rem",borderRadius:"10px",marginTop:"0.5rem"}}>
                                {
                                    destroyed.map((item)=>{
                                        return <Typography sx={{fontFamily:`"Public Sans", sans-serif`,color:"red"}}>{item}</Typography>
                                    })
                                }
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{marginRight:"1rem"}}>
                        <Button color="primary" onClick={handleDialogClose} variant={"outlined"} size={"small"} style={{marginRight:"0.5rem",borderRadius:"16px"}}>
                            Cancel
                        </Button>
                        <div>
                            <Button
                                autoFocus
                                color="error"
                                onClick={()=>{
                                    sendSignal(changeRequestDetails.run_id, true, userData.identity.id, changeRequestDetails.state===STATE.PENDINGFIRSTAPPROVAL ? 1 : 2);
                                    handleDialogClose();
                                }}
                                variant="contained"
                                style={{borderRadius:"16px"}}
                                size={"small"}
                            >
                                Approve
                            </Button>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
