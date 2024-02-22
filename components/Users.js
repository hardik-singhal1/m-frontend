import * as React from "react";
import {alpha, Button, Grid, TextField} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { ErrorContext } from "../lib/errorContext";
import { Refresh } from "@material-ui/icons";
import { getDetails } from "../utils/fetch-util";
import {hostport, hostport1} from "../next.config";
import {useRouter} from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import makeStyles from "@material-ui/styles/makeStyles";
import DataGridComponent from "./DataGridComponent";

const userColumn = [
    {
        editable: true,
        field: "name",
        headerName: "Name",
        width: 200

    },
    {
        editable: true,
        field: "email",
        headerName: "Mail",
        width: 300

    },
    {
        editable: true,
        field: "state",
        headerName: "Status",
        renderCell: (params) => (params.value === "active"
            ? <Button sx={{ color: "white",backgroundColor:"navy"}} variant={"contained"}>{`${params.value}`}</Button>
            : <Button sx={{ color: "white",backgroundColor:"red" }} variant={"contained"}>{`${params.value}`}</Button>),
        width: 150
    }
];
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 33),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));

export default function Users() {
    const classes = useStyles()
    const [
        users,
        setUsers
    ] = useState([]);
    const [search,setSearch]=useState("");
    const [tempUsers,setTempUsers] = useState([]);
    const { errorTrigger } = useContext(ErrorContext);

    const router = useRouter()
    const [organizationName,setOrganizationName]=useState("");
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])
    useEffect(() => {
        setUsers(tempUsers)
        let filter = tempUsers.filter((e) => (e.name.toLowerCase().includes(search.toLowerCase()) || e.name.toUpperCase().includes(search.toUpperCase())))
        setUsers(filter)
    }, [search])


    const getIdentity = () => {
        try {
            const GetUsers = `${hostport }/api/v1/iam/identities`;

            getDetails(GetUsers, "","organization",`organizations/${organizationName}`)
                .then((res) => {
                    for (let iter = 0; iter < res.response_data.length; iter++) {
                        res.response_data[iter].id = iter;
                    }

                    setUsers(res.response_data);
                    setTempUsers(res.response_data);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    useEffect(() => {
        if(organizationName){
            getIdentity();
        }
    }, [organizationName]);

    const onClickRefresh = ()=> {
        getIdentity();
    };

    return (
        <Grid>
            <div style={{display: "flex", flexDirection: "row",paddingBottom:"0.5rem"}}>
                <div className={classes.root}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <TextField
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            variant={"standard"}
                            placeholder="Search…"
                            size={"small"}
                            style={{width: 300}}
                        />
                    </div>

                </div>
                <Button
                    align="center"
                    onClick={onClickRefresh}
                    startIcon={<RefreshIcon align="center"/>}
                    sx={{color: "#808080"}}
                />
            </div>
            <div style={{ height: "65vh",
                width: "100%" }}
            >
                <DataGridComponent
                    height="100%"
                    columns={userColumn}
                    disableSelectionOnClick
                    pageSize={5}
                    rows={users}
                    rowsPerPageOptions={[7]}
                />
            </div>
        </Grid>
    );
}
