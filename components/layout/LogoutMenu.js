import { AuthContext } from "../../lib/authContext";
import { ListItemText } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Link from "next/link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function LogoutMenu() {
    const router = useRouter();
    const { logoutUrl } = useContext(AuthContext);
    const [
        anchorEl,
        setAnchorEl
    ] = useState(null);
    const open = Boolean(anchorEl);

    const handleClickListItem = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    });

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    });

    const [organizationName,setOrganizationName] = useState("");
    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    return (
        <div>
                <IconButton
                    onClick={handleClickListItem}
                    sx={{ mr: 3 }}
                >
                    <AccountCircleIcon style={{width:"28",height:"28",color:"orange"}}/>
                </IconButton>
            <Menu
                MenuListProps={{
                    dense: true
                }}
                PaperProps={{
                    sx: {
                        width: 200
                    }
                }}
                anchorEl={anchorEl}
                onClose={handleClose}
                open={open}
            >
                <MenuItem onClick={()=>{
                    if(organizationName!==undefined){
                        handleClose();
                        router.push(`/organization/${organizationName}/profile`)
                    }
                }}>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={()=>{
                    if(organizationName!==undefined){
                        handleClose();
                        router.push(`/organization/${organizationName}/feedback`)
                    }
                }}>
                    <ListItemText>Feedback</ListItemText>
                </MenuItem>
                <Link href={logoutUrl
                    ? logoutUrl
                    : ""}
                >
                    <MenuItem onClick={handleClose}>Logout
                    </MenuItem>
                </Link>
            </Menu>
        </div>
    );
}
