import React from "react";
import {Typography} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export default function TextfieldInfo({name, info}){
    return (
        <div style={{padding:'1rem 0'}}>
            <Typography variant="inherit" sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`, color:'rgba(75,75,75,0.91)'}}>
                {name}
            </Typography>
            {/*{*/}
            {/*    info != "" &&*/}
            {/*    <div>*/}
            {/*        <Typography variant="caption">*/}
            {/*            <LightTooltip title={info}>*/}
            {/*                <InfoTwoToneIcon*/}
            {/*                    sx={{color: "lightsteelblue"}}*/}
            {/*                />*/}
            {/*            </LightTooltip>*/}
            {/*        </Typography>*/}
            {/*        <br/>*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    )
}