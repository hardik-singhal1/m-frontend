import Users from "../../../../../components/Users";
import peopleFill from '@iconify/icons-eva/people-fill';
import {Typography} from "@material-ui/core";
import React from "react";
import {Icon} from '@iconify/react';

export default function User() {
    return (
        <div>
            <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                <Icon icon={peopleFill} width={22} height={22} color={"navy"}/>
                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                    Users
                </Typography>
            </div>
            <Users />
        </div>
    )
}
