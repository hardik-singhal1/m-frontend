import { Box, Divider, Typography } from "@mui/material";
import { Button } from "@material-ui/core";
import { Icon } from "@iconify/react";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { hostport } from "../../../../../../../../../next.config";
import { updateDetails } from "../../../../../../../../../utils/fetch-util";
import PrFloatingBox from "../../../../../../../../../components/PrFloatingBox";
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import React, { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import gitPullRequestClosed24 from '@iconify/icons-octicon/git-pull-request-closed-24';
import router from "next/router";
import gitMerge from '@iconify/icons-bx/git-merge';

export default function index() {
    const { project_name } = router.query;
    const { organization_name } = router.query;
    const { environment_name } = router.query;
    const [
        tabvalue,
        setTabvalue
        // eslint-disable-next-line react-hooks/rules-of-hooks
    ] = useState("OPEN");
    const [
        openlist,
        setOpenlist
        // eslint-disable-next-line react-hooks/rules-of-hooks
    ] = useState([]);
    const [
        closedlist,
        setClosedlist
    ] = useState([]);
    const [
        declinedList,
        setDeclinedList
    ] = useState([]);
    const [
        overallprlist,
        setOverallprlist
    ] = useState([]);

    const handleChange = (event, newValue) => {
        setTabvalue(newValue);
    };

    useEffect(() => {
        if (router.isReady && organization_name !== undefined && project_name !== undefined && environment_name !== undefined){
            console.log("TabValue :",tabvalue)
            if (tabvalue === "OPEN") {
                try {
                    const requestbody = {
                        "git": "bitbucket",
                        "project": project_name,
                        "organization": organization_name,
                        "state": tabvalue
                    };
                    const GetPullrequest = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest`;

                    updateDetails(GetPullrequest, "", requestbody, "")
                        .then((res) => {
                            if (res.response_data) {
                                setOpenlist(res.response_data)
                            } else {
                                setOpenlist([])
                            }
                        })
                        .catch((err) => {
                            console.log("Err", err.message);
                        });
                } catch (err) {
                    console.log("err", err);
                }
            } else if (tabvalue === "CLOSED") {
                try {
                    const requestbody = {
                        "git": "bitbucket",
                        "project": project_name,
                        "organization": organization_name,
                        "state": "merged"
                    };
                    const GetPullrequest = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest`;

                    updateDetails(GetPullrequest, "", requestbody, "")
                        .then((res) => {
                            if (res.response_data) {
                                setClosedlist(res.response_data)
                            } else {
                                setClosedlist([])
                            }
                        })
                        .catch((err) => {
                            console.log("Err", err.message);
                        });
                } catch (err) {
                    console.log("err", err);
                }
            } else if (tabvalue === "DECLINED") {
                try {
                    const requestbody = {
                        "git": "bitbucket",
                        "project": project_name,
                        "organization": organization_name,
                        "state": "DECLINED"
                    };
                    const GetPullrequest = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest`;

                    updateDetails(GetPullrequest, "", requestbody, "")
                        .then((res) => {
                            if (res.response_data) {
                                setDeclinedList(res.response_data)
                            } else {
                                setDeclinedList([])
                            }
                        })
                        .catch((err) => {
                            console.log("Err", err.message);
                        });
                } catch (err) {
                    console.log("err", err);
                }
            } else {
                try {
                    const requestbody = {
                        "git": "bitbucket",
                        "project": project_name,
                        "organization": organization_name,
                        "state": "ALL"
                    };
                    const GetPullrequest = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest`;

                    updateDetails(GetPullrequest, "", requestbody, "")
                        .then((res) => {
                            if (res.response_data) {
                                setOverallprlist(res.response_data)
                            } else {
                                setOverallprlist([])
                            }
                        })
                        .catch((err) => {
                            console.log("Err", err.message);
                        });
                } catch (err) {
                    console.log("err", err);
                }
            }
        }
    }, [tabvalue,router,organization_name,project_name,environment_name]);

    return (
        <div>
            {/*<ProjectLayout>*/}
                <div>
                    <div
                        style={{ display: "flex",
                        flexDirextion: "row" }}
                    >
                        <Typography variant="h3">
                            PR HISTORY
                        </Typography>
                        <Box flexGrow="1" />
                        <Button
                            sx={{borderRadius:8}}
                            color="error"
                            onClick={()=>router.push(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/pullrequests/`)}
                        >Back
                        </Button>
                        <br />
                    </div>
                    <Divider />
                    <br />
                </div>
                <br />
                <br />
                <Box sx={{
                    width: "100%",
                    typography: "body1"
                }}
                >
                    <TabContext value={tabvalue}>
                        <Box sx={{
                            borderBottom: 1,
                            borderColor: "divider"
                        }}
                        >
                            <TabList aria-label="lab API tabs example" onChange={handleChange}>
                                <Tab
                                    icon={<Icon
                                        color="primary"
                                        height={22}
                                        icon={bxGitPullRequest}
                                        width={22}
                                          />}
                                    iconPosition="start"
                                    label="OPEN"
                                    value="OPEN"
                                />
                                <Tab
                                    icon={<Icon
                                        color="primary"
                                        height={22}
                                        icon={gitMerge}
                                        width={22}
                                          />}
                                    iconPosition="start"
                                    label="CLOSED"
                                    value="CLOSED"
                                />
                                <Tab
                                    icon={<Icon
                                        color="primary"
                                        height={22}
                                        icon={gitPullRequestClosed24}
                                        width={22}
                                    />}
                                    iconPosition="start"
                                    label="DECLINED"
                                    value="DECLINED"
                                />
                                <Tab
                                    icon={<Icon
                                        color="primary"
                                        height={22}
                                        icon={bxGitPullRequest}
                                        width={22}
                                          />}
                                    iconPosition="start"
                                    label="ALL"
                                    value="ALL"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="OPEN">
                            {
                                openlist.map((name) => (
                                    <div>
                                        <PrFloatingBox details={name}/>
                                        <br />
                                    </div>

                                    ))
                            }

                        </TabPanel>
                        <TabPanel value="CLOSED">
                            {
                                closedlist.map((name) => (
                                    <div>
                                        <PrFloatingBox details={name} />
                                        <br />
                                    </div>

                                    ))
                            }
                        </TabPanel>
                        <TabPanel value="DECLINED">
                            {
                                declinedList.map((name) => (
                                    <div>
                                        <PrFloatingBox details={name}/>
                                        <br />
                                    </div>

                                ))
                            }
                        </TabPanel>
                        <TabPanel value="ALL">{
                            overallprlist.map((name) => (
                                <div>
                                    <PrFloatingBox details={name} />
                                    <br />
                                </div>

                                ))
                        }
                        </TabPanel>
                    </TabContext>
                </Box>
            {/*</ProjectLayout>*/}
        </div>
    );
}
