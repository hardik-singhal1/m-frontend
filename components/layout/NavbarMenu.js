import { Add, Check, Domain } from "@material-ui/icons";
import { Box } from "@mui/system";
import { Button, ListItem, ListItemIcon, ListItemText, Menu, Tooltip } from "@material-ui/core";
import { Icon } from "@iconify/react";
import { IconButton, Typography } from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import { useRouter } from "next/router";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import arrowIosUpwardFill from "@iconify/icons-eva/arrow-ios-upward-fill";
import environment from "@iconify/icons-fluent/tab-desktop-multiple-bottom-24-regular";

export default function NavbarMenu({ menuList, selected, nav, onClick, onClickDelete }) {
    const [
        anchorEl,
        setAnchorEl
    ] = useState(null);
    const router = useRouter();
    const open = Boolean(anchorEl);
    const [
        state,
        setState
    ] = useState(false);
    const handleClickListItem = useCallback((event) => {
        setState(true);
        setAnchorEl(event.currentTarget);
    });
    const projectName = router.query.project_name;
    const organizationName = router.query.organization_name;

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setState(false);
    });

    const [menuContent, setMenuContent] = useState([]);

    useEffect(()=>{
        if (menuList !== null) {
            setMenuContent(menuList)
        }
        setAnchorEl(null)
    },[menuList,router])

    return (
        <>
            <List
                component="nav"
                style={{padding:"0rem",margin:"0rem"}}
            >
                <Box
                    sx={{ pb: 0 }}
                >
                    <ListItem
                        button
                        onClick={handleClickListItem}
                        sx={{ minWidth: 0 }}
                    >
                        <ListItemIcon sx={{
                            minWidth: 0,
                            pr: 2
                        }}
                        >
                            {
                                nav === "Environment"
                                    ? <Icon
                                        height="20"
                                        icon={environment}
                                        color={"#40536e"}
                                    />
                                    : <Domain style={{color:"#40536e"}}/>
                            }
                        </ListItemIcon>
                        <ListItemText
                            primary={selected}
                            sx={{ color: "#40536e",
                                fontWeight:"bold"
                            }}
                        />
                        <ListItemIcon sx={{ pl: 2,pr:0 }}>
                            <Icon
                                height={20}
                                icon={state
                                    ? arrowIosUpwardFill
                                    : arrowIosDownwardFill}
                                sx={{ mr: 0 }}
                                width={20}
                            />
                        </ListItemIcon>
                    </ListItem>
                </Box>
            </List>
            <Menu
                MenuListProps={{ dense: true }}
                PaperProps={{ sx: { width: 320 } }}
                anchorEl={anchorEl}
                onClose={handleClose}
                open={state
                    ? open
                    : ""}
            >
                <MenuItem disabled>
                    {
                        nav === "Environment"
                            ? <ListItemText>Environments</ListItemText>
                            : <ListItemText>Organizations</ListItemText>
                    }
                </MenuItem>
                {
                    nav === "Environment"
                        ? menuContent.map((menu) => {
                            if (menu === selected) {
                                return (
                                    <MenuItem key={menu} selected>
                                        <ListItemIcon>
                                            <Check />
                                        </ListItemIcon>
                                        <Typography>{menu}</Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Tooltip color="error" title="Delete Environment">
                                            <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={onClickDelete}
                                            ><DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </MenuItem>
                                );
                            }

                            return (
                                <MenuItem key={menu}>
                                    <ListItemText
                                        inset
                                        onClick={(event) => {
                                            router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${menu}`);
                                            setState(false);
                                        }}
                                    >{menu}
                                    </ListItemText>
                                </MenuItem>
                            );
                        })
                        : menuContent.map((menu) => {
                            if (menu === selected) {
                                return (
                                    <MenuItem key={menu} selected>
                                        <ListItemIcon>
                                            <Check />
                                        </ListItemIcon>
                                        {menu}
                                    </MenuItem>
                                );
                            }

                            return (
                                <MenuItem key={menu}>
                                    <ListItemText
                                        inset
                                        onClick={(event) => {
                                            router.push(`/organization/${menu}`);
                                            setState(false);
                                        }}
                                    >{menu}
                                    </ListItemText>
                                </MenuItem>
                            );
                        })
                }
                <Divider />
                <div align="center">
                    <Button
                        onClick={onClick}
                        startIcon={<Add />}
                    >
                        Add new {nav}
                    </Button>
                </div>
            </Menu>
        </>
    );
}

// NavbarMenu.propTypes = {
//     menuList: PropTypes.array.isRequired,
//     nav: PropTypes.string.isRequired,
//     onClick: PropTypes.func.isRequired,
//     onClickDelete: PropTypes.func.isRequired,
//     selected: PropTypes.string.isRequired
// };
