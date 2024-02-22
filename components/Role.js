import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as React from "react";
import {useState} from "react";
import AddUsers from "./AddUsers";
import router, {useRouter} from "next/router";
import {Typography} from "@material-ui/core";
import CloudRoles from "./CloudRoles";
import {productname} from "../next.config";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    console.log("propss",props)
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}

export default function Role(props) {
    const { level } = props;
    const [value, setValue] = useState(0);
    const router = useRouter();
    const { role } = router.query;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <>
            {/*<Typography variant="h4">{role}</Typography>*/}
            <div style={{display:"flex",alignItems:"center"}}>
                <ManageAccountsIcon style={{color:"navy"}}/>
                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                    {role}
                </Typography>
            </div>
            <br/>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} TabIndicatorProps={{
                        style: {
                            backgroundColor: "orange"
                        }
                    }}>
                        <Tab label="ROLE ASSIGNMENTS" value={0} />
                        <Tab label="GCP" value={1}/>
                        //TODO: change depending on project
                        {!true&&
                            <Tab label="Azure" value={2}/>
                        }
                        {/*<Tab label="AWS" value={3}/>*/}
                    </Tabs>
                </Box>
            </Box>
            <TabPanel value={value} index={0}>
                <AddUsers level={level}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CloudRoles role={role} cloud={"gcp"}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CloudRoles role={role} cloud={"azure"}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <CloudRoles role={role} cloud={"aws"}/>
            </TabPanel>
        </>
    )
}
