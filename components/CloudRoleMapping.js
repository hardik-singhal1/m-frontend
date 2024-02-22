import {Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogContent, TextField} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {hostport} from "../next.config";
import {createDetails, deleteDetails, getDetails} from "../utils/fetch-util";
import {useRouter} from "next/router";
import DialogContentText from "@mui/material/DialogContentText";
import {SnackbarContext} from "../lib/toaster/SnackbarContext";

export default function CloudRoleMapping(props) {
    const { setSnackbar } = useContext(SnackbarContext);
    const { type, sailorRole } = props;
    const [cloudRoles, setCloudRoles] = useState([]);
    const [openAddRoleTextField, setOpenAddRoleTextField] = useState(false);
    const [newRole, setNewRole] = useState("");
    let router = useRouter();
    let {organization_name, project_name} = router.query;

    useEffect(() => {
        if (type && sailorRole) {
            let cloudRolesUrl = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/cloud/gcp/iam/role_mappings/types/${type}/sailor_role/${sailorRole}`;

            getDetails(cloudRolesUrl)
                .then(res => setCloudRoles(res?.response_data?.cloud_roles));
        }
    }, [type, sailorRole]);

    return (
        <>
            <Accordion elevation={0} sx={{borderBottom:"none", boxShadow:"rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px", transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',gap:'10px'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant={"h6"}>{type}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        cloudRoles?.map(c => (
                            <Chip label={c} style={{margin: 10}} onDelete={() => {
                                let cloudRolesUrl = `${hostport}/api/v1/organizations/${organization_name}/iam/role_mappings/types/${type}/sailor_role/${sailorRole}`;

                                deleteDetails(cloudRolesUrl, "", "", "", c)
                                    .then(() => {
                                        setSnackbar("Deleted successfully","success")
                                        let newCloudRoles = cloudRoles.filter(r => r !== c);
                                        setCloudRoles(newCloudRoles);
                                    })
                                    .catch(err => {
                                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                                    });
                            }} deleteIcon={<DeleteIcon />}/>
                        ))
                    }
                    {
                        !openAddRoleTextField && <Chip icon={<AddIcon/>} onClick={() => {
                            setOpenAddRoleTextField(true)
                            }} label={"Add"} color={"success"} style={{margin: 10}} variant={"outlined"}/>
                    }
                    {
                        openAddRoleTextField &&
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="add"
                                placeholder="roles/browser"
                                variant="standard"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            />
                            <Button size="small" color="success" onClick={() =>{
                               let cloudRolesUrl = `${hostport}/api/v1/organizations/${organization_name}/iam/role_mappings/types/${type}/sailor_role/${sailorRole}`;
                                if(cloudRoles?.includes(newRole)) {
                                    setSnackbar("role already exists","error")
                                }
                                else {
                                    createDetails(cloudRolesUrl, "", "", "", newRole)
                                        .then(res => {
                                            setSnackbar("Mapped successfully","success")
                                            if (Array.isArray(cloudRoles)) {
                                                setCloudRoles([...cloudRoles, newRole]);
                                            } else {
                                                setCloudRoles([newRole]);
                                            }
                                            setOpenAddRoleTextField(false);
                                            setNewRole("");
                                        }).catch(err => {
                                             setSnackbar(err.response?.data?.response_message || err.message,"error")
                                        });
                                }
                            }}>Add</Button>
                            <Button size="small" color="error" onClick={() => {
                                setOpenAddRoleTextField(false);
                                setNewRole("");
                            }}>Cancel</Button>
                        </>
                    }
                </AccordionDetails>
            </Accordion>
        </>

    )
}
