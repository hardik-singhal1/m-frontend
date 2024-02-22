import { ErrorContext } from "../../lib/errorContext";
import { Icon } from "@iconify/react";
import { IconButton } from "@material-ui/core";
import { getDetails } from "../../utils/fetch-util";
import { hostport } from "../../next.config";
import environment from "@iconify/icons-fluent/tab-desktop-multiple-bottom-24-regular";
import { useRouter } from "next/router";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Logo from "./Logo";
import LogoutMenu from "./LogoutMenu";
import NavbarMenu from "./NavbarMenu";
import React, {useCallback, useContext, useEffect, useState} from "react";
import OrgSidebarList from "./OrgSidebarList";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import lodash from "lodash";
import makeStyles from "@material-ui/styles/makeStyles";
import menu2Fill from "@iconify/icons-eva/menu-2-fill";
import sidebarConfig from "./SidebarConfig";
import Novu from "../Novu";
import {AuthContext} from "../../lib/authContext";
import ProjectLayout from "../project/ProjectLayout";
import {CssBaseline, useMediaQuery} from "@mui/material";
import Typography from "@material-ui/core/Typography";
import {Domain} from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import {useTheme} from "@mui/material/styles"
import SupportAgentIcon from '@mui/icons-material/SupportAgent';


const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    appBar: {
        backdropFilter: "blur(6px)",
        backgroundColor: "white",
        transition: theme.transitions.create([
            "width",
            "margin"
        ], {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp
        }),
        zIndex: -1
    },
    appBarShift: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create([
            "width",
            "margin"
        ], {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.sharp
        }),
        width: `calc(100% - ${drawerWidth}px)`
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(4)
    },
    // content: {
    //     flexGrow: 1,
    //     height: "100vh",
    //     overflow: "auto"
    // },
    // drawerPaper: {
    //     position: "relative",
    //     transition: theme.transitions.create("width", {
    //         duration: theme.transitions.duration.enteringScreen,
    //         easing: theme.transitions.easing.sharp
    //     }),
    //     whiteSpace: "nowrap",
    //     width: drawerWidth
    // },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9)
        }
    },
    fixedHeight: {
        height: 240
    },
    // menuButton: {
    //     marginRight: 36
    // },
    menuButtonHidden: {
        display: "none"
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        padding: theme.spacing(2)
    },
    root: {
        display: "flex"
    },
    selected: {
        borderRight: `3px solid ${theme.palette.primary.main}`
    },
    title: {
        flexGrow: 1
    },
    // toolbar: {
    //     backgroundColor: "white",
    //     paddingRight: 24
    // },
    toolbarIcon: {
        alignItems: "center",
        display: "flex",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    drawer: {
        flexShrink: 0,
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    toolbar: {
        ...theme.mixins.toolbar,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
        // paddingRight: 24,
        backgroundColor: "white",
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}));

