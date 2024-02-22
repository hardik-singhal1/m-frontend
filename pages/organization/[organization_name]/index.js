import { AuthContext } from "../../../lib/authContext";
import Loading from "../../../components/Loading";
import React, {useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@mui/material/Card";
import LayersIcon from '@mui/icons-material/Layers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleIcon from '@mui/icons-material/People';
import { Icon } from "@iconify/react";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import gitMerge from '@iconify/icons-bx/git-merge';
import { Line, Doughnut, Bar , PolarArea, Pie} from "react-chartjs-2";
import Chart from 'chart.js/auto';
import {useRouter} from "next/router";
import CountUp from 'react-countup';
import {hostport, productname} from "../../../next.config";
import {Button, DialogActions, DialogContent, Divider, Rating} from "@mui/material";
import Logo from "../../../components/layout/Logo";
import {createDetails, getDetails} from "../../../utils/fetch-util";
import {SnackbarContext} from "../../../lib/toaster/SnackbarContext";
import {Box} from "@mui/system";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudIcon from '@mui/icons-material/Cloud';
import {Dialog, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import ReviewsIcon from '@mui/icons-material/Reviews';
import StarIcon from '@mui/icons-material/Star';
import Grow from '@mui/material/Grow';
import Zoom from '@mui/material/Zoom';
import moment from "moment";


function OrganizationDashboard(props) {
    const router = useRouter();
    const { setSnackbar } = useContext(SnackbarContext);
    const [showFeedback,setShowFeedback] = useState(false);
    const labels = {
        0.5: '',
        1: '',
        1.5: 'Ok',
        2: 'Ok+',
        2.5: 'Good',
        3: 'Good+',
        3.5: 'Very_Good',
        4: 'Very_Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const date=new Date()
    const postFeedback = (params) =>{
        let url = `${hostport}/api/v1/organizations/${organizationName}/feedback/`
        let payload={...params,name:userData?.identity?.traits?.first_name,email:userData?.identity?.traits?.email,id:`${userData?.identity.id}/${date.getMonth()+1}-${date.getFullYear()}`}

        createDetails(url, "","","", payload)
            .then((res) => {
                if(Object.keys(params).length>0){
                    setSnackbar("Thanks for your valuable feedback","success");
                    setShowFeedback(false);
                }else{
                    setShowFeedback(false);
                }

            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
    }

    const [ratingValue, setRatingValue] = useState(null);
    const [hover, setHover] = useState(-1);
    const [review,setReview] = useState("");


    const [envValues,setEnvValues] = useState({
        Labels : [],
        Values : []
    })

    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const [projectValues,setProjectValues] = useState({
        Labels : [],
        Values : []
    })

    const [projectPercentage,setProjectPercentage] = useState(0);

    const data = {
        labels: projectValues.Labels,
        datasets: [
            {
                label: "Projects Created Per Month",
                data: projectValues.Values,
                fill: false,
                borderColor: "white",
                backgroundColor:["#c878b7","#00b0ae","#ffc667"],
                barThickness: 20,
                borderRadius: "10"
            }

        ],
    };

    const [show,setShow] = useState();



    const env = {
        labels: envValues.Labels,
        datasets: [
            {
                label: "Env Requested",
                data: envValues.Values,
                borderColor: "white",
                backgroundColor:["#c878b7","#00b0ae","#ffc667"],
                pointBackgroundColor: 'black',
                borderRadius: 5,
                hoverOffset: 5
            }
        ]
    }



    const projectsOptions= {
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display:true,
                    borderDash: [
                        2,
                        2
                    ]
                }
            }
        },
        plugins:{
            legend: {
                display:false
            }
        },
        borderRadius:2
    }

    const envOptions = {
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
                // position: 'bottom',
                labels:{
                    usePointStyle:true,
                },
            }
        },
        onClick: function(evt, element) {
            if(element.length > 0)
            {
                router.push(`/organization/${organizationName}/projects/?env=${Object.keys(info.env_request)[element[0].index]}`)
            }
        }}

    const { isLoggedIn, userData } = useContext(AuthContext);
    const [organizationName,setOrganizationName] = useState("");
    const [handOver,setHandOver] = useState(0);
    const [azureCount,setAzureCount] = useState(0);
    const [gcpCount,setGcpCount] = useState(0);
    const [awsCount,setAwsCount] = useState(0);

    const getResponse = () =>{
        try{
            const url = `${hostport}/api/v1/organizations/${organizationName}/dashboard`;
            getDetails(url, "", "", "", "")
                .then( res =>{
                    if(res){
                        setInfo(res.response_data);
                        let temp ={
                            Labels : [Object.keys(res.response_data.env_request)][0], Values : [Object.values(res.response_data.env_request)][0]
                        }
                        setEnvValues(temp);
                        const d = new Date();
                        let months = (month.slice(0,d.getMonth()+1));
                        let tempProjectValues={
                            Labels:[],
                            Values: []
                        };
                        tempProjectValues.Labels= months;
                        months.forEach((item)=>{
                            tempProjectValues.Values.push(res.response_data.month_name[item]);
                        })
                        setProjectValues(tempProjectValues)
                        let length=tempProjectValues.Values.length;
                        if(res.response_data.total_projects>1) setProjectPercentage((tempProjectValues.Values[length - 1]-tempProjectValues.Values[length - 2])*100/tempProjectValues.Values[length - 2])
                        else setProjectPercentage(0);
                        setHandOver(res.response_data.hand_over_count)
                        setGcpCount(res.response_data.cloud.Google)
                        setAzureCount(res.response_data.cloud.Azure)
                        setAwsCount(res.response_data.cloud.AWS)
                        setShow(true);

                        setFeedbackFunc(res.response_data.get_feedback)
                    }
                })
                .catch((err)=>{
                    if(err?.response?.status!==401){
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    }
                    setShow(false);
                })
        }catch(err){
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }

    function setFeedbackFunc(params){
        if(moment().diff(moment(userData?.identity.created_at)?.format('MM/DD/YY'), 'days')>7){
            setShowFeedback(params);
        }
    }

    const [info,setInfo]=useState(
    {
        total_projects: 0,
        month_name: {
            Apr: 0,
            Aug: 0,
            Dec: 0,
            Feb: 0,
            Jan: 0,
            Jul: 0,
            Jun: 0,
            Mar: 0,
            May: 0,
            Nov: 0,
            Oct: 0,
            Sep: 0
    },
        env_request: {},
        active_PRs: 0,
        current_pr_count:0
    }
    )
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    useEffect(()=>{
        if(organizationName && userData){
            getResponse();
        }
    },[organizationName,userData])

    function card(name,total,percentage,time,filter,icon,color){
        return(
            <div style={{paddingTop:"1.5rem",width:"18vw",minHeight:"150px",minWidth:"240px",height:"19vh"}}>
                <Card sx={{height:"100%",width:"100%",borderRadius:"12px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms','&:hover': {
                        boxShadow:"rgba(0, 0, 0, 0.25) 0px 25px 50px -12px", borderRadius:"12px"
                    }}} elevation={0}>
                    <div style={{position:"absolute"}}>
                        <div style={{position:"absolute",top:"-19px",left:"1.5rem",zIndex:9}}>
                            <div style={{height:"3.8rem",width:"3.8rem",borderRadius:"16px",backgroundColor:color,display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem"}}>
                                {icon}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",height:"100%",padding:" 1rem 0.75rem",width:"100%",justifyContent:"space-between"}}>
                        <div style={{paddingTop:"2rem"}}>
                            {
                                typeof percentage === "number" &&
                                <div style={{display:"flex",alignItems:"center",flexDirection:"column",height:"100%",justifyContent:"flex-end"}}>
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
                            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"space-between",height:"100%"}}>
                                <Typography sx={{fontWeight:"400",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px",paddingTop:filter!=="" ? "0rem" : "1.3rem"}}>{filter}</Typography>
                                <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={total} duration={0.5}/></Typography>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
    function cloudCard(name,icon,color,google,azure,aws,filter){
        return(
            <div style={{paddingTop:"1.5rem",width:"18vw",minHeight:"150px",minWidth:"240px",height:"19vh"}}>
                <Card sx={{height:"100%",width:"100%",borderRadius:"12px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms','&:hover': {
                        boxShadow:"rgba(0, 0, 0, 0.25) 0px 25px 50px -12px", borderRadius:"12px"
                    }}} elevation={0}>
                    <div style={{position:"absolute"}}>
                        <div style={{position:"absolute",top:"-19px",left:"1.5rem",zIndex:9}}>
                            <div style={{height:"3.8rem",width:"3.8rem",borderRadius:"16px",backgroundColor:color,display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem"}}>
                                {icon}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",height:"100%",padding:" 1rem 0.75rem",width:"100%",justifyContent:"space-between"}}>
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
                        <div style={{paddingBottom:"1rem",display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                            <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>{name}</Typography>
                            <Typography sx={{fontWeight:"400",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px",paddingTop:filter!=="" ? "0rem" : "1.3rem"}}>{filter}</Typography>
                        </div>
                    </div>
                    <div style={{display:"flex",width:"100%",justifyContent:"space-between",position:"relative",top:"-75px",alignItems:"center",padding:"0 1rem",marginBottom:"-25px",paddingBottom:"1.5rem"}}>
                        <div onClick={()=> router.push(`/organization/${organizationName}/projects/?cloud=google`)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem"}}>
                            <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="50" height="50" />
                            <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={google} duration={0.5}/></Typography>
                        </div>
                        <div onClick={()=>router.push(`/organization/${organizationName}/projects/?cloud=azure`)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem"}}>
                            <img src="/azure.svg" alt="azure" width="40" height="40" />
                            <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={azure} duration={0.5}/></Typography>
                        </div>
                        {/*<div onClick={()=>router.push(`/organization/${organizationName}/projects/?cloud=aws`)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem"}}>*/}
                        {/*    <img src="/aws-icon.svg" alt="aws" width="50" height="50" />*/}
                        {/*    <Typography style={{fontSize:"2.5rem",fontWeight:"bolder"}}><CountUp end={aws} duration={0.5}/></Typography>*/}
                        {/*</div>*/}
                    </div>
                </Card>
            </div>
        )
    }

    if (isLoggedIn) {
        if(show === true){
            return (
                <>
                    <div style={{width:"100%",height:"auto",padding:"0rem",borderRadius:"16px"}}>
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",paddingRight:"1rem",alignItems:"center",flexWrap:"wrap"}}>
                            <div style={{paddingLeft:"1rem"}}>
                                <div style={{display:"flex",flexDirection:"row",alignItems:"center",flexWrap:"wrap"}}>
                                    <DashboardIcon style={{color:"navy",width:"1.5rem",height:"1.5rem"}}/>
                                    <Typography variant={"h5"} style={{paddingLeft:"0.3rem",fontWeight:"600"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Organization Dashboard</Typography>
                                </div>
                                <Typography sx={{fontWeight:"400",fontFamily:`"Public Sans", sans-serif`}} style={{paddingLeft:"0.2rem"}}>Hello {userData?.identity?.traits?.first_name}, Welcome to {productname==="mpaas" ? <span style={{color:"red"}}>mPaaS Onboarding Portal</span> : <span style={{color:"red"}}>{"sailor"}</span>}</Typography>
                            </div>
                            <Logo sx={{width:"5rem",height:"3.5rem"}}/>
                        </div>
                        {/*<Divider style={{padding:"0.5rem"}}/>*/}
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-around",flexWrap:"wrap",gap:"0.25rem"}}>
                            <a onClick={()=>router.push(`${organizationName}/projects`)} style={{cursor:"pointer"}}>{card("Projects",info.total_projects,projectPercentage,"month","(Total)",<LayersIcon style={{color:"white"}}/>,"#c878b7")}</a>
                            <a onClick={()=>router.push(`${organizationName}/projects?hand_over=true`)} style={{cursor:"pointer"}}>{card("Handed Over",handOver,"","month","(Ops)",<Icon icon="bx:donate-heart" color="white" height={28} width={28}/>,"#ffc667")}</a>
                            <a onClick={()=>router.push(`${organizationName}/projects?hand_over=false`)} style={{cursor:"pointer"}}>{card("Yet to Hand Over",info.total_projects-handOver,"","month","(Ops)",<Icon icon="mdi:progress-clock" color="white" height={28} width={28}/>,"#00b0ae")}</a>
                            <a onClick={()=>router.push(`${organizationName}/projects_on_approval`)} style={{cursor:"pointer"}}>{card("Pending Approvals",info.active_PRs,"","","(Resources)",<Icon color="white" height={22} icon={bxGitPullRequest} width={22}/>,"#d0357c")}</a>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around",width:"100%"}}>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center",minWidth:"240px",gap:"1rem",width:"20%"}}>
                                <div>
                                    {cloudCard("Projects",<CloudIcon style={{color:"white"}}/>,"#7ad6e3",gcpCount,azureCount,awsCount,"(Cloud)")}
                                </div>
                                <Card sx={{padding:"1rem",borderRadius:"16px",minWidth:"240px",width:"18vw",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px;", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                                    <div style={{display:"flex",justifyContent:"space-between"}}>
                                        <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}} style={{paddingBottom:"1rem",alignItems:"center"}}>Env Requested</Typography>
                                    </div>
                                    <Doughnut data={env} options={envOptions} height={"135"} width={"auto"}/>
                                </Card>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minWidth:"240px",paddingTop:"1.5rem",width:"73%"}}>
                                <Card sx={{width:"100%",height:"100%",padding:"1rem",borderRadius:"16px",boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px;", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}} elevation={0}>
                                    <div style={{display:"flex",justifyContent:"space-between"}}>
                                        <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}} style={{paddingBottom:"1rem",alignItems:"center"}}>Projects created</Typography>
                                    </div>
                                    <Bar data={data} options={projectsOptions} height={"135"} width={"auto"}/>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/*<Grow in={showFeedback}>*/}
                            <Dialog
                                aria-describedby="alert-dialog-description"
                                aria-labelledby="alert-dialog-title"
                                // onClose={handleDialogClose}
                                open={showFeedback}
                                PaperProps={{
                                    style: { borderRadius: "10px",width:"500px"}
                                }}>
                                <DialogTitle id="alert-dialog-title"
                                             style={{backgroundColor:"#f4f6f8",height:"3.5rem",alignItems:"center",display:"flex"}}
                                >
                                    <div style={{display:"flex",alignItems:"center"}}>
                                        <ReviewsIcon style={{color:"navy",marginRight:"0.5rem"}}/>
                                        <Typography fontWeight={"bold"} variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Leave a Review</Typography>
                                    </div>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                            <div>
                                                <div style={{padding:"0.5rem 0"}}>
                                                    <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Rate us *</Typography>
                                                </div>
                                                <Zoom
                                                    in={showFeedback}
                                                    style={{ transformOrigin: '0 0 0' }}
                                                    {...(showFeedback ? { timeout: 1000 } : {})}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 200,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Rating
                                                            name="size-large"
                                                            size="large"
                                                            defaultValue={0}
                                                            value={ratingValue}
                                                            precision={0.5}
                                                            getLabelText={getLabelText}
                                                            onChange={(event, newValue) => {
                                                                setRatingValue(newValue);
                                                            }}
                                                            onChangeActive={(event, newHover) => {
                                                                setHover(newHover);
                                                            }}
                                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                        />
                                                        {ratingValue !== null && (
                                                            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : ratingValue]}</Box>
                                                        )}
                                                    </Box>
                                                </Zoom>
                                            </div>
                                            <Zoom
                                                in={showFeedback}
                                                // style={{ transformOrigin: '0 0 0' }}
                                                {...(showFeedback ? { timeout: 1000 } : {})}
                                            >
                                                <img src="/review1.svg" alt="review" width="120" height="120" />
                                            </Zoom>
                                        </div>
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-description">
                                        <div style={{paddingBottom:"0.5rem"}}>
                                            <Typography sx={{fontWeight:"600",fontSize:"14px",fontFamily:`"Public Sans", sans-serif`}}>Provide your feedback here </Typography>
                                        </div>
                                        <TextField
                                            multiline
                                            rows={5}
                                            placeholder={"Review"}
                                            value={review}
                                            onChange={(event) => setReview(event.target.value)}
                                            size="small"
                                            sx={{width: "100%"}}
                                            inputProps={{
                                                maxLength : 2000
                                            }}
                                            required
                                        />
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions style={{marginRight:"1rem",marginTop:"-1rem"}}>
                                    {/*<Button color="primary" onClick={()=>{*/}
                                    {/*        postFeedback({})*/}
                                    {/*    }*/}
                                    {/*}*/}
                                    {/*        variant={"outlined"} size={"small"} style={{marginRight:"0.5rem",borderRadius:"10px"}}>*/}
                                    {/*    Skip*/}
                                    {/*</Button>*/}
                                    <div>
                                        <Button
                                            onClick={()=>{
                                                if(ratingValue===null){
                                                    setSnackbar("Please fill the rating","error")
                                                }
                                                else {
                                                    postFeedback({stars:ratingValue,review:review})
                                                }
                                            }}
                                            variant="contained"
                                            style={{borderRadius:"10px"}}
                                            size={"small"}
                                            sx={{
                                                "&.MuiButton-contained": { backgroundColor: "#1b4077" },
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </DialogActions>
                            </Dialog>
                        {/*</Grow>*/}
                    </div>
                </>
            );
        }
        else if(show === false){
            return (
                productname === "mpaas" ?
                    <Box
                        component="img"
                        src="/mPaaS.png"
                        sx={{ flex : 1}}/> : <>Welcome to Sailor!!</>
            )
        }
    }
    return <Loading />;
}


export default OrganizationDashboard;
