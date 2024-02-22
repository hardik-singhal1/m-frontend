import Box from "@mui/material/Box";
import {Icon} from "@iconify/react";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";
import {Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import fileTextFill from "@iconify/icons-eva/file-text-fill";

export default function TemplateList({name}) {

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
                    <Icon height={22} icon={fileTextFill} width={22}/>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    p: 1.5,
                    m: 0
                }}>
                    <Typography color={"green"}>{name}</Typography>
                </Box>
            </Paper>
        </div>
    )
}
