import {Button, Grid} from "@material-ui/core";
import {Refresh} from "@material-ui/icons";
import {DataGrid} from "@material-ui/data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from "react";
import {Autocomplete} from "@mui/lab";
import {TextField} from "@mui/material";
import DataGridComponent from "./DataGridComponent";
import moment from "moment";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius:'1%',
    boxShadow: 24,
    p: 4,
};


export default function Logs(props) {

    const userColumn = [
        {
            field: 'time_stamp',
            headerName: 'Time',
            renderCell: (params) => {
                const temp=params?.row?.time_stamp?.split(" ");
                const date=`${temp[1]} ${temp[2]} ${temp[3]}`
                        return `${moment(temp[0])?.format('MM/DD/YY')}  ${temp[1]}`;
                        },
            width: 200,
        },
        {
            field: 'activity',
            headerName: 'Activity',
            width: 150,
        },
        {
            field: 'operating_system',
            headerName: 'Operating System',
            width: 200,
        },
        {
            field: 'ip',
            headerName: 'IP',
            width: 375,
        },
        {
            field: 'browser',
            headerName: 'Browser',
            width: 150,
        },
        {
            field: "request_body",
            headerName: "Request Body",
            width: 200,
            renderCell: (params) => {
                const [open, setOpen] = React.useState(false);
                const handleOpen = () => setOpen(true);
                const handleClose = () => setOpen(false);
                return (
                    <div>
                        <Button onClick={handleOpen}>Request Body</Button>
                        <Modal
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                                    {params.value}
                                    {/*{JSON.stringify(params.value,null,2).replace(/\\/g,"" )}*/}
                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                );
            },
        },
    ];

    return (
        <Grid>
            <div style={{ height: "65vh",
                width: "100%" }}
            >
                <DataGridComponent
                    columns={userColumn}
                    pageSize={props.logData.length>100?100:props.logData.length}
                    rows={props.logData}
                    rowsPerPageOptions={[5]}
                />
            </div>
        </Grid>
    );
}
