import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {useRouter} from "next/router";
import {useCallback, useContext, useEffect, useState} from "react";
import {hostport} from "../next.config";
import {createDetails, getDetails, updateDetails} from "../utils/fetch-util";
import {AuthContext} from "../lib/authContext";
import {ErrorContext} from "../lib/errorContext";
import {Backdrop, CircularProgress, LinearProgress, Tooltip} from "@material-ui/core";

export default function SplitButton({test,disabled}) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const router = useRouter();
    const {userData} = useContext(AuthContext)
    const {errorTrigger} = useContext(ErrorContext)
    const projectName = router.query.project_name;
    const organizationName = router.query.organization_name;
    const environmentName = router.query.environment_name;
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [options, setOptions] = useState(['Organization Owner', 'Project Owner']);
    const [masterVars, setMasterVars] = useState([])
    const [newBranchVars, setNewBranchVars] = useState([])
    const [handleTooltipOpen,setHandleTooltipOpen] = useState(false)
    const [projOwnerApproved,setProjOwnerApproved] = useState(false)
    const [backdropOpen,setBackdropOpen] = useState(false)

    const handleTooltipClose = useCallback(()=>{
        setHandleTooltipOpen(false)
    })

    async function approve() {
        setBackdropOpen(true)

        let newValue = {
            id : `/organizations/${organizationName}/projects/${projectName}/${test.row.title}/${String(test.row.id)}/`,
            organization: organizationName,
            project: projectName,
            title : test.row.title,
            git : "Bitbucket",
            author :test.row.author,
            change_request_id : String(test.row.id),
            source : test.row.source,
            destination : test.row.id
        }

        let ProjectOwnerApproval = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/approval`;
        let vars = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/vars/`;
        if(options[selectedIndex] === "Organization Owner"){
            let ApproveMerge =`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/approve`;
            let GetModules = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/files`;
            let testValue = {
                "id":`/organizations/${organizationName}/projects/${projectName}`,
                "organization":organizationName,
                "project":`${projectName}`,
                "git":"bitbucket",
                "branch": test.row.source
            }
            let res = await updateDetails(GetModules, "", testValue)

            testValue = {
                "id":`/organizations/${organizationName}/projects/${projectName}`,
                "organization":organizationName,
                "project":`${projectName}`,
                "git":"bitbucket",
                "branch": "master"
            }
            let varsModule = []
            res = await updateDetails(GetModules, "", testValue)

            let newvalue = []
            if(res && res.response_data && res !== undefined &&res.response_data !== undefined){
                newvalue = res.response_data.filter((e) => (e.name !== ".gitignore" && e.name !== "" && e.name !== "variables.tf" && e.name !== "Jenkinsfile" &&e.name !== "provider.tf"))
                newvalue = newvalue.map((e, i) => {
                    e.id = i + 1;
                    return e
                })
            }

            for (var i = 0; i < newvalue.length; i++) {
                let varsfile = {
                    branch: "master",
                    module_name: newvalue[i].name
                }

                let res = await getDetails(vars, "", "", "", varsfile)
                let arr = []

                if (res.response_data) {
                    for (var j = 0; j < res.response_data.length; j++) {
                        arr.push(res.response_data[j])
                    }
                    let newDataTest = {
                        name : newvalue[i].name,
                        vars : arr,
                    }
                    masterVars.push(newDataTest)
                }
            }

            let testValuenewBranch = {
                "id":`/organizations/${organizationName}/projects/${projectName}`,
                "organization":organizationName,
                "project":`${projectName}`,
                "git":"bitbucket",
                "branch": test.row.source
            }
            res = await updateDetails(GetModules, "", testValuenewBranch)
            newvalue = res ? res.response_data !== undefined ?
                res.response_data.filter((e) => (e.name !== ".gitignore" && e.name !== "" && e.name !== "Jenkinsfile" &&e.name !== "variables.tf" && e.name !== "provider.tf")) : [] : []
            newvalue = newvalue.map((e, i) => {
                e.id = i + 1;
                return e
            })
            for (var i = 0; i < newvalue.length; i++) {
                let vars = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/vars/`;

                let varsfile = {
                    branch: test.row.source,
                    module_name: newvalue[i].name
                }

                res = await getDetails(vars, "", "", "", varsfile)
                let arr = []
                if (res.response_data) {
                    for (var j = 0; j < res.response_data.length; j++) {
                        arr.push(res.response_data[j])
                    }
                    let newDataTest = {
                        name: newvalue[i].name,
                        vars: arr,
                    }
                    newBranchVars.push(newDataTest)
                }
            }

            let mergedValue = []
            if(masterVars.length !== 0){
                mergedValue = mergeVars(masterVars,newBranchVars)
            } else {
                mergedValue =newBranchVars
            }

            let newData = {
                id : `/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/master/vars`,
                change_request : "master",
                modules : mergedValue
            }

            const createVars = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/vars/`
            await createDetails(createVars, "","","", newData)

            res = await updateDetails(ProjectOwnerApproval, "",newValue)
            if(res.response_data){
                setProjOwnerApproved(true)
                await createDetails(ApproveMerge, "","","",newValue)
            }
            if(!projOwnerApproved){
                setHandleTooltipOpen(true)
            }else{
                setHandleTooltipOpen(false)
            }
        } else {
            setBackdropOpen(true)
            createDetails(ProjectOwnerApproval,"","","",newValue)
                .then((res) => {
                    setProjOwnerApproved(true)
                })
                .catch((err) => {
                    return(
                        errorTrigger("warning",JSON.stringify("Error project Appproval"))
                    )
                })
            setBackdropOpen(false)
        }
        setBackdropOpen(false)
    }

    function mergeVars(master, branch) {
        var mergedSet = new Set([...master.map(v => v.name), ...branch.map(v => v.name)])
        var mergedNamesSet = Array.from(mergedSet)

        var mergedList = mergedNamesSet.map(n => {
            var master1 = master.filter(v => v.name === n).map(v => v.vars)[0];
            var branch1 = branch.filter(v => v.name === n).map(v => v.vars)[0];

            if(master1 === undefined) {
                return {
                    name: n,
                    vars: branch1
                }
            }

            if(branch1 === undefined) {
                return {
                    name: n,
                    vars: master1
                }
            }

            var master2 = master1.map(v => {
                var splitted = v.split("=", 2)
                return {
                    key: splitted[0],
                    value: splitted[1]
                }
            })

            var branch2 = branch1.map(v => {
                var splitted = v.split("=", 2)
                return {
                    key: splitted[0],
                    value: splitted[1]
                }
            })


            master2.forEach((v, i) => {
                let newValue = branch2.filter(f => f.key === v.key)
                if(newValue[0] !== undefined) {
                    master2[i].value = newValue[0].value;
                }
            })

            var master3 = master2.map(v => `${v.key}=${v.value}`)
            var branch3 = branch2.map(v => `${v.key}=${v.value}`)
            var set = new Set([...master3, ...branch3])
            return {
                name: n, vars: Array.from(set)
            }
        })

        return mergedList
    }


    const handleClick = () => {
        approve();
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const [projIdentityPresent,setProjIdentityPresent] = useState(false)
    const [orgIdentityPresent,setOrgIdentityPresent] = useState(false)

    const getRoleForUser = useCallback(() => {
        try {
            const GetRoleUsers = `${hostport}/api/v1/iam/roles/users`;

            const GetOrgRoleUsersValue = {
                role: {
                    id: "role::organization_owner"
                },
                object: `organizations/${organizationName}`,
                level: "organization"
            }
            const GetProjRoleUsersValue = {
                role: {
                    id: "role::project_owner"
                },
                object: `organizations/${organizationName}/projects/${projectName}`,
                level: "project"
            }

            getDetails(GetRoleUsers, "","organization",GetOrgRoleUsersValue.object,GetOrgRoleUsersValue)
                .then((res) => {
                    let c = 0
                    for(var iter = 0; iter < res.response_data.length; iter++){
                        if(res.response_data[iter].Role.name === "Organization Owner"){
                            let identitiesData = res.response_data[iter].Identities
                            for(var iteration = 0; iteration < identitiesData.length;iteration++){
                                if(identitiesData[iteration].id === userData.identity.id){
                                    setOrgIdentityPresent(true)
                                    c++
                                    break
                                }
                            }
                            if(c > 0){
                                break
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });

            getDetails(GetRoleUsers, "","project",GetProjRoleUsersValue.object,GetProjRoleUsersValue)
                .then((res) => {
                    let c = 0
                    for(var iter = 0; iter < res.response_data.length; iter++){
                        if(res.response_data[iter].Role.name === "Project Owner"){
                            let identitiesData = res.response_data[iter].Identities
                            for(var iteration = 0; iteration < identitiesData.length;iteration++){
                                if(identitiesData[iteration].id === userData.identity.id){
                                    setProjIdentityPresent(true)
                                    c++
                                    break
                                }
                            }
                            if(c > 0){
                                break
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    })

    useEffect(()=>{
        if(projIdentityPresent && orgIdentityPresent){
            setOptions(['Organization Owner','Project Owner'])
        }else if(projIdentityPresent){
            setOptions(['Project Owner'])
        }else if(orgIdentityPresent){
            setOptions(['Organization Owner'])
        }else{
            setOptions([])
        }
    },[projIdentityPresent,orgIdentityPresent])
    useEffect(async () => {
        getRoleForUser()

    },[])

    return (
        <div>
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,backgroundColor:'#3F343415'}}
                open={backdropOpen}
                invisible={false}
            >
                <CircularProgress color="primary"/>
            </Backdrop>
            <React.Fragment>
                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button"
                             disabled={disabled || options.length === 0}>
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip title="Project Owner should first approve"
                                 onClose={handleTooltipClose}
                                 open={handleTooltipOpen}
                                 disableFocusListener
                                 disableHoverListener
                                 disableTouchListenerarrow>
                            <Button
                                onClick={handleClick}
                            >{options[selectedIndex]}</Button>
                        </Tooltip>
                    </ClickAwayListener>
                    <Button
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'top' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {options.map((option, index) => (

                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </React.Fragment>
        </div>
    );
}