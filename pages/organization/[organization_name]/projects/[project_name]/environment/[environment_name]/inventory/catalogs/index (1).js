import {Button, Divider, Grid, TextField, Typography} from "@material-ui/core";
import {ErrorContext} from "../../../../../../../../../../lib/errorContext"
import {createDetails, getDetails, } from "../../../../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../../../../next.config";
import  {useRouter} from "next/router";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../../../../../../../../../lib/authContext";
import Autocomplete from "@mui/material/Autocomplete";
import {ListItem} from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import ProjectLayout from "../../../../../../../../../../components/project/ProjectLayout";
import {SnackbarContext} from "../../../../../../../../../../lib/toaster/SnackbarContext";
import TextfieldInfo from "../../../../../../../../../../components/TextfieldInfo";


export default function Catalogs() {
    const router = useRouter();
    const { setSnackbar } = useContext(SnackbarContext);
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName] = useState("");
    const [environmentName,setEnvironmentName] = useState("");

    useEffect(()=>{
        if(router.isReady){
            console.log("t",router.query.organization_name)
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name);
            setEnvironmentName(router.query.environment_name);
        }
    },[router])
    const [
        catalogName,
        setCatalogName
    ] = React.useState("");
    const [
        owner,
        setOwner
    ] = React.useState("")
    const [
        users,
        setUsers
    ] = useState(["Others"]);
    const [endPoint, setEndPoint] = useState("");
    const [costCenter, setCostCenter] = useState("");
    const [technologicalDetail, setTechnologicalDetail] = useState("");
    const [technologicalDetails, setTechnologicalDetails] = useState([]);
    const {errorTrigger} = useContext(ErrorContext);
    const {userData} = useContext(AuthContext);

    const handleClose = () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/catalogs`)
    };


    const addFunction=(()=>{
        if(!technologicalDetails.includes(technologicalDetail) && technologicalDetail!==""){
            let temp=[...technologicalDetails];
            temp.push(technologicalDetail);
            setTechnologicalDetails(temp);
            setTechnologicalDetail("");
        }
    })

    const handleTechDelete=(chipToDelete) => () => {
        setTechnologicalDetails((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const handleCloseCreate = ()=>{
        try {
            const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/catalogs`;
            const payload={
                id:`organizations/${organizationName}/applicationCatalog/${catalogName}`,
                project_id:`organizations/${organizationName}/projects/${projectName}`,
                name: catalogName,
                organization_id: `organizations/${organizationName}`,
                endpoint: endPoint,
                owner_details: owner,
                cost_centre: costCenter,
                technology_details: technologicalDetails
            }
            console.log("ds",payload)
            getDetails(`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/SAP/${costCenter}`, "", "", "", "").then((r)=>{
                createDetails(url, "", "", "", payload)
                    .then((res)=>{
                        setSnackbar("application catalog created successfully","success");
                        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/inventory/catalogs`);
                    })
                    .catch((err) => {
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                    });
            }).catch((err)=>{
                setSnackbar(err.response?.data?.response_message || err.message,"error")
            })
        }
        catch(err){
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }


    let headerObject = ""
    let getIdentityObjId = ""
    let GetRoleUsersValue = ""

    useEffect(() => {
        if(organizationName) {
            GetRoleUsersValue = {
                role: {
                    id: "role::organization_owner"
                },
                object: `organizations/${organizationName}`,
                level: "organization"
            }
            headerObject = `organizations/${organizationName}`
            getIdentityObjId = `organizations/${organizationName}`
            GetRoleUsersValue.object = `organizations/${organizationName}`
            getRoleUsers()
        }
    },[organizationName])


    const getRoleUsers = () => {
        try {
            const GetRoleUsers = `${hostport }/api/v1/iam/roles/users`;
            getDetails(GetRoleUsers, "","organization",headerObject,GetRoleUsersValue)
                .then((res) => {
                    let temp=[...users];
                    res.response_data[0]["Identities"].map((item)=>{
                        temp.push(item.name);
                    })
                    setUsers(temp);
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    return (
        <div>
            <div>
                <div>
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                        <Typography variant="h5">
                            Create Catalog
                        </Typography>
                        <div>
                            <Button
                                onClick={handleClose}
                                variant={"outlined"}
                                size={"small"}
                                style={{marginRight:"0.5rem"}}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCloseCreate}
                                variant="contained"
                                size={"small"}
                                disabled={catalogName === "" || technologicalDetails.length === 0 || costCenter === "" || endPoint === ""}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                    <div style={{display:"flex",flexDirection:"row",gap:"2rem",flexWrap:"wrap"}}>
                        <div>
                            <TextfieldInfo
                                name={"Application Catalog Name *"}
                                info={"Enter a meaningful name to identify this Catalog"}
                            />
                            <div>
                                <TextField
                                    onChange={(e) => {
                                        setCatalogName(e.target.value);
                                    }}
                                    size="small"
                                    type="text"
                                    sx={{width: 300}}
                                />
                            </div>
                        </div>
                        <div>
                            <TextfieldInfo
                                name={"EndPoints *"}
                                info={"Enter endpoints of the application"}
                            />
                            <div>
                                <TextField
                                    sx={{width: 300}}
                                    size="small"
                                    onChange={(e) => {
                                        setEndPoint(e.target.value);
                                    }}
                                    type="text"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{display:"flex",flexDirection:"row",gap:"2rem"}}>
                            <div>
                                <TextfieldInfo
                                    name={"Owner Details *"}
                                    info={"Choose a owner name"}
                                />
                                <Autocomplete
                                    sx={{width: 300}}
                                    options={users}
                                    autoHighlight
                                    onChange={(e, newValue) => {
                                        setOwner(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: "new-env",
                                            }}
                                            size="small"
                                            // placeholder={"Owner-Name"}
                                            required
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <TextfieldInfo
                                    name={"Cost Centre *"}
                                    info={"Enter Cost centre value"}
                                />
                                <div>
                                    <TextField
                                        sx={{width: 300}}
                                        size="small"
                                        onChange={(e) => {
                                            setCostCenter(e.target.value);
                                        }}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <TextfieldInfo
                                name={"Technological Details *"}
                                info={"Add Technological details and press enter"}
                            />
                            <div>
                                <TextField
                                    sx={{width: 300}}
                                    size="small"
                                    onChange={(e) => {
                                        setTechnologicalDetail(e.target.value);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            addFunction();
                                        }
                                    }}
                                    type="text"
                                    required
                                    value={technologicalDetail}
                                />
                            </div>
                            {technologicalDetails.length!=0?(
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        flexDirection:'row',
                                        listStyle: 'none',
                                        p: 0.5,
                                        m: 0
                                    }}
                                    component="ul"
                                >
                                    {technologicalDetails.map((data) => {
                                        return (
                                            <ListItem key={data}>
                                                <Chip
                                                    label={data}
                                                    onDelete={handleTechDelete(data)}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </Paper>): null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


