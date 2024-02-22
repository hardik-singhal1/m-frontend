import React, {useCallback,useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography'
import {withStyles} from "@material-ui/styles";
import {TextField} from "@mui/material";
import {Autocomplete} from "@material-ui/core";
import { indexOf } from 'lodash';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(() => ({
    root: {
        height: 300,
        width: 600
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

export default function TemplateDialogue({close, data, templateContent}) {
    const [name, setName] = useState("")
    const [values, setValues] = useState("")
    const [options, setOptions] = useState([".tf", ".tfvars"])

    const handleClose = () => {
        let newVal = name + values
        data(newVal)
        close()
    };
    const handleRender = useCallback((event) => {
        return (<div>
                <TextField {...event} size="small"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>

        )

    })

    return (
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    File Details
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        File Name :
                        <br/>
                        <br/>
                        <TextField sx={{width: 300}} size={"small"} onChange={(e) => {
                            setName(e.target.value)
                        }}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <br/>
                        <br/>
                        File Type :
                        <br/>
                        <br/>

                        <Autocomplete
                            style={{width: 300}}
                            options={options}
                            id="controlled-demo"
                            loading='lazy'
                            value={values}
                            onChange={(e, newValue) => {
                                setValues(newValue);
                            }}
                            renderInput={(params) => handleRender(params)}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <br/>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary" variant={"contained"}>
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

