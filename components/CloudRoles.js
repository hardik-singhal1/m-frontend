import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {getDetails} from "../utils/fetch-util";
import {hostport} from "../next.config";
import {useRouter} from "next/router";
import {DataGrid} from "@material-ui/data-grid";
import Chip from "@mui/material/Chip";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from "@material-ui/core/Typography";
import {Accordion, AccordionDetails, AccordionSummary, Divider, Drawer} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResizableBox } from 'react-resizable';
import CloudRoleMapping from "./CloudRoleMapping";
import {Alert} from "@mui/lab";
import {Button, ListItemText} from "@material-ui/core";
import DataGridComponent from "./DataGridComponent";
import {Box} from "@mui/system";
import 'react-resizable/css/styles.css';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const MARKED_FOR = {
    0: "UNCHANGED",
    1: "CREATION",
    2: "DELETION",
};

const CLOUD_REFLECTION = {
    0: "IN_PROGRESS",
    1: "COMPLETE",
    2: "FAILURE",
};

export default function CloudRoles(props) {
    const { role,cloud } = props;

    let router = useRouter();
    let {organization_name, project_name} = router.query;

    const [rows, setRows] = useState([]);
    const [types, setTypes] = useState([]);
    const [state, setState] = useState({
        right: false,
    });
    const [sizeState, setSize] = React.useState(600);


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: "100%",padding:'1rem' }}
            role="presentation"
        >
            <div style={{display:"flex",alignItems:"center"}}>
                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                    Role Mapping
                </Typography>
            </div>
            <Alert style={{marginTop: 40}} severity="warning">This section affects all projects under your organization! Any role mapping you do here will be reflected in all projects!</Alert>
            <div style={{marginTop: 40,width:'100%'}}>
                {
                    types.map(t => (
                        <CloudRoleMapping type={t} sailorRole={role} />
                    ))
                }
            </div>
        </Box>
    );
    const columns = [
        {
            field: "resource_id",
            headerName: "Resource ID",
            width: 250,
        },
        {
            field: "type",
            headerName: "Resource Type",
            width: 200,
        },
        {
            field: "environment",
            headerName: "Environment",
            width: 180,
        },
        {
            field: "cloud_role",
            headerName: "Cloud Role",
            width: 180,
        },
        {
            field: "marked_for",
            headerName: "Marked For",
            width: 160,
            renderCell: (params) => {
                switch (MARKED_FOR[params.value]) {
                    case MARKED_FOR[0]:
                        return (
                            <Chip icon={<HourglassBottomIcon />} label={MARKED_FOR[0]}/>
                        );
                    case MARKED_FOR[1]:
                        return (
                            <Chip icon={<AddIcon />} label={MARKED_FOR[1]} color={"success"}/>
                        );
                    case MARKED_FOR[2]:
                        return (
                            <Chip icon={<RemoveIcon />} label={MARKED_FOR[2]} color={"error"}/>
                        );
                }
            }
        },
        {
            field: "cloud_reflection",
            headerName: "Cloud Reflection",
            width: 200,
            renderCell: (params) => {
                switch (CLOUD_REFLECTION[params.value]) {
                    case CLOUD_REFLECTION[0]:
                        return (
                            <Chip icon={<HourglassTopIcon />} label={CLOUD_REFLECTION[0]} color={"warning"}/>
                        );
                    case CLOUD_REFLECTION[1]:
                        return (
                            <Chip icon={<DoneIcon />} label={CLOUD_REFLECTION[1]} color={"success"}/>
                        );
                    case CLOUD_REFLECTION[2]:
                        return (
                            // todo support retry mechanism
                            <Chip icon={<ErrorIcon />} label={CLOUD_REFLECTION[2]} color={"error"} onDelete={() => {

                            }} deleteIcon={<RefreshIcon />}/>
                        );
                }
            }
        },
        {
            field: "principal",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return params.value.replace("user:", "");
            }
        },
        {
            field: "parent_role",
            headerName: "Parent Role",
            width: 180,
            renderCell: (params) => {
                return params.value.replace("role::", "");
            }
        },
        {
            field: "group_name",
            headerName: "Group Name",
            width: 180,
            renderCell: (params) => {
                return params.value.replace("group::", "");
            }
        }
    ];

    function getData() {
        let getMappings = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/cloud/${cloud}/iam/roles?role=${role}`;

        getDetails(getMappings)
            .then(res => {
                if (res.response_data) {
                    setRows(res.response_data.map((r, i) => {
                        r.id = i;
                        return r;
                    }));
                } else {
                    setRows([]);
                }
            });

        let getTypes = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/cloud/${cloud}/iam/types`;
        getDetails(getTypes)
            .then(res => {
                if (res.response_data) {
                    setTypes(res.response_data);
                } else {
                    setTypes([]);
                }
            });
    }
    useEffect(() => {
        getData();
    }, []);

    const onClickRefresh = () => {
        getData()
    };

    return(
        <>
            <div align="right" style={{display: 'flex',justifyContent:'end'}}>
                <Button
                    align="center"
                    onClick={onClickRefresh}
                    startIcon={<RefreshIcon align="center"/>}
                    sx={{color: "#808080"}}
                />
                <div>
                        <React.Fragment key={"right"}>
                            <Button variant={"contained"} size={"small"} onClick={toggleDrawer("right", true)}>Add role mapping</Button>
                            <Drawer
                                anchor={"right"}
                                open={state["right"]}
                                onClose={toggleDrawer("right", false)}
                            >
                                <ResizableBox
                                    width={sizeState}
                                    height={"100%"}
                                    onResize={(e, data) => {
                                        setSize(data.size.width);
                                    }}
                                    axis="x"
                                    resizeHandles={['w']}
                                >
                                {list("right")}
                                </ResizableBox>
                            </Drawer>
                        </React.Fragment>

                </div>
            </div>
            <div style={{ height: 400, width: '100%', marginTop: 10}}>
                <DataGridComponent
                    columns={columns} rows={rows}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </>
    )
}