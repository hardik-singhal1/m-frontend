import {hostport} from "../../../../../../../../../next.config";
import router from "next/router";
import {getDetails} from "../../../../../../../../../utils/fetch-util";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {ErrorContext} from "../../../../../../../../../lib/errorContext";
import {alpha, Button, ButtonBase, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import makeStyles from "@material-ui/styles/makeStyles";
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import {DataGrid} from "@material-ui/data-grid";
import Typography from "@material-ui/core/Typography";
import {Box} from "@mui/system";
import TableRowsIcon from '@mui/icons-material/TableRows';
import DataGridComponent from "../../../../../../../../../components/DataGridComponent";


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
export default function Table(){

    const columns = [
        {
            field: "type",
            headerName: "Resource",
            width: 300
        },
        {
            field: "id",
            headerName: "Resource ID",
            width: 500
        },
        {
            field:"created_at",
            headerName: "Created At",
            width: 200
        }
    ];

    const classes = useStyles();
    const {organization_name,project_name,environment_name}=router.query;
    const {errorTrigger} = useContext(ErrorContext);
    const [data,setData]=useState([]);
    const [search, setSearch] = React.useState("");
    const [tempArray, setTempArray] = useState([])
    const getResources = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/resources/`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if(res.response_data){
                        let tempData=[];
                        let filteredData = res.response_data.filter(item => item.environment === environment_name)
                        filteredData.forEach((item)=>{
                            if(item.resource_attributes){
                                let x={...item}
                                x.id=JSON.parse(item.resource_attributes).id;
                                tempData.push(x)
                            }
                        })
                        setData(tempData);
                        setTempArray(tempData)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    useEffect(()=>{
        if(organization_name!==undefined || project_name!==undefined){
            getResources();
        }
    },[router,organization_name,project_name])

    useEffect(() => {
        setData(tempArray)
        let filter = tempArray.filter((e) =>(e.type.includes(search) || e.resource_id.includes(search) || e.created_at.includes(search)))
        setData(filter)
    }, [search])
    return(
        <div>
            <div>
                <div style={{paddingBottom:"1rem",display:"flex",alignItems:"center"}}>
                    <TableRowsIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Inventory Table
                    </Typography>
                </div>
                <div style={{paddingBottom:"0.5rem"}}>
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
                </div>
                <div style={{height: "55vh", width: "100%"}}>
                    <DataGridComponent
                        columns={columns}
                        pageSize={5}
                        rows={data}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </div>
        </div>
    )
}
