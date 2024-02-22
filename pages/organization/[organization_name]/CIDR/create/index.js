import {Alert, Autocomplete, Button, Divider, IconButton, Tooltip} from "@material-ui/core";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Snackbar, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import {createDetails, updateDetails} from "../../../../../utils/fetch-util";
import {hostport} from "../../../../../next.config";
import cidrRegex from "cidr-regex";
import TextfieldInfo from "../../../../../components/TextfieldInfo";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import {styled} from "@mui/material/styles";
import {tooltipClasses} from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import {SnackbarContext} from "../../../../../lib/toaster/SnackbarContext";
import CloudIcon from "@mui/icons-material/Cloud";
import isCidr from "is-cidr";


const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export default function CreateCIDR(){
    const { setSnackbar } = useContext(SnackbarContext);
    const isCidr = require("is-cidr");
    const router = useRouter()
    const organizationName = router.query.organization_name
    const [nodePool,setNodePool] = useState("")
    const [tags, setTags] = useState("")
    const [error,setError] = useState(false)
    const [err,setErr] = useState(false)
    const [errmsg,setErrmsg] = useState("")
    const [cloud,setCloud] = useState("")

    const handleCancel = useCallback(() => {
        router.push(`/organization/${organizationName}/CIDR`);
    })

    const handleCreate =  () => {
        let newValue = {
            organization : organizationName,
            node_pool: nodePool,
            tags: tags,
            cidr: [],
            cloud:cloud
        }
        let createnodepool = `${hostport}/api/v1/organizations/${organizationName}/cidr/createnodepool`

        createDetails(createnodepool, "","","", newValue)
            .then((res) => {
                setSnackbar(res.response_message,"success")
                setNodePool("")
                setTags("")
                handleCancel()
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
    }
    console.log(cloud)
    useEffect((e) => {
        if(nodePool === '255.255.255.255' || nodePool === '0.0.0.0'){
            setError(true)
        }
        else {
            setError(false)

        }
    },[nodePool])

    const hanleCheck = useCallback((e) => {
        error&&e.preventDefault()
    })

    const handleRemove = useCallback(() => {
        setNodePool(nodePool.slice(0,length-1))
    })

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <CloudIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Create CIDR
                    </Typography>
                </div>
                <div>
                    <Button onClick={handleCancel} variant={"outlined"} size={"small"} style={{marginRight:"0.5rem"}}>
                        cancel
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={handleCreate}
                        disabled={(error || nodePool.length=== 0 || tags.length === 0 || cloud.length===0 ||  !isCidr.v4(nodePool))?true:false}
                        size={"small"}
                    >
                        Create
                    </Button>
                </div>
            </div>
            <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem",paddingTop:"2rem"}}>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <Typography variant="h6">
                        Network Pool &nbsp;&nbsp;
                    </Typography>
                    <div>
                        <Typography variant="caption">
                            <LightTooltip title={"When the device is serving as a DHCP server, one or more pools of IP addresses must be defined, from which the device will allocate IP addresses to DHCP clients. Each network pool contains a range of addresses that belong to a specific subnet. These addresses are allocated to various clients within that subnet.\nHere it should be a proper Ipv4 CIDR 𝗲𝗹𝘀𝗲 𝘁𝗵𝗲 𝗰𝗿𝗲𝗮𝘁𝗲 𝗯𝘂𝘁𝘁𝗼𝗻 𝘄𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗯𝗲 𝗲𝗻𝗮𝗯𝗹𝗲𝗱 !."}>
                                <InfoTwoToneIcon
                                    sx={{color: "lightsteelblue"}}
                                />
                            </LightTooltip>
                        </Typography>
                    </div>

                </div>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <TextField
                        required
                        style={{width : 300}}
                        error={error}
                        type={"ip"}
                        size={"small"}
                        value={nodePool}
                        onKeyDown={hanleCheck}
                        helperText={error&&"Can't use reserved IP's"}
                        onChange={(event) =>
                            setNodePool(event.target.value)}
                    />

                    {
                        error&&<div>
                            &nbsp;&nbsp;
                            <Tooltip title={"backspace"}>
                                <IconButton color={"error"} onClick={handleRemove} size={"small"}><BackspaceRoundedIcon/></IconButton>
                            </Tooltip>
                        </div>

                    }
                </div>

                <br />
                <br />
                <Typography variant="h6">
                    Tag
                </Typography>
                <div>
                    <LightTooltip title={"Enter a Tag Name"}>
                        <InfoTwoToneIcon
                            sx={{color: "lightsteelblue"}}
                        />
                    </LightTooltip>
                </div>
                <TextField
                    required
                    style={{width : 300}}
                    size={"small"}
                    value={tags}
                    onChange={(event) =>
                        setTags(event.target.value)}
                />
                <br />
                <br />
                <Typography variant="h6">
                    Cloud
                </Typography>
                <div>
                    <LightTooltip title={"Enter a Tag Name"}>
                        <InfoTwoToneIcon
                            sx={{color: "lightsteelblue"}}
                        />
                    </LightTooltip>
                </div>
                <Autocomplete
                    style={{ width: 300 }}
                    options={["google","azurerm","aws"]}
                    id="controlled-demo"
                    value={cloud}
                    onChange={(e, newValue) => {
                        setCloud(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} size="small"  />}
                />

            </div>
            <br />
            <br />
            {
                err&&
                <div>
                    <br/>
                    <Paper>
                        <Snackbar open={err} onClose={() => {setErr(false)}} autoHideDuration={5000}>
                            <Alert onClose={() => {setErr(false)}} severity={"error"} >{errmsg}</Alert>
                        </Snackbar>
                    </Paper>

                    <br/>
                </div>
            }
        </div>
    )
}
