import {AuthContext} from "../../../../../../../../../lib/authContext"
import {
    alpha,
    Button,
    ButtonBase,LinearProgress,
    TextField,
    Typography
} from "@material-ui/core";
import {DataGrid, GridOverlay} from "@material-ui/data-grid";
import {ErrorContext} from "../../../../../../../../../lib/errorContext";
import {getDetails} from "../../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../../next.config";
import {useRouter} from "next/router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import makeStyles from "@material-ui/styles/makeStyles";
import SearchIcon from '@material-ui/icons/Search';
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import {Box} from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DataGridComponent from "../../../../../../../../../components/DataGridComponent";
import Link from "@material-ui/core/Link";

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
export default function Catalog() {
    const classes = useStyles();
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const environmentName = router.query.environment_name
    const project_name=router.query.project_name;
    const [
        search,
        setSearch
    ] = React.useState("");
    const [
        catalogRows,
        setResourceRows
    ] = React.useState([]);
    const {errorTrigger} = useContext(ErrorContext);

    const [tempArray, setTempArray] = useState([])



    const columns = [
        {
            field: "type",
            headerName: "Resource",
            renderCell: (params) => {
                return (
                    <Link
                        onClick={() => {
                            router.push(`/organization/${organizationName}/projects/${project_name}/environment/DEV/inventory/resources/${params.row.type}/${params.row.id}`)
                        }}
                        style={{
                            textDecoration:"none",
                            cursor:"pointer",
                            color:"blue"
                        }}
                    >
                        {params.value}
                    </Link>
                );
            },
            width: 400
        },
        {
            field: "resource_id",
            headerName: "Resource ID",
            width: 300
        }
    ];


    const getResources = () => {
        try {
            setIsLoading(true);
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${project_name}/resources/`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if(res.response_data){
                        // res.response_data.map((item,i)=>{
                        //     item.id = i
                        // })
                        setResourceRows(res.response_data);
                        setTempArray(res.response_data)
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    useEffect(() => {
        if(organizationName !== undefined && project_name !== undefined) {
            getResources();
        }
    }, [router])


    const refresh = useCallback(() => {
        getResources();
    }, [router]);

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <LinearProgress/>
                </div>
            </GridOverlay>
        );
    }


    useEffect(() => {
        setResourceRows(tempArray)
        let filter = tempArray.filter((e) => (e.type.includes(search)))
        setResourceRows(filter)
    }, [search])

    const handleTabChange = (e,newValue) => {
        if(newValue==="Catalogs") router.push(`/organization/${organizationName}/projects/${project_name}/environment/${environmentName}/inventory/catalogs`)
    };

    const [isLoading,setIsLoading] = useState(false);

    return (
        <div>
        <div>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={"Resources"}
                    onChange={handleTabChange}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: "orange"
                        }
                    }}
                >
                    <Tab value="Catalogs" label="Catalogs" sx={{fontWeight:"bold",fontSize:"1rem"}}/>
                    <Tab value="Resources" label={<span style={{color:"navy"}}>Resources</span>} sx={{fontWeight:"bold",fontSize:"1.5rem"}} sx={{fontWeight:"bold",fontSize:"1.5rem"}}/>
                </Tabs>
            </Box>
            <br/>
            {<div style={{
                height: 400,
                width: "100%"
            }}
            >
                <div style={{
                    height: 400,
                    width: "100%"
                }}
                >
                    <div style={{display: "flex", flexDirection: "row",paddingBottom:"0.7rem"}}>
                        <div className={classes.root}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <TextField
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                    }}
                                    variant="standard"
                                    placeholder="Search…"
                                    size={"small"}
                                    style={{width: 300}}
                                />
                            </div>

                        </div>
                        <Button
                            align="center"
                            onClick={refresh}
                            startIcon={<RefreshIcon align="center"/>}
                            sx={{color: "#808080"}}
                        />
                        {" "}
                    </div>
                    <div style={{height:"50vh",overflow:"auto"}}>
                        <DataGridComponent
                            columns={columns}
                            pageSize={5}
                            rows={catalogRows}
                            rowsPerPageOptions={[5]}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
        </div>
    )
}

