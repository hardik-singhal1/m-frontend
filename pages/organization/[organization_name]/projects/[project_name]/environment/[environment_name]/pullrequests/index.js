import {Box, Button, Divider, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import router from "next/router";
import ProjectLayout from "../../../../../../../../../../../components/project/ProjectLayout";
import Difference from "../../../../../../../../../../../components/pull_request/difference/Difference";
import Comments from "../../../../../../../../../../../components/pull_request/comments/Comments";
import {updateDetails} from "../../../../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../../../../next.config";
import DescriptionIcon from '@material-ui/icons/Description';
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import {Icon} from "@iconify/react";

export default function CommentsPR() {
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;
    const {pull_request} = router.query;
    const {pull_request_id} = router.query;
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (organization_name !== undefined && project_name !== undefined && environment_name !== undefined) {
            let payload = {
                "git": "bitbucket",
                "project": project_name,
                "organization": organization_name,
                "change_request_id": pull_request_id,
                "changeRequestComment": "changeRequestComment testing in this PR"
            }
            updateDetails(`${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest/diff`, "", payload, "")
                .then((res) => {
                    if(res.response_data) {
                        setFiles(res.response_data)
                    }else {
                        setFiles([])
                    }
                })
                .catch((err) => console.log("Error", err.message))
        }
    }, [organization_name,project_name,environment_name,router])

    return (
        <div>
            <div  style={{display:"flex",flexDirection:"row" ,overFlow:"auto"}}>
                <Typography
                    variant={"h4"}
                >
                    <Icon
                        color="primary"
                        height={25}
                        icon={bxGitPullRequest}
                        width={50}
                    />
                    {pull_request}
                </Typography>
                <Box flexGrow={1}/>
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    sx={{borderRadius:8}}
                    size={"small"}
                    onClick={()=>router.push(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/pullrequests/prhistory`)}
                >
                    Back
                </Button>
            </div>
            <br/>
            <Comments /><br/><br/>
            <br/>
            <Divider/>
            <br/>
            <div style={{display:"flex",flexDirection:"row"}}>
                <DescriptionIcon/> &nbsp;
                <Typography variant={"h6"}>
                    <b>Files Changed</b>
                </Typography>
            </div>
            <br/>
            <Difference files={files}/>
        </div>
    )
}
