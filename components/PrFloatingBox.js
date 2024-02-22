import {Button, ButtonBase, Typography} from "@mui/material";
import {Icon} from "@iconify/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React, {useCallback, useState} from "react";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import router from "next/router";

export default function PrFloatingBox({details}) {
    const { project_name } = router.query;
    const { organization_name } = router.query;
    const { environment_name } = router.query;

    return (
        <div>
            <Paper
                component="ul"
                elevation="4"
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    listStyle: "none",
                    p: 0.5,
                    m: 0
                }}
            >
                <Box sx={{
                    p: 1.5,
                    m: 0,
                }}
                >
                    <Icon
                        height={22}
                        icon={bxGitPullRequest}
                        width={22}
                        color={'primary'}
                    />
                </Box>
                <Box sx={{
                    flexGrow:1,
                    p: 1.5,
                    m: 0,
                    width:250
                }}
                >
                    <ButtonBase
                        style={{color: 'darkgreen'}}
                        onClick={()=>router.push(`/organization/${organization_name}/projects/${project_name}/environment/${environment_name}/pullrequests/comments/${details.title}/${details.id}`)}
                    >
                        <Typography
                            align={"center"}
                            variant={"subtitle1"}
                        >
                            {details.title}
                        </Typography>
                    </ButtonBase>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    p: 1.5,
                    m: 0
                }}>
                    {
                        details.status === "MERGED" && <Typography color={"green"}>{details.status}</Typography>
                    }
                    {
                        details.status === "OPEN" && <Typography color={"orange"}>{details.status}</Typography>
                    }
                    {
                        details.status === "DECLINED" && <Typography color={"red"}>{details.status}</Typography>
                    }
                </Box>
                <Box sx={{
                    flexGrow: 0.1,
                    p: 1.5,
                    m: 0
                }}>
                    <Typography color={"lightslategrey"}>Created at {details.createdAt}</Typography>
                </Box>
            </Paper>
        </div>);
}
