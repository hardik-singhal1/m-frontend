import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {ErrorContext} from "../../lib/errorContext";
import {Paper, Typography, alpha} from "@material-ui/core";
import {deleteDetails, getDetails, updateDetails} from "../../utils/fetch-util";
import {hostport} from "../../next.config";
import {styled} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MuiDrawer from "@material-ui/core/Drawer";
import NavbarMenu from "../layout/NavbarMenu";
import ProjectSidebarConfig from "./ProjectSidebarConfig";
import PropTypes from "prop-types";
import React, {useCallback, useContext, useEffect, useState} from "react";
import SidebarList from "../layout/SidebarList";
import loadash from "lodash";
import makeStyles from "@material-ui/styles/makeStyles";
import {AuthContext} from "../../lib/authContext";
import {Breadcrumbs} from "@mui/material";
import Link from "@material-ui/core/Link";

const drawerWidth = 260;

const openedMixin = (theme) => ({
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp

    }),
    width: drawerWidth
});

const closedMixin = (theme) => ({
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp
    }),
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(9)} + 1px)`
    }
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: "fixed",
        marginTop: 65,
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        position: "fixed",
        height: "calc(100% - 65px)",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(6),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth - 60,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeight: {
        height: 240,
    },
    selected: {
        borderRight: `3px solid ${theme.palette.primary.main}`,
    },
    new: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open"
})(({theme, open}) => ({
    boxSizing: "border-box",
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: drawerWidth,
    ...open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme)
    },
    ...!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme)
    }
}));

export default function ProjectLayout({children}) {
    const classes = useStyles();
    const {errorTrigger} = useContext(ErrorContext);
    const router = useRouter();
    const projectName = router.query.project_name;
    const organizationName = router.query.organization_name;
    const [
        environments,
        setEnvironments
    ] = React.useState([]);
    const [
        currentEnvironment,
        setCurrentEnvironment
    ] = React.useState("");
    const [
        permanentOpen,
        setPermanentOpen
    ] = React.useState(true);
    const environmentName = router.query.environment_name;

    const {userData} = useContext(AuthContext)

    const [userInfo, setUserInfo] = useState(userData)

    useEffect(() => {
        if (userData && userData !== undefined) {
            setUserInfo(userData)
        }
    }, [userData])
    const onClickEnv = useCallback(() => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/environments`);
    });

    const [cloud,setCloud] = useState("")

    useEffect(()=>{
        if(projectName && organizationName){
            getProjects();
        }
    },[projectName,organizationName])

    const getProjects = () => {
        try {
            const GetProjects = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}`;
            getDetails(GetProjects, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        if(res.response_data.tags.cloud === "Azure") setCloud("Azure")
                        else if(res.response_data.tags.cloud === "AWS") setCloud("AWS")
                        else setCloud("Google")
                    }
                })
                .catch((err) => {
                    console.log("Err", err.message)
                });
        } catch (err) {
            console.log(err.response?.data?.response_message || err.message,"error")
        }
    };

    const getEnvironments=() =>{
        try {
            const getEnvironmentsroute = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/`;

            getDetails(getEnvironmentsroute, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        for (let iter = 0; iter < res.response_data[0].length; iter++) {
                            res.response_data[iter].id = iter + 1;
                        }
                    } else {
                        res.response_data = []
                    }
                    let resp = res.response_data.filter((event) => event.id.includes(`organizations/${organizationName}/projects/${projectName}/`));
                    if (resp) {
                        resp = resp.map((event) => event.name);
                        setEnvironments(resp)
                        if (currentEnvironment == undefined) {
                            setCurrentEnvironment(resp[0])
                        }

                    } else {
                        setEnvironments([])
                    }
                })
                .catch((err) => {
                    console.log("Err", err.message)
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    const onClickEnvDelete = useCallback(() => {
        try {
            const deleteEnvironments = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}`;

            deleteDetails(deleteEnvironments, "", "", "")
                .then(() => {
                    let goBackToEnv = "Default";

                    getEnvironments();

                    if (environments.length !== 0) {
                        if (environments[0] === environmentName && environments.length === 1) {
                            goBackToEnv = "Default";
                        } else if (environments[0] === environmentName) {
                            goBackToEnv = environments[1];
                        } else {
                            goBackToEnv = environments[0];
                        }
                    }

                    router.push(`/organization/${organizationName}/projects/${projectName}/environment/${goBackToEnv}`);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    });


    useEffect(() => {
        if (environmentName !== undefined)
            setCurrentEnvironment(environmentName);
    }, [router]);

    useEffect(() => {
        if(organizationName && projectName){
            getEnvironments();
            setCurrentEnvironment(environmentName)
        }
    }, [organizationName,projectName]);

    const handlePermanentOpen = () => {
        setPermanentOpen(!permanentOpen);
    };

    const [menuState, setMenuState] = useState([])

    const menu = useCallback(async ()=>{
        let tempArr = []
        ProjectSidebarConfig.map((event) => {
            const cNew = loadash.cloneDeep(event);
            if (cNew.title === "IAM" || cNew.title === "Inventory" || cNew.title === "Settings"  || cNew.title === "Security") {
                for (let iter = 0; iter < cNew.children.length; iter++) {
                    cNew.children[
                        iter
                        ].path = `/organization/${organizationName}/projects/${projectName}/environment/${environmentName}${event.children[iter].path}`;
                }
            } else {
                cNew.path = `/organization/${organizationName}/projects/${projectName}/environment/${environmentName}${event.path}`;
            }

            tempArr.push(cNew)
        })

        setMenuState(tempArr)
    },[ProjectSidebarConfig,router])
    useEffect(() => {
        menu();
    }, [router, ProjectSidebarConfig])

    const topLayout = () => {
        return(
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit"
                          onClick={()=>{
                              router.push(`/organization/${organizationName}`);
                          }}
                          style={{
                              cursor:"pointer",
                          }}
                    >
                        {organizationName}
                    </Link>
                    <Typography color="text.primary">{projectName}</Typography>
                </Breadcrumbs>
                <div>
                    <NavbarMenu
                        menuList={environments}
                        nav="Environment"
                        onClick={onClickEnv}
                        onClickDelete={onClickEnvDelete}
                        selected={currentEnvironment}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <div>
                <Drawer
                    PaperProps={{
                        sx: {
                            height: "calc(100% - 65px)",
                            ml: !permanentOpen ? -1.5 : 0,
                            mt: "65px",
                            bgcolor:"white",
                            boxShadow:"1px 1px 2px rgb(229,229,229)",
                            borderRight: 0
                        }
                    }}
                    open={permanentOpen}
                    variant="permanent"
                >
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"1rem 2rem 0 1.5rem"}}>
                        {permanentOpen ?
                            <>
                                <div style={{height:"2.7rem",width:"2.7rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                    {
                                        cloud==="Google" ? <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="200" height="50" /> : (cloud==="AWS" ? <img src="/aws-icon.svg" alt="azure" width="100" height="28" /> : <img src="/azure.svg" alt="azure" width="200" height="50" />)
                                    }

                                </div>
                                {
                                    projectName &&
                                    <Typography style={{marginLeft:"0.5rem",fontWeight:"bold",color:"#40536e"}}>{ projectName?.length<=15 ? projectName : `${projectName?.slice(0,14)}...`}</Typography>
                                }
                            </> :
                            <div style={{marginLeft:"0.5rem"}}>
                                {
                                    cloud==="Google" ? <img src="/google-cloud-icons/google-cloud.svg" alt="google" width="25" height="50" /> : <img src="/azure.svg" alt="azure" width="25" height="50" />
                                }
                            </div>
                        }
                    </div>
                    <SidebarList
                        sidebarConfig={menuState}
                        sidebarLevel={"project"}
                        permanentOpen={permanentOpen}
                        router={router}
                    />
                    <Box
                        sx={{
                            flexGrow: 1
                        }}
                    />
                    <Box
                        sx={{
                            ml: 3,
                            my: 2
                        }}
                    >
                        <IconButton
                            onClick={handlePermanentOpen}
                        >
                            {permanentOpen
                                ? <ChevronLeft style={{color:"orange"}}/>
                                : <ChevronRight style={{color:"orange"}}/>}
                        </IconButton>
                    </Box>
                </Drawer>
            </div>
            <Box sx={{flexGrow: 1,height:"80vh"}}>
                {topLayout()}
                <div>{children} </div>
            </Box>
        </div>
);

}

ProjectLayout.propTypes =
    {
        children: PropTypes.any.isRequired,
    }
;

