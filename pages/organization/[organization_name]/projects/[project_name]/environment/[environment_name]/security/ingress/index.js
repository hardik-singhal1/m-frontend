import Typography from "@material-ui/core/Typography";
import DnsIcon from "@mui/icons-material/Dns";
import Button from "@mui/material/Button";
import { SiIngress } from "react-icons/si";

import DynamicBox, {DynamicField} from "../../../../../../../../../components/tools/DynamicBox";
import Grid from "@mui/material/Grid";
import {Box} from "@material-ui/system";
import TextfieldInfo from "../../../../../../../../../components/TextfieldInfo";
import {TextField} from "@material-ui/core";
import React from "react";

export default function (){
    return(
        <div style={{height: "80vh",}}>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <SiIngress style={{color:"navy",width:"1.5rem",height:"1.5rem"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Ingress
                    </Typography>
                </div>
                <Button size={"small"} disabled variant={"contained"}>
                    Create
                </Button>
            </div>
            <div style={{height:'65vh',overflow:"auto",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                <div>
                    <div style={{padding:"0.5rem"}}>
                        <div style={{display:"flex",flexDirection:"row",gap:"1rem"}}>
                            <div>
                                <TextfieldInfo
                                    name={"Name *"}
                                    info={"Please enter the name"}
                                />
                                <TextField
                                    // value={"Organization Name"}
                                    aria-readonly={true}
                                    size="small"
                                    sx={{width: 300}}
                                    required
                                />
                            </div>
                            <div>
                                <TextfieldInfo
                                    name={"IP Address *"}
                                    info={"Please enter the IP Address"}
                                />
                                <TextField
                                    // value={"Organization Name"}
                                    aria-readonly={true}
                                    size="small"
                                    sx={{width: 300}}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <TextfieldInfo
                                name={"Port *"}
                                info={"Please enter the Port"}
                            />
                            <TextField
                                // value={"Organization Name"}
                                aria-readonly={true}
                                size="small"
                                sx={{width: 300}}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