function Layout({ data, children, mainRef }) {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setOpen(!open);
    };
    const {userData} = useContext(AuthContext);
    const classes = useStyles();
    const router = useRouter();
    // const [
    //     open,
    //     setOpen
    // ] = React.useState(false);
    // const toggleDrawer = useCallback(() => {
    //     if (router.pathname !== "/" ) {
    //         setOpen((open) => !open);
    //     }
    // }, [router]);

    const [
        organization,
        setOrganization
    ] = React.useState([]);
    const [
        selected,
        setSelected
    ] = React.useState("");
    const { errorTrigger } = useContext(ErrorContext);
    const organizationName = router.query.organization_name;

    useEffect(() => {
        setOpen(false)
    },[router])

    function onClickOrganization(){
        router.push("/organization/create");
    }

    function getOrganizations() {
        try {
            const getOrganization = `${hostport}/api/v1/organizations/`;
            getDetails(getOrganization, "","","","")
                .then((res) => {
                    if (res.response_data !== null && typeof res.response_data !== "undefined") {
                        const response = res.response_data.map((event) => event.name);
                        if(response) {
                            setOrganization(response)

                            if (organizationName === undefined && !router.asPath.includes("/create") && data === "default") {
                                setSelected(response[0])
                                router.push(`/organization/${response[0]}`)
                            }else if (response.length ===0){
                                setSelected("Add New Organization")
                            }else if (organizationName!==undefined){
                                setSelected(organizationName)
                            }
                        }
                    }
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    const setOrganizationName = () => {
        setSelected(organizationName)
    }

    useEffect(()=>{
        setSelected(organizationName)
    },[router])

    const ChangeOpenState = () => {
        setOpen(false);
    }

    useEffect(() => {
        if(userData!==null){
            getOrganizations()
            setOrganizationName()
            ChangeOpenState()
        }
    }, [userData]);

    const mainContainer = useCallback(() => {
        if (router === null) {
            return (
                <Container className={classes.container} maxWidth="lg">
                    {children}
                </Container>
            );
        }

        if (router.pathname.includes("projects/") && !router.pathname.includes("projects/create")) {
            return (
                <div style={{width:"100%",padding:"2rem"}}>
                    <ProjectLayout>
                                {children}
                    </ProjectLayout>
                </div>
            )
        }

        return (
            <div style={{display:"flex",flexDirection:"row",width:"100vw",justifyContent:"center"}}>
                <div style={{width:"100%",padding:"2rem",marginLeft: marginLayout}}>
                    {children}
                </div>
            </div>
        );

    },[router]);

    const [marginLayout,setMarginLayout] = useState(drawerWidth);
    useEffect(()=>{
        if(isMdUp) setMarginLayout(drawerWidth);
        else setMarginLayout(0);
    },[isMdUp])

    const [orgPage,setOrgPage] = useState(false);
    useEffect(()=>{
        if(router.isReady){
            if(router.pathname==="/organization/[organization_name]") setOrgPage(true);
            else setOrgPage(false);
        }
    },[router])


    return (
        <div className={classes.root}>
            <AppBar style={{height:"auto",width:"100%",boxShadow:"1px 1px 2px rgb(229,229,229)"}} position="absolute" elevation={0}>
                <Toolbar classes={{ root: classes.toolbar }}>
                    <div style={{display:"flex",alignItems:"center"}}>
                        {/*<IconButton onClick={toggleDrawer} sx={{ mr: 0.5 }}>*/}
                        {/*    <Icon icon={menu2Fill}/>*/}
                        {/*</IconButton>*/}
                        {
                            !router.pathname.includes("/organization/[organization_name]/projects/[project_name]/environment/[environment_name]") && !isMdUp &&
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={toggleDrawer}
                                className={classes.menuButton}
                            >
                                <Icon icon={menu2Fill} color={"navy"}/>
                            </IconButton>
                        }

                        <Link onClick={()=>router.push(`/organization/${organizationName}`)} sx={{cursor:"pointer"}} >
                            <Box sx={{ display: "inline-flex",ml:"0.5rem"}}>
                                <Logo />
                            </Box>
                        </Link>
                    </div>
                    {
                        <div style={{marginLeft:isMdUp ? "10rem" : 0}}>
                            <NavbarMenu
                                menuList={organization}
                                nav="organization"
                                onClick={onClickOrganization}
                                selected={selected}
                            />
                        </div>
                    }
                    <Box sx={{ flexGrow: 1 }} />
                    <div className={classes.grow} />
                    <SupportAgentIcon style={{color:"#087fc9",marginRight:"0.5rem",cursor:"pointer"}} onClick={()=>{
                        router.push(`/organization/${organizationName}/help`)
                    }}/>
                    <Novu />
                    <LogoutMenu />
                </Toolbar>
            </AppBar>
            {
                !router.pathname.includes("/organization/[organization_name]/projects/[project_name]/environment/[environment_name]") &&
                <Drawer
                    className={classes.drawer}
                    // variant="permanent"
                    variant={isMdUp ? "permanent" : "temporary"}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    anchor="left"
                    open={open}
                    onClose={toggleDrawer}
                    PaperProps={{
                        sx: {
                            borderRight: "dotted #e4e8eb",
                            // backgroundColor:"#24292f",
                            zIndex:1
                        }
                    }}
                >
                    {/*<div className={classes.appBarSpacer} />*/}
                    {/*<div style={{display:"flex",justifyContent:"center",backgroundColor:"#919eab1f",height:"4rem",margin:"0.5rem",borderRadius:"12px",alignItems:"center",gap:"0.5rem"}}>*/}
                    <div style={{
                        display: "flex",
                        height: "4rem",
                        borderRadius: "12px",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: "0.5rem 0 0.5rem 1.5rem"
                    }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer}
                            className={classes.menuButton}
                        >
                            <Icon icon={menu2Fill} color={"navy"}/>
                        </IconButton>
                        <Link onClick={() => router.push(`/organization/${organizationName}`)} sx={{cursor: "pointer"}}>
                            <Box sx={{display: "inline-flex"}}>
                                <Logo/>
                            </Box>
                        </Link>
                    </div>
                    <div style={{padding:"0.5rem",display:"flex",alignItems:"center",justifyContent:"flex-start",marginLeft:"1.5rem"}}>
                        <Domain style={{color:"navy"}}/>
                        {
                            organizationName &&
                            <Typography variant={"h7"} fontWeight={"bold"} sx={{ml:"0.5rem"}}>{ organizationName?.length<=19 ? organizationName : `${organizationName?.slice(0,17)}...`}</Typography>
                        }
                    </div>
                    <OrgSidebarList
                        sidebarConfig={sidebarConfig.map((child) => {
                            const cNew = lodash.cloneDeep(child);

                            if (router === null) {
                                cNew.path = `${selected}${child.path}`;
                            } else {
                                let index = 0;
                                if (router.pathname.includes("projects/")) {
                                    cNew.path = `/organization/${organizationName}${child.path}`;
                                    if (cNew.title === "IAM" || cNew.title === "settings" || cNew.title === "Inventory") {
                                        for (index = 0; index < cNew.children.length; index++) {
                                            cNew.children[index].path = `/organization/${organizationName}${child.children[index].path}`;
                                        }
                                    }
                                } else if (cNew.title === "IAM" || cNew.title === "settings") {
                                    for (index = 0; index < cNew.children.length; index++) {
                                        cNew.children[index].path = `/organization/${organizationName}${child.children[index].path}`;
                                    }
                                } else {
                                    cNew.path = `/organization/${organizationName}${child.path}`;
                                }
                            }

                            return cNew;
                        })}
                    />
                </Drawer>
            }
            <main style={{position:"fixed",width:"100%",height:"100%",overflow:"auto"}} ref={mainRef}>
                <div className={classes.appBarSpacer} />
                <div style={{backgroundColor:orgPage===true ? "#fcfbfb" : "#FFFFFF",display:"flex",flexDirection:"column"}}>
                    {mainContainer()}
                </div>
            </main>
        </div>
    );
}

export default Layout;
