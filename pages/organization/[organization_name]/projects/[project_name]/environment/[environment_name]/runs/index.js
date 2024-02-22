import * as React from 'react';
import {DataGrid, GridRenderColumnsProps} from "@material-ui/data-grid";
import {useCallback, useContext, useEffect, useState, useRef} from "react";
import {hostport} from "../../../../../../../../next.config";
import {getDetails} from "../../../../../../../../utils/fetch-util";
import {useRouter} from "next/router";
import {SnackbarContext} from "../../../../../../../../lib/toaster/SnackbarContext";
import SchemaIcon from "@mui/icons-material/Schema";
import Typography from "@material-ui/core/Typography";
import playCircleFill from '@iconify/icons-eva/play-circle-fill';
import { Icon } from '@iconify/react';
import {Refresh} from "@material-ui/icons";
import DataGridComponent from "../../../../../../../../components/DataGridComponent";
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {Button, ButtonBase} from "@mui/material";

const options={
    "Off":0,
    "5s":5000,
    "10s":10000,
    "20s":20000,
    "30s":30000
}

export default function Runs() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [refreshInterval, setRefreshInterval] = useState( 0);

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setRefreshInterval(Object.values(options)[index])
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const router = useRouter();
    const { setSnackbar } = useContext(SnackbarContext);
    const [isRunsLoading,setIsRunsLoading] = useState(false);

    const columns = [
        { field: 'run_number',
            headerName: 'ID',
            width: 120,
        },
        { field: 'state',
            headerName: 'State',
            width: 130,
            renderCell: params => {
                let c;
                switch (params.value) {
                    case "COMPLETED":
                        c = "lightgreen";
                        break;
                    case "FAILED":
                        c = "indianred";
                        break;
                    case "RUNNING":
                        c = "gold";
                        break;
                }
                return (
                    <Button style={{color:c,border:"1px solid",borderRadius:"2rem",height:"2rem"}} onClick={
                        ()=>{
                            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs/logs/${params.row.id}`)
                        }
                    }>
                        {params.value}
                    </Button>
                )
            }
        },
        { field: 'run_type',
            headerName: 'Run Type',
            width: 180,
            renderCell: params => {
                return (
                    <a>
                        {params.value}
                    </a>
                )
            }
        },
        { field: 'branch',
            headerName: 'Branch',
            width: 250,
            renderCell: params => {
                return (
                    <a>
                        {params.value}
                    </a>
                )
            }
        },
        { field: 'created_at',
            headerName: 'Created At',
            width: 200,
            renderCell: params => {
                return (
                    <a>
                        {params.value}
                    </a>
                )
            }
        },
    ];
    const { project_name : projectName } = router.query;
    const { organization_name: organizationName } = router.query;
    const { environment_name: environmentName } = router.query;



    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(refresh, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    useEffect(async () => {
        if(router.isReady){
            await refresh();
            if(router.query.refresh){
                setRefreshInterval(5000);
                setSelectedIndex(1);
            }
        }
    }, [router]);

    async function refresh() {
        try {
            setIsRunsLoading(true);
            let url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/terraform/runs`
            let res = await getDetails(url, "", "", "", "")
            setIsRunsLoading(false);
            if (res !== null && typeof res !== "undefined" && Array.isArray(res.response_data)) {
                setRows(res.response_data);
            }
        } catch (e) {
            setIsRunsLoading(false);
        }
    }

    return (
        <div>
            <div>
                <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                    <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                        <Icon
                            icon={playCircleFill}
                            height={22}
                            width={22}
                            color="navy"
                        />
                        <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                            Runs
                        </Typography>
                    </div>
                    <div>
                        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                            <Button onClick={refresh} size={"small"} startIcon={<RefreshIcon/>}/>
                            <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                            >
                                {Object.keys(options)[selectedIndex]}
                                {open ?  <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                            </Button>
                        </ButtonGroup>
                        <Popper
                            sx={{
                                zIndex: 1,
                            }}
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                                {Object.keys(options).map((option, index) => (
                                                    <MenuItem
                                                        key={option}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                        style={{width:"7rem"}}
                                                    >
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </div>
                <div style={{height:"60vh"}}>
                    <DataGridComponent
                        rows={rows}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[5]}
                        loading={isRunsLoading}
                    />
                </div>
            </div>
        </div>
    );
}
