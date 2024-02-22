import {useRouter, withRouter} from "next/router";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import PropTypes from "prop-types";
import React, {useCallback, useContext, useEffect, useState} from "react";
import SidebarItem from "./SidebarItem";
import {AuthContext} from "../../lib/authContext";
import {hostport} from "../../next.config";
import {createDetails} from "../../utils/fetch-util";

function SidebarList({ router, sidebarConfig,sidebarLevel,permanentOpen }) {

    const isActive = useCallback((path) => {
        if (path) {
            return path === router.pathname;
        }

        return false;
    }, [router]);

    const [
        sideConfig,
        setSideConfig
    ] = useState([]);

    const {organization_name: organizationName} = router.query;
    const {project_name: projectName} = router.query;
    const level = sidebarLevel;
    const [headerObject,setHeaderObject] = useState("");

    useEffect(() => {
        if (organizationName !== undefined) {
            if (sidebarLevel === "project" && projectName !== undefined) {
                setHeaderObject(`organizations/${organizationName}/projects/${projectName}`)
            } else {
                setHeaderObject(`organizations/${organizationName}`)
            }
        }
    }, [sidebarLevel, router, organizationName, projectName])

    const {userData} = useContext(AuthContext);
    let role = userData !== null ? userData.identity.id : "";
    const checkSidebarApi = `${hostport}/api/v1/iam/roles/check/menu`;

    const [checkSideBarValue,setCheckSideBarValue] =useState({})
    const [sideBarResponse,setSideBarResponse] = useState([])

    useEffect(() => {
        if (headerObject != "") {
            let newSideBarValue = []
            let menuAccessInfo = {
                identity: "identity::" + role,
                level: level,
                object: headerObject
            }
            let tempSideBarValue = {}
            // altering the predefined sideBar values for backend purposes.
            sidebarConfig.forEach((value) => {
                // adding a tag "::" for the sub-menus for individual validation and further reference
                if (value.hasOwnProperty("children")) {
                    value.children.forEach((subMenu) => {
                        tempSideBarValue = {
                            title: value.title + "::" + subMenu.title,
                            disabled: subMenu.disabled,
                            access_level: [...subMenu.access_level]
                        }
                        newSideBarValue.push(tempSideBarValue)
                    })
                } else {
                    tempSideBarValue = {
                        title: value.title,
                        disabled: value.disabled,
                        access_level: [...value.access_level]
                    }
                    newSideBarValue.push(tempSideBarValue)
                }
                menuAccessInfo.sideBar = newSideBarValue
            })
            setCheckSideBarValue(menuAccessInfo)
        }

    }, [sidebarConfig, headerObject, level])

    useEffect(async () => {
        if (userData!==null && Object.keys(checkSideBarValue).length!==0 && sideBarResponse.length===0) {
            try {
                // backend api to check sidebar access
                createDetails(checkSidebarApi, "", level, headerObject, checkSideBarValue)
                    .then(res => {
                        if (res.response_data) {
                            setSideBarResponse(res.response_data)
                        }
                    }).catch(err => {
                    console.error(err)
                })
            } catch (err) {
                console.log(err)
            }
        }
    }, [sidebarConfig, checkSideBarValue,userData])

    useEffect(() => {
        if (sideBarResponse.length > 0) {
            // filter the updated sidebar between the validated response obtained and predefined template
            let filteredSideConfig = getModifiedSideBar(sideBarResponse, sidebarConfig);
            setSideConfig(filteredSideConfig)
        }
    }, [sideBarResponse, sidebarConfig])

    const [page,setPage] = useState("")
    const [childPage,setChildPage] = useState("");

    useEffect(()=>{
        if(router.isReady){
            let temp = router.asPath.split(`/${router.query.environment_name}/`)[1]
            if(temp===undefined) setPage("overview")
            else{
                let temp1=temp.split("/");
                setChildPage("")
                switch (temp1[0]){
                    case "pullrequests" :
                        setPage("Pull-Requests")
                        break
                    case "projectlogs" :
                        setPage("Projects Logs")
                        break
                    default :
                        setPage(temp.split("/")[0])
                }
                if(temp1.length>1){
                    switch (temp1[1]){
                        case "catalogs" :
                            setChildPage("Application Catalog")
                            break
                        default :
                            setChildPage(temp1[1])
                    }
                }
            }
        }
    },[router])

    return (
        <Box>
            <List>
                {
                    sideConfig.map((child) => (<SidebarItem
                        page={page}
                        active={isActive}
                        item={child}
                        key={child.title}
                        permanentOpen={permanentOpen}
                        childPage={childPage}
                                               />))
                }
            </List>
        </Box>
    );
}

function getModifiedSideBar(sideBarResponse, sidebarConfig) {
    // using two loops because the response array will have more values (reason having children values) than the predefined template..
    sideBarResponse.map((sideBar) => {
        sidebarConfig.forEach((menu) => {
            // the tag "::" added to the submenus earlier is used for identification (Eg:- MENU::SUBMENU --> IAM::Roles)
            if (sideBar.title.includes("::") && menu.title === sideBar.title.slice(0, sideBar.title.indexOf("::"))) {
                menu.children.forEach((subMenu) => {
                    if (subMenu.title === sideBar.title.slice(sideBar.title.indexOf("::") + 2)) {
                        // updating the property of disabled to true to filter it out later.
                        if (sideBar.disabled === true) {
                            subMenu.disabled = true
                        }
                    }
                })
            } else if (sideBar.title === menu.title) {
                //checking on top level menus
                if (sideBar.disabled === true) {
                    menu.disabled = true;
                }
            }
        })
    })

    // the predefined template has been updated as per the response and now filter the
    // menus to disable.
    let filteredSideConfig = [];
    sidebarConfig.forEach((menu) => {
        if (menu.hasOwnProperty("children")) {
            // to filter out only the enabled ones from the children array
            let tempSubMenu = menu.children.filter((subMenu) => subMenu.disabled === false)
            // updating the data into updated template
            menu.children = tempSubMenu
            filteredSideConfig.push(menu)
        } else if (menu.disabled === false) {
            // similarly, updating on top level menus
            filteredSideConfig.push(menu)
        }
    })

    return filteredSideConfig;
    // if any suggestions, or improvements needed - (praveen.ravi@bootlabstech.com)
}

SidebarList.propTypes = {
    router: PropTypes.object.isRequired,
    sidebarConfig: PropTypes.object.isRequired
};

export default React.memo(withRouter(SidebarList));
