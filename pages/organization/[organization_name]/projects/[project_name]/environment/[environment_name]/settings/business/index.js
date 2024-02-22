import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import {Button, TextField, Typography} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import {Divider, IconButton, ListItem} from "@mui/material";
import TextfieldInfo from "../../../../../../../../../components/TextfieldInfo";
import {Box} from "@mui/system";
import Grid from "@mui/material/Grid";
import {useRouter} from "next/router";
import {hostport} from "../../../../../../../../../next.config";
import {createDetails, getDetails, updateDetails} from "../../../../../../../../../utils/fetch-util";
import {Delete} from "@material-ui/icons";
import {GridAddIcon} from "@material-ui/data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";
import {AuthContext} from "../../../../../../../../../lib/authContext";

export default function Settings(){
    const { setSnackbar } = useContext(SnackbarContext);
    const {userData} = useContext(AuthContext);
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName] = useState("");
    const router = useRouter();
    const [projectDetails,setProjectDetails]=useState(null);
    const [
        complianceValue,
        setComplianceValue
    ] = useState("")
    const [
        bussinessunit,
        setBussinessunit
    ] = useState("");
    const [
        availability,
        setAvailability
    ] = React.useState("")
    const [handOver,setHandOver] = useState("No");

    const BU_options=[
        "CERO",
        "Farm Equipment",
        "Gromax Agri Equipment ltd",
        "Group Corporate (GCO)",
        "Mahindra Aerospace ltd",
        "Mahindra Agri",
        "Mahindra Auto Division",
        "Mahindra Consulting Engineering",
        "Mahindra Electric",
        "Mahindra Farm Division",
        "Mahindra First choice services",
        "Mahindra First choice wheels",
        "Mahindra Gears and Transformation",
        "Mahindra Integrated Busniess Solutions",
        "Mahindra Lifespace Developers Ltd",
        "Mahindra Logistics Ltd",
        "Mahindra Marine Pvt Ltd.",
        "Mahindra Racing",
        "Mahindra Special Services Group",
        "Mahindra Susten Pvt Ltd",
        "Mahindra Truck & Bus Division",
        "Mahindra Two wheelers Ltd",
        "Mahindra USA Inc",
        "Mahindra Ugine Steel Company",
        "Mahindra United Ball",
        "SBU",
        "SSU",
        "Swaraj Division",
        "TEQO",
        "Others"
    ]

    const [
        costcenter,
        setCostcenter
    ] = useState("");
    const [
        disval,
        setDisval
    ] = useState("")
    const [
        costcenterpercentage,
        setCostcenterpercentage
    ] = useState("");
    const [chipData, setChipData] = useState([]);

    const [access,setAccess] = useState(false);

    const checkAccess = () =>{
        const checkApiValue = {
            level:"organization",
            object:`organizations/${router.query.organization_name}`,
            identity:"identity::"+userData.identity.id,
            action:"write_projects"
        }
        try{
            createDetails(`${hostport}/api/v1/iam/roles/check`,"","organization",`organizations/${router.query.organization_name}`,checkApiValue)
                .then((res) => setAccess(true))
                .catch((err) => setAccess(false))
        }catch(e){
            console.log(e);
        }
    }


    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name)
        }
    },[router]);

    useEffect(()=>{
        if(router.isReady && userData!==null){
            checkAccess()
        }
    },[router,userData]);

    const [rpo, setRpo] = useState("");
    const [rto, setRto] = useState("");
    useEffect(()=>{
        if(organizationName && projectName){
            getProjects();
        }
    },[organizationName,projectName]);
    useEffect(()=>{
        if(projectDetails!==null){
            setBussinessunit(projectDetails.tags.business_unit);
            setRpo(projectDetails.tags.disaster_recovery.RPO);
            setRto(projectDetails.tags.disaster_recovery.RTO);
            let temp=[];
            projectDetails.tags?.cost_centre?.map((item,i)=>temp.push({...item,...{"key":i}}));
            setChipData(temp);
            setComplianceValue(projectDetails.tags.compliance)
            setAvailability(projectDetails.tags.availability)
            if(projectDetails.tags.hand_over===true) setHandOver("Yes")
            else setHandOver("No")
        }
    },[projectDetails]);

    useEffect(()=>{
        if(rpo!=="" || rto!=="") setDisval("YES");
        else setDisval("NO");
    },[rpo,rto])

    const [
        drhrarequirement,
        setDrhrarequirement
    ] = React.useState("")

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };
    const getProjects = () => {
        try {
            const GetProjects = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}`;
            getDetails(GetProjects, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        setProjectDetails(res.response_data);
                    }
                })
                .catch((err) => {
                    console.log("Err", err.message)
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };

    // const onClickAddCostCenter = (costcentrename, percentage) => {
    //     if (costcentrename.length > 0 || !costcentrename.includes(" ") || percentage.length > 0 || !percentage.includes(" ")) {
    //         getDetails(`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/SAP/${costcentrename}`, "", "", "", "").then((r)=>{
    //             chipData.push({key: chipData.length, costcentrename: costcentrename, percentage: percentage})
    //             setCostcenter("")
    //             setCostcenterpercentage("")
    //         }).catch((err)=>{
    //             setSnackbar(err.response?.data?.response_message || err.message,"error")
    //         })
    //     }
    // }

    const handleSubmit=(e) =>{
        e.preventDefault();
        try {
            const createProject = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}`;
            let temp = 0;
            let payload={...projectDetails};
            payload.tags.business_unit=bussinessunit;
            payload.tags.compliance=complianceValue;
            payload.tags.availability=availability;
            payload.tags.hand_over=handOver==="Yes" ? true : false;
            if(disval==="YES"){
                payload.tags.disaster_recovery={
                    rto: rto,
                    rpo: rpo
                };
            }
            else{
                payload.tags.disaster_recovery={
                    rto: "",
                    rpo: ""
                };
            }
            payload.tags.cost_centre=chipData;
            for (let i = 0; i < chipData.length; i++) {
                temp += Number(chipData[i].percentage)
            }
            if (temp === 100) {
                updateDetails(createProject, "", payload)
                    .then((response) => {
                        setSnackbar(response.response_message,"success");
                    })
                    .catch((err) => {
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    });

            } else{
                setSnackbar("cost centre should be 100","error")
            }
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }
    return (
        <div>
            <div style={{display:"flex",flexDirection:"row"}}>
                    <form onSubmit={handleSubmit} style={{width:"100%"}}>
                        <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                            <Typography variant="h5">
                                Business
                            </Typography>
                            <Button
                                type={"submit"}
                                variant="contained"
                                size={"small"}
                            >
                                Update
                            </Button>
                        </div>
                        <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                            <Box>
                                <div style={{display : 'flex', flexWrap:'wrap', gap:25}}>
                                    <div>
                                        <TextfieldInfo
                                            name={"Business Unit *"}
                                            info={"Please enter the details of the Business Unit in the Organization mentioned above"}
                                        />
                                        <Autocomplete
                                            onChange={(e, v) => {
                                                setBussinessunit(v)
                                            }}
                                            value={bussinessunit}
                                            options={BU_options}
                                            size="small"
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} required/>}
                                        />
                                        <TextfieldInfo
                                            name={"Compliance"}
                                            info={"STD and PDPA /GDPR"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={['STD', 'PDPA/GDPR']}
                                            value={complianceValue}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setComplianceValue(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    placeholder={"Compliance"}
                                                />
                                            )}
                                        />
                                        <TextfieldInfo
                                            name={"Hand Over *"}
                                            info={"Please select if the project is handed-over"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={["Yes","No"]}
                                            value={handOver}
                                            defaultValue={handOver}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setHandOver(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    required
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <TextfieldInfo
                                            name={"Availability *"}
                                            info={"Availabilty of the project"}
                                        />
                                        <TextField
                                            value={availability}
                                            placeholder={"Availability in  %"}
                                            onChange={(event) => setAvailability(event.target.value)}
                                            size="small"
                                            sx={{width: 300}}
                                            required
                                        />
                                        <TextfieldInfo
                                            name={"Disaster Recovery *"}
                                            info={"Please select if recovery required"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={["YES","NO"]}
                                            value={disval}
                                            defaultValue={disval}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setDisval(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    required
                                                />
                                            )}
                                        />
                                        {
                                            disval === "YES" &&
                                            <div>
                                                <TextfieldInfo
                                                    name={"RTO *"}
                                                    info={"Please select the level for Recovery Time Objective (High indicates - Fast recovery is required post any disaster)"}
                                                />
                                                <TextField
                                                    defaultValue={rto}
                                                    placeholder={"Eg: 2hours"}
                                                    onChange={(event) => setRto(event.target.value)}
                                                    size="small"
                                                    sx={{width: 300}}
                                                    required
                                                />
                                                <TextfieldInfo
                                                    name={"RPO *"}
                                                    info={"Please select the level for Recovery Point Objective. High for both RTO & RPO enables DR/HA Requirement"}
                                                />
                                                <TextField
                                                    defaultValue={rpo}
                                                    placeholder={"Eg: 2hours"}
                                                    onChange={(event) => setRpo(event.target.value)}
                                                    size="small"
                                                    sx={{width: 300}}
                                                    required
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </form>
            </div>
        </div>
    )
}
