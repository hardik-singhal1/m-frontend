import React, {useCallback, useState, useContext, useEffect} from 'react'
import AddIcon from "@material-ui/icons/Add";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Divider, IconButton, Typography} from "@mui/material";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";
import {Icon} from "@iconify/react";
import CreateAccessToken from "../../../../../components/CreateAccessToken";
import FloatingBox from "../../../../../components/FloatingBox";
import {AuthContext} from "../../../../../lib/authContext";
import {hostport} from "../../../../../next.config";
import {getDetails, updateDetails,createDetails} from "../../../../../utils/fetch-util";
import {ErrorContext} from "../../../../../lib/errorContext";
import {Refresh} from "@material-ui/icons";
import {useRouter} from "next/router";

export default function index() {
    const {userData} = useContext(AuthContext)
    const {errorTrigger} =useContext(ErrorContext)
    const [create,setCreate] = useState(false)
    const[accessTokens,setAccessTokens] = useState([])
    const router = useRouter();

    const handleCreateOpen = useCallback(() => {
        setCreate(true)
    })

    const [cost,setCost] = useState([])

    const handleClose = useCallback(() => {
        setCreate(false)
    })

    const [
        organizationName,
        setOrganizationName
    ] = React.useState("");

    useEffect(() => {
        setOrganizationName(router.query.organization_name)
    },[router]);

    const getAccessTokens = useCallback(() => {
        if(organizationName !== undefined && organizationName){
            try {
                let requestBody = {
                    identity: userData.identity.id
                }

                var GetAccessToken =
                    hostport +
                    `/api/v1/accesstoken/`;
                updateDetails(GetAccessToken,"",requestBody, {
                    "organization_name": organization_name
                })
                    .then((res) => {
                        if (res.response_data ){
                            setAccessTokens(res.response_data)
                        } else {
                            setAccessTokens([]);
                        }
                    })
                    .catch((err) => {
                        console.log("err",err)
                        // errorTrigger("error", JSON.stringify(err.message));
                    });
            } catch (err) {
                console.log("err",err)
                // errorTrigger("error", JSON.stringify(err.message));
            }
        }

    })

    useEffect(() => {
        if(userData !== null){
            getAccessTokens()
        }
    },[userData,create])


    useEffect(() => {
        getAccessTokens()
    },[])


function handleGetCost() {
        if(organizationName!=undefined){
            try {
                var GetCost =
                    hostport +
                    `/api/v1/organizations/${organizationName}/cost-centre`;

                getDetails(GetCost, "","","","")
                    .then((res) => {
                        if (res.response_data) {
                            setCost(res.response_data);
                        } else {
                            setRows([])
                        }
                    })
                    .catch((err) => {
                        console.log(err.message)
                    });
            } catch (err) {
                errorTrigger("err", JSON.stringify(err.message));
            }
        }
}

    return (
        <div>
        { create ? <CreateAccessToken close = {handleClose}/>:
    <div>
        <div style={{display: 'flex', flexDirection: 'row',gap:"1rem"}}>
            <Typography variant={"h5"}>Personal Access Tokens</Typography>
            <Box sx={{flexGrow: 1}}/>
            <IconButton onClick={getAccessTokens} color={"info"} ><Refresh/></IconButton>&nbsp;&nbsp;
            <Button onClick={handleCreateOpen}>
                <AddIcon/> Create Access Token
            </Button>
            <Button onClick={handleGetCost} color= "success" variant="contained">
                get cost
            </Button>
        </div>
        <br/>
        <Divider/>
        <br/>
        <Typography variant={'subtitle2'}>Tokens you have generated that can be used to access the mPaas
            API.</Typography>
        <br/>
        {
            accessTokens.map((e,index) => {
                return(
                    <div>
                    <FloatingBox name ={accessTokens[index].note} date = {accessTokens[index].expiry_date} refresh={getAccessTokens}/>
                    <br/>
                    </div>
                )
            })
        }



    </div>
}
</div>
    )
}
