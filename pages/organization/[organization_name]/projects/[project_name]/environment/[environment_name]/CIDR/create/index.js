import {Box, Button, IconButton, Snackbar, Typography} from "@mui/material";
import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import React, {useCallback, useContext, useEffect, useState, useRef} from "react";
import {useRouter} from "next/router";
import {Divider} from "@mui/material";
import {TextField} from "@mui/material";
import {hostport} from "../../../../../../../../../next.config";
import {createDetails, getDetails, updateDetails} from "../../../../../../../../../utils/fetch-util";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {Alert, Autocomplete, Tooltip} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import * as PropTypes from "prop-types";
import {styled} from "@mui/material/styles";
import {tooltipClasses} from "@mui/material/Tooltip";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import CloudIcon from "@mui/icons-material/Cloud";
import TextfieldInfo from "../../../../../../../../../components/TextfieldInfo";

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


export default function PullRequests() {
    const { setSnackbar } = useContext(SnackbarContext);

    const [
        rows,
        setRows
    ] = useState([]);
    const [err,setErr] = useState(false)
    const [netmask, setNetmask] = useState("")
    const [network, setNetwork] = useState([])
    const [subnet, setSubnet] = useState([])
    const [open, setOpen] = useState(false)
    const [primaryCIDRBlock,setPrimaryCIDRBlock] = useState("")
    const [secondaryCIDRBlock,setSecondaryCIDRBlock] = useState("")
    const [error,setError] = useState(false)
    const [newNetwork, setNewNetwork] = useState("")
    const [newSubnet, setNewSubnet] = useState("")
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [tag,setTag] = useState("")
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const environmentName = router.query.environment_name;
    const [neterr,setNeterr] = useState(false)
    const columns = [
        {
            field: "network_link",
            headerName: "Network",
            width: 180

        },
        {
            field: "subnet_link",
            headerName: "Subnet",
            width: 180
        },
        {
            field: "value",
            headerName: "Value",
            width: 180
        }
    ];

    const handleClose = useCallback(() => {
        setOpen(!open)
        handleCloseBack()
    })

    const [pool, setPool] = useState([])

    const getNodePool = useCallback(async () => {
        let getcidr = `${hostport}/api/v1/organizations/${organizationName}/cidr/`
        await getDetails(getcidr, "", "", "", "")
            .then((res) => {
                if(res.response_data){
                    let node_pool = res.response_data.map((e) => {
                        return {label: `${e.tags}-${e.node_pool}`, node_pool: e.node_pool, id: e.id}
                    })
                    setPool(node_pool)
                    setNodepool(res.response_data)
                }
            })
            .catch((err) => console.log(err))
    })

    const getCIDR = useCallback(async () => {
        let getcidr = `${hostport}/api/v1/organizations/${organizationName}/cidr/`
        await getDetails(getcidr, "", "", "", "")
            .then((res) => {
                if(res.response_data){
                    let primary_ip = []
                    for(var i=0;i<res.response_data.length;i++){
                        if(res.response_data[i].id === value.id){
                            if(res.response_data[i].cidr.length) {
                                res.response_data[i].cidr.map((e) => {
                                    primary_ip.push(e.network_cidr)
                                })
                            }
                        }
                    }
                    setNetwork(primary_ip)
                }
            })
            .catch((err) => console.log(err))
    })

    const handleCloseBack = useCallback(async () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/CIDR`)
    })



    const handleCloseCreate = useCallback(async () => {
        let createcidr = {
            network_cidr : value.node_pool,
            existing_cid_rs: network,
            new_netmask:Number(netmask),
            project_id: `organization/${organizationName}/projects/${projectName}`,
        }

        const calculatesubnet = `${hostport}/api/v1/organizations/${organizationName}/cidr/calculate-new-subnet`
        await updateDetails(calculatesubnet,"",createcidr)
            .then(async (res) => {
                const createcidrurl = `${hostport}/api/v1/organizations/${organizationName}/cidr/create`
                setPrimaryCIDRBlock(res.response_data)
                let create = {
                    network_cidr : res.response_data,
                    existing_cid_rs: [],
                    new_netmask:Number(netmask),
                    tag : tag,
                    project_id: `organization/${organizationName}/projects/${projectName}`,
                    id: value.id,
                }

                await createDetails(createcidrurl, "", "", "", create)
                    .then((res) => {
                        if(!res?.is_error) {
                            setSnackbar(res.response_message,"success")
                            setOpen(true)
                            getCIDR();
                        }
                    })
                    .catch((err) => {
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    })
            })
            .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                }

            )


    });


    useEffect(() => {
        getCIDR()
        getNodePool()
    },[])

    useEffect(() => {
        getCIDR()
        getNodePool()
    },[value])

    const [nodepool, setNodepool] = React.useState([]);

    const handleChange = (event) => {
        setNodepool(event.target.value);
    };

    useEffect(() => {
        setNetmask("")
    },[open])

//error handling
// Number(value.split("/")[1])
// this method helps us to seperate the cidr value from network pool

    useEffect(() => {
        if(Number(netmask )> 0 && Number(netmask) <33 || netmask === "" ){
            setError(false)
        }

        else {
            setError(true)
        }
    },[netmask])

    const Infocomponent = useCallback((info) => {
        return(
            <Typography variant="caption">
                <LightTooltip title={info}>
                    <InfoTwoToneIcon
                        sx={{color: "lightsteelblue"}}
                    />
                </LightTooltip>
            </Typography>
        )
    })


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Your CIDR"}
                </DialogTitle>
                <DialogContent>
                    <Divider/>
                    <br/>
                    <DialogContentText >
                        Here is your new cidr value
                        <br/>
                    </DialogContentText>
                    <br/>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <div style={{display:'flex',flexDirection:'row'}}></div>
                        <Typography variant={'h6'} sx={{ mt: 2}} >
                            New Network Cidr   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {primaryCIDRBlock}
                        </Typography>
                    </Box>
                    <br/>
                    <Divider/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={"error"}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <CloudIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Create CIDR
                    </Typography>
                </div>
                <div>
                    <Button
                        onClick={handleCloseBack}
                        variant={"outlined"}
                        size={"small"}
                        style={{marginRight:"0.5rem"}}
                    >
                        cancel
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={handleCloseCreate}
                        disabled={error || netmask === "" || tag === "" || value === null}
                        size={"small"}
                    >
                        Generate
                    </Button>
                </div>
            </div>
            <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                <div>
                    <div style={{display:"flex" , flexDirection :"column"}}>
                        <TextfieldInfo
                            name={"Network pool *"}
                            info={"When the device is serving as a DHCP server, one or more pools of IP addresses must be defined, from which the device will allocate IP addresses to DHCP clients. Each network pool contains a range of addresses that belong to a specific subnet. These addresses are allocated to various clients within that subnet.\nHere it should be a proper Ipv4 CIDR."}
                        />
                    </div>
                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        options={pool}
                        sx={{ width: 300 }}
                        size={"small"}
                        renderInput={(params) => <TextField {...params} label="" />}
                    />
                </div>
                <div>
                    <div  style={{display:"flex" , flexDirection :"row"}}>
                        <TextfieldInfo
                            name={"Netmask *"}
                            info={"A netmask is a 32-bit binary mask used to divide an IP address into subnets and specify the network's available hosts.\n" +
                                "\n" +
                                "In a netmask, two of the possible addresses, represented as the final byte, are always pre-assigned and unavailable for custom assignment. For example, in 255.255.225.0, \"0\" is the assigned network address. In 255.255.255.255, the final \"255\" is the assigned broadcast address. These two values cannot be used for IP address assignment.\n" +
                                "\n"}
                        />
                    </div>
                    <TextField
                        required
                        style={{width : 300}}
                        size={"small"}
                        value={netmask}
                        error={error || neterr}
                        helperText={(error&&"netmask value should be in the range 1<=netmask<=31" )|| (neterr&&"netmask value should be greater than cidr value")}
                        onChange={(event) =>
                            setNetmask(event.target.value)}
                    />
                </div>
                <div>
                    <TextfieldInfo
                        name={"Tag *"}
                        info={"Enter a Tag name"}
                    />
                    <TextField
                        style={{width : 300}}
                        size={"small"}
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />
                </div>
                {
                    err&&
                    <div>
                        <br/>
                        <Paper>
                            <Snackbar open={err} onClose={() => {setErr(false)}} autoHideDuration={5000}>
                                <Alert onClose={() => {setErr(false)}} severity={"error"} >"Please Enter Valid Netmask value"</Alert>
                            </Snackbar>
                        </Paper>

                        <br/>
                    </div>
                }
            </div>
        </div>
    );
}
