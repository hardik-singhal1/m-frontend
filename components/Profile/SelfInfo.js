import Avatar from "@mui/material/Avatar";
import {deepOrange} from "@mui/material/colors";
import {Typography} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../lib/authContext";
import React from "react";

function SelfInfo() {
    const {userData} = useContext(AuthContext);
    let name = userData?.identity?.traits?.first_name;
    if(userData?.identity?.traits?.last_name?.length>0) name=name+" "+userData?.identity?.traits?.last_name;
    return (
        <div style={{ height: "100%",width:"100%" }}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",flexDirection:"column"}}>
                <Avatar
                    alt={name}
                    sx={{ bgcolor:deepOrange[500],width: 150, height: 150,marginBottom:"1rem" }}
                >
                    <Typography variant={"h3"}>{name?.split(" ")?.map((name)=>name[0])}</Typography>
                </Avatar>
                <div style={{display:"flex",alignItems:"center",flexDirection:"column",gap:"1rem"}}>
                    <Typography fontWeight={"bold"}>{name}</Typography>
                    <Typography fontWeight={"bold"}>{userData?.identity?.traits?.email}</Typography>
                    <Typography fontWeight={"bold"}>{userData?.identity?.state}</Typography>
                </div>
            </div>
        </div>
    );
}

export default React.memo(SelfInfo);
