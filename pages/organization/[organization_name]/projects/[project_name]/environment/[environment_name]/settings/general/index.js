import ProjectLayout from "../../../../../../../../../components/project/ProjectLayout";
import {Button, TextField, Typography} from "@material-ui/core";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Divider} from "@mui/material";
import TextfieldInfo from "../../../../../../../../../components/TextfieldInfo";
import {Box} from "@mui/system";
import {useRouter} from "next/router";
import {hostport} from "../../../../../../../../../next.config";
import {createDetails, getDetails, updateDetails} from "../../../../../../../../../utils/fetch-util";
import Autocomplete from "@mui/material/Autocomplete";
import { BiDownload } from 'react-icons/bi';
import Grid from "@mui/material/Grid";
// import { saveAs } from "file-saver";
import ClearIcon from "@mui/icons-material/Clear";
import {SnackbarContext} from "../../../../../../../../../lib/toaster/SnackbarContext";

export default function Settings(){
    const { setSnackbar } = useContext(SnackbarContext);
    // const fileSaver = require("file-saver");
    const uploadInputRef = useRef(null);
    const [organizationName,setOrganizationName] = useState("");
    const [projectName,setProjectName] = useState("");
    const router = useRouter();
    const [projectDetails,setProjectDetails]=useState(null);
    const [projectOwner,setProjectOwner]=useState("");
    const [userlist,setUserlist]=useState([]);
    const [id,setId] = useState("");
    const [checkId,setCheckId] = useState("");
    const [
        users,
        setUsers
    ] = useState([]);
    const [details,setDetails]=useState("");
    const [selectedFile,setSelectedFile]=useState(null);
    useEffect(()=>{
        if(userlist.length>0 && projectOwner){
            userlist.forEach((i)=>{
                if(i.name===projectOwner){
                    setId(i.id);
                    return;
                }
            })
        }
    },[userlist,projectOwner]);
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
            setProjectName(router.query.project_name)
        }
    },[router]);
    useEffect(()=>{
        if(organizationName && projectName){
            getProjects();
            getIdentity();
        }
    },[organizationName,projectName]);
    useEffect(()=>{
        if(projectDetails!==null){
            setCheckId(projectDetails.tags.project_owner);
            setProjectOwner(projectDetails.tags.project_owner);
            setDetails(projectDetails.tags.details_and_attachments);
            setSelectedFile(projectDetails.file);
        }
    },[projectDetails])
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
    const getIdentity = () => {
        try {
            const GetUsers = `${hostport}/api/v1/iam/identities`;

            getDetails(GetUsers, "", "organization", `organizations/${organizationName}`)
                .then((res) => {
                    for (let iter = 0; iter < res.response_data.length; iter++) {
                        setUserlist(res.response_data)
                        if (!users.includes(res.response_data[iter].name)) {
                            users.push(res.response_data[iter].name);
                        }
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    };
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const assignProjectOwner = () => {
        try {
            const assignRole = `${hostport}/api/v1/iam/roles/assign`;
            let objID=`organizations/${organizationName}/projects/${projectName}`;
            let assignRoleValue={
                level: "project",
                object: objID,
                role: "role::project_owner",
                subject: ["identity::" + id]
            }
            createDetails(assignRole, "", "project", objID, assignRoleValue)
                .then((res)=>{
                    setSnackbar("Project Owner Role assigned successfully","success");
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
        } catch (err) {
            setSnackbar(err.response?.data?.response_message || err.message,"error")
        }
    }
    const handleSubmit=(e) =>{
        e.preventDefault();
        const formData = new FormData();
        if(selectedFile){
            formData.append(
                "myFile",
                selectedFile,
                selectedFile.name
            );
        }
        try {
            const createProject = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}`;
            let payload={...projectDetails};
            payload.tags.project_owner=projectOwner;
            payload.tags.details_and_attachments=details;
            // payload.file=formData;
            updateDetails(createProject, "", payload)
                .then((response) => {
                    setSnackbar(response.response_message,"success");
                    if(projectOwner!==checkId) assignProjectOwner();
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                });
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
                                General
                            </Typography>
                            <Button
                                type={"submit"}
                                variant="contained"
                                size={"small"}
                            >
                                Update
                            </Button>
                        </div>
                        <div style={{height:"65vh",width:"100%",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                            <Box>
                                <div style={{display : 'flex', flexWrap:'wrap', gap:25}}>
                                    <div>
                                        <TextfieldInfo
                                            name={"Project Owner Name *"}
                                            info={"Please input the Project Owner's name who owns the Project"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            value={projectOwner}
                                            options={users}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setProjectOwner(newValue);
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
                                            name={"Organization *"}
                                            info={"Please enter the Organization name under which this project would fall into"}
                                        />
                                        <TextField
                                            value={organizationName}
                                            aria-readonly={true}
                                            size="small"
                                            sx={{width: 300}}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <TextfieldInfo
                                            name={"Details *"}
                                            info={"Please provide a summary for your project in 2000 words. This summary will help in quick approvals"}
                                        />
                                        <TextField
                                            value={details}
                                            multiline
                                            rows={8}
                                            onChange={(event) => setDetails(event.target.value)}
                                            size="small"
                                            sx={{width: 300}}
                                            required
                                        />
                                    </div>
                                    {/*<div style={{display:"flex",flexDirection:"column"}}>*/}
                                    {/*    <TextfieldInfo*/}
                                    {/*        name={"File *"}*/}
                                    {/*        info={"Please upload a fie to update"}*/}
                                    {/*    />*/}
                                    {/*    <input*/}
                                    {/*        ref={uploadInputRef}*/}
                                    {/*        type="file"*/}
                                    {/*        style={{ display: "none" }}*/}
                                    {/*        onChange={onFileChange}*/}
                                    {/*        required*/}
                                    {/*    />*/}
                                    {/*    <div style={{display:"flex",alignItems:"center"}}>*/}
                                    {/*        <Button*/}
                                    {/*            onClick={() => uploadInputRef.current && uploadInputRef.current.click()}*/}
                                    {/*            variant="contained"*/}
                                    {/*            style={{marginRight:"0.5rem"}}*/}
                                    {/*        >*/}
                                    {/*            Upload*/}
                                    {/*        </Button>*/}
                                    {/*        {*/}
                                    {/*            selectedFile ? <div style={{display:"flex",alignItems:"center"}}>{selectedFile.name} <ClearIcon sx={{"&:hover": { color: "red"}  ,"height":"1rem"}} onClick={()=>setSelectedFile(null)}/></div> : <div>No file chosen</div>*/}
                                    {/*        }*/}
                                    {/*    </div>*/}
                                    {/*    <Button startIcon={BiDownload()} style={{marginTop:"1rem",width:"15rem"}} variant={"outlined"} disabled={Boolean(!selectedFile)} onClick={()=>{*/}
                                    {/*        if(selectedFile) fileSaver.saveAs(selectedFile)*/}
                                    {/*    }*/}
                                    {/*    }>Download</Button>*/}
                                    {/*</div>*/}
                                </div>
                            </Box>
                        </div>
                        {/*<Divider/>*/}
                    </form>
            </div>
        </div>
    )
}
