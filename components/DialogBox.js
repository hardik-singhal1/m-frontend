import React, {useCallback, useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, Button, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';


export default function DialogBox({accessToken,close}) {
    const [text, setText] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [visiblity,setvisiblity] = useState(false)

    const handleClose = useCallback(() => {
        close()
    })

    const onCopyText = useCallback(() => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    });

    const handleVisiblityChange = useCallback(() => {
        setvisiblity(true)
    })
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Your Access Token"}
                </DialogTitle>
                <DialogContent>
                    <Divider/>
                    <br/>
                    <DialogContentText >
                        Please note down your access token. The token would be visible only once
                        <br/>
                    </DialogContentText>
                    <br/>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <div style={{display:'flex',flexDirection:'row'}}></div>
                        <Typography variant={'h6'} sx={{ mt: 2}} >
                            <CopyToClipboard text={accessToken} onCopy={onCopyText}>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    {accessToken}&nbsp;
                                    { visiblity?
                                            <DoneAllRoundedIcon color={"success"}/>
                                        :
                                        <IconButton onClick={handleVisiblityChange}><ContentCopyIcon/></IconButton>
                                    }
                                </div>
                            </CopyToClipboard>

                        </Typography>
                    </Box>
                    <br/>
                    <Divider/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={"error"}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
