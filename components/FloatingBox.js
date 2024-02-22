import React, {useCallback,useEffect,useContext} from 'react'
import Box from "@mui/material/Box";
import {Icon} from "@iconify/react";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";
import {Button, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {AuthContext} from "../lib/authContext";
import {hostport} from "../next.config";
import {deleteDetails} from "../utils/fetch-util";
import {ErrorContext} from "../lib/errorContext";

export default function FloatingBox({name,date,refresh}) {
    const {userData} = useContext(AuthContext)
    const {errorTrigger} = useContext(ErrorContext)

    const handleDelete = useCallback((name) => {
        var requestBody = {
            note : name,
            identity : userData.identity.id
        }
        const deleteAccessToken = hostport +'/api/v1/accesstoken/'

        deleteDetails(deleteAccessToken,"","","",requestBody)
            .then(() => {
                refresh()
            })
            .catch((err) => {
                errorTrigger("error", JSON.stringify(err));
            });
        refresh()

    })

    return (
        <div>
            <Paper
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
                elevation="4"
                component="ul"
            >
                <Box sx={{
                    p: 1.5,
                    m: 0
                }}>
                    <Icon height={22} icon={bxLockAlt} width={22}/>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    p: 1.5,
                    m: 0
                }}>
                    <Typography color={"green"}>{name}</Typography>
                </Box>

                <Box sx={{
                    flexGrow: 0.1,
                    p: 1.5,
                    m: 0
                }}>
                    <Typography color={"lightslategrey"}>Expires on {date}</Typography>
                </Box>
                <Box sx={{
                    p: 1,
                    m: 0
                }}>
                    <Button color={"error"} name={name} onClick={(event) => handleDelete(event.target.name)}>Revoke</Button>
                </Box>
            </Paper>
        </div>
    )
}
