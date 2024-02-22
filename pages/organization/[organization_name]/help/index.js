import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {Divider, Typography} from "@mui/material";
import {Button, TextField} from "@material-ui/core";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import TextfieldInfo from "../../../../components/TextfieldInfo";
import Autocomplete from "@mui/material/Autocomplete";
import {hostport} from "../../../../next.config";
import {getDetails} from "../../../../utils/fetch-util";
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";
import {AuthContext} from "../../../../lib/authContext";
import {SnackbarContext} from "../../../../lib/toaster/SnackbarContext";
import axios from "axios";

export default function Help(){
    const router = useRouter();
    const {userData} = useContext(AuthContext);
    const { setSnackbar } = useContext(SnackbarContext);
    const [organizationName,setOrganizationName] = useState("");
    const [issueDesc,setIssueDesc] = useState("");
    const [level,setLevel] = useState("Organization");
    const [projects,setProjects] = useState([]);
    const [selectedProject,setSelectedProject] = useState("");
    const uploadInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [desc,setDesc] = useState("");
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name)
        }
    },[router])

    useEffect(()=>{
        if(organizationName){
            getProjects();
            getIssueList();
        }
    },[organizationName])
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const [issuesList,setIssuesList] = useState([]);

    const getProjects = () => {
        let GetProjects = `${hostport}/api/v1/organizations/${router.query.organization_name}/projects/`;
        getDetails(GetProjects, "", "", "", "")
            .then((res) => {
                let temp=[];
                if (res.response_data) {
                    res.response_data.forEach((project, index, projects) => {
                        temp.push(project.name);
                    })
                }
                setProjects(temp);
            })
            .catch((err) => {
                console.log("Err", err.message)
            });
    };

    const getIssueList = () =>{
        let url=`${hostport}/api/v1/organizations/${organizationName}/issueList`;
        getDetails(url,"","","","","")
            .then((res)=>{
                setIssuesList(res.response_data);
            }).catch((err)=>{
                console.log(err);
        })
    }

    const createIncident = (e) =>                                                                                                                               {
        e.preventDefault();
        let temp="This ticket is created from MpaaS";
        if(level!=="Organization"){
            temp+=` in project ${selectedProject}`
        }
        let text=`<div><h4><b>${temp}</b></h4> <div>${issueDesc.replace("\n", "<br />")}</div></div>`
        let payload={
            email:userData?.identity?.traits?.principal_name,
            issue_description:desc,
            description:text
        }
        const formData = new FormData();
        formData.append('file_input',selectedFile);
        formData.append("params", JSON.stringify(payload));
        const config = {
            "content-type": "multipart/form-data",
            "Authorization": "Bearer",
            "Accept":"*/*",
            "Level": "",
            "Objid": "",
            "Accept-Encoding":"gzip, deflate, br",
            withCredentials:true

        }
        let uid=Math.floor((Math.random() * 10000) + 1);
        setSnackbar("Raising Incident ...","loading",uid);
        axios.post(`${hostport}/api/v1/organizations/${organizationName}/ticket`, formData, config)
            .then((response) => {
                setSnackbar("Incident Raised Successfully","success",uid);
            })
            .catch((err)=>{
                setSnackbar(err.response?.data?.response_message || err.message,"error",uid)
            })
    }

    return(
        <div>
            <form onSubmit={createIncident}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:"1rem"}}>
                    <div style={{display:"flex",alignItems:"center"}}>
                        <HelpCenterIcon style={{color:"red"}}/>
                        <Typography variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,paddingLeft:"0.5rem"}}>Report Incident</Typography>
                    </div>
                    <div>
                        <Button
                            align="center"
                            size={"small"}
                            variant={"contained"}
                            onClick={()=>router.push(`/organization/${organizationName}/help/tickets`)}
                            disableElevation={true}
                        >Tickets</Button>
                    </div>
                </div>
                <div style={{backgroundColor:"#fcfbfb",padding:"1rem",borderRadius:"16px",height:"75vh",display:"flex",flexDirection:"column",justifyContent:"space-between",flexWrap:"wrap"}}>
                    <div style={{display:"flex",paddingBottom:"2rem",flexWrap:"wrap",width:"100%",justifyContent:"space-between"}}>
                        <div style={{width:"29%"}}>
                            <TextfieldInfo
                                name={"Level *"}
                                info={""}
                            />
                            <Autocomplete
                                sx={{width: 300}}
                                options={["Organization","Project"]}
                                value={level}
                                autoHighlight
                                onChange={(e, newValue) => {
                                    setLevel(newValue);
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
                                level==="Project" && <div>
                                    <TextfieldInfo
                                        name={"Project *"}
                                        info={""}
                                    />
                                    <Autocomplete
                                        sx={{width: 300}}
                                        options={projects}
                                        value={selectedProject}
                                        autoHighlight
                                        onChange={(e, newValue) => {
                                            setSelectedProject(newValue);
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
                            }
                            <TextfieldInfo
                                name={"Type *"}
                                info={""}
                            />
                            <Autocomplete
                                sx={{width: 300}}
                                options={issuesList}
                                value={desc}
                                autoHighlight
                                onChange={(e, newValue) => {
                                    setDesc(newValue);
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
                            <TextfieldInfo
                                name={"File *"}
                                info={"Please choose the file"}
                            />
                            <input
                                ref={uploadInputRef}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onFileChange}
                            />

                            <div style={{display:"flex",alignItems:"center"}}>
                                <Button
                                    onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                                    variant="contained"
                                    style={{marginRight:"0.5rem"}}
                                >
                                    Upload
                                </Button>
                                {
                                    selectedFile ? <div style={{display:"flex",alignItems:"center"}}>{selectedFile.name} <ClearIcon sx={{"&:hover": { color: "red"}  ,"height":"1rem"}} onClick={()=>setSelectedFile(null)}/></div> : <div>No file chosen</div>
                                }
                            </div>
                        </div>
                        <div style={{width:"69%"}}>
                            <TextfieldInfo
                                name={"Description *"}
                                info={""}
                            />
                            <TextField
                                multiline
                                rows={10}
                                placeholder={"Issue Description"}
                                value={issueDesc}
                                onChange={(event) => setIssueDesc(event.target.value)}
                                size="small"
                                sx={{width: "100%"}}
                                inputProps={{
                                    maxLength : 2000
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div style={{display:"flex",gap:"1rem",paddingTop:"1rem",justifyContent:"flex-end",paddingBottom:"4rem",flexWrap:"wrap"}}>
                        <Button
                            align="center"
                            size={"small"}
                            variant={"outlined"}
                            onClick={()=>router.push(`/organization/${organizationName}`)}
                        >Cancel</Button>
                        <Button
                            align="center"
                            size={"small"}
                            variant={"contained"}
                            type={"submit"}
                            disableElevation={true}
                        >Create</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
