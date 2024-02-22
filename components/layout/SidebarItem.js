import { Collapse, ListItemButton, ListItemText, alpha } from "@material-ui/core";
import { Icon } from "@iconify/react";
import { styled, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Link from "next/link";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import Typography from "@material-ui/core/Typography";
import {Popover} from "@mui/material";
import makeStyles from "@material-ui/styles/makeStyles";

const activeSubStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium"
};

const useStyles = makeStyles((theme) => ({
    selected : {
        // backgroundColor:"#eff8f2",
        // color:"#d0f540",
        // margin:"0.5rem",
        // borderRadius:"0.5rem"
        backgroundColor:"#ebecf0",
        margin:"0 0.5rem",
        borderRadius:"0.5rem"
    },
    projectSelected : {
        backgroundColor:"#ebecf0",
        margin:"0 0.5rem",
        borderRadius:"0.5rem"
    }
}))

const activeIconStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium"
};


const ListItemCustom = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop
})(({ theme }) => ({
    ...theme.typography.body2,
    "&:before": {
        backgroundColor: theme.palette.primary.main,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        bottom: 0,
        content: "''",
        display: "none",
        position: "absolute",
        right: 0,
        top: 0,
        width: 3
    },
    // "color": "#40536e",
    "height": 48,
    "color": "#40536e",
    "paddingLeft": theme.spacing(2),
    "paddingRight": theme.spacing(2),
    "position": "relative",
    "textTransform": "capitalize",
    "fontFamily":`"Public Sans", sans-serif`
}));

const ListItemIconCustom = styled(ListItemIcon)({
    alignItems: "center",
    display: "flex",
    height: 22,
    justifyContent: "center",
    width: 22,
    color:"#42526f"
});

export default function SidebarItem({ page, item, active ,permanentOpen,childPage}) {
    const classes = useStyles();
    const theme = useTheme();
    const isActiveRoot = active(item.path);
    const { title, path, icon, children } = item;
    const [
        open,
        setOpen
    ] = useState(isActiveRoot);

    const activeRootStyle = {
        "&:before": { display: "block" },
        "bgcolor": alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        "color": "primary.main",
        "fontWeight": "fontWeightMedium"
    };

    let color1 = "#40536e"
    let color2 = "#42526f"

    if(permanentOpen===undefined){
        color1="#637381";
        color2="#637381";
    }

    const handleOpen = useCallback(() => setOpen(!open), [open]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open1 = Boolean(anchorEl);

    if (children) {
        return (
            <div>
                <div className={title.toLowerCase() === page && permanentOpen!==false ? (permanentOpen === undefined  ? classes.selected : classes.projectSelected) : null} >
                    <ListItemCustom
                        key={title}
                        onClick={handleOpen}
                        sx={{
                            ...isActiveRoot && activeRootStyle,
                            "&:hover": {
                                backgroundColor: "#ebecf0",
                                borderRadius:"0.5rem",
                                margin:"0 0.5rem",
                            },

                            color: title?.toLowerCase() === page?.toLowerCase() ? (permanentOpen === undefined ? "#0052cb" : "#0052cb") : color1
                            // color:color1
                        }}
                    >
                        <ListItemIconCustom
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                            sx={{
                                color: title?.toLowerCase() === page?.toLowerCase() ? (permanentOpen === undefined ? "#0052cb" : "#0052cb") : color2,
                            }}
                        >
                            {icon && icon}
                            {permanentOpen!==undefined &&!permanentOpen && <Popover
                                id="mouse-over-popover"
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={open1}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                            >
                                <Typography sx={{ m: 1.5 }}>{title}</Typography>
                            </Popover>}
                        </ListItemIconCustom>
                        <ListItemText disableTypography primary={title}/>
                        <Box
                            component={Icon}
                            icon={open
                                ? arrowIosDownwardFill
                                : arrowIosForwardFill}
                            sx={{ height: 16,
                                ml: 1,
                                mr: 1,
                                width: 16 }}
                        />
                    </ListItemCustom>
                </div>
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                >
                    <List
                        component="div"
                        disablePadding
                        key={title}
                    >
                        {
                            children.map((child) => {
                                const { title, path } = child;
                                const isActiveSub = active(path);

                                return (
                                    <Link href={path} key={title}>
                                        <ListItemCustom
                                            sx={{
                                                ...isActiveSub && activeSubStyle,
                                                color: title?.toLowerCase() === childPage?.toLowerCase() ? "black" : color1,
                                                fontWeight: title?.toLowerCase() === childPage?.toLowerCase() ? 600 : 400,
                                                listStyle:{
                                                    color:"yellow"
                                                }
                                            }}
                                        >
                                            <ListItemIconCustom>
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        alignItems: "center",
                                                        bgcolor: "text.disabled",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        height: 4,
                                                        justifyContent: "center",
                                                        transition: (themes) => themes.transitions.create("transform"),
                                                        ...isActiveSub && {
                                                            bgcolor: "primary.main",
                                                            transform: "scale(2)"
                                                        },
                                                        width: 4,
                                                        // "&. MuiListItemIcon-root":{
                                                        //     color:"pink",
                                                        //     height:"10px"
                                                        // }
                                                    }}
                                                />
                                            </ListItemIconCustom>
                                            <ListItemText disableTypography primary={title} />
                                        </ListItemCustom>
                                    </Link>
                                );
                            })
                        }
                    </List>
                </Collapse>
            </div>
        );
    }

    return (
        <div className={title?.toLowerCase() === page?.toLowerCase() && permanentOpen!==false ? (permanentOpen === undefined ? classes.selected : classes.projectSelected) : null}>
            <Link href={path}>
                <ListItemCustom
                    sx={{
                            ...isActiveRoot && activeRootStyle
                        }}
                >
                    <ListItemIconCustom
                        sx={{
                                ...isActiveRoot && activeIconStyle,
                            color: title?.toLowerCase() === page?.toLowerCase() ? (permanentOpen === undefined ? "#0052cb" : "#0052cb") : color2
                            }}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    >
                        {icon && icon}
                        { permanentOpen!==undefined && !permanentOpen && <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={open1}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>{title}</Typography>
                        </Popover>}
                    </ListItemIconCustom>
                    <ListItemText disableTypography primary={title} sx={{color: title?.toLowerCase() === page?.toLowerCase() ? (permanentOpen === undefined ? "#0052cb" : "#0052cb") : color2}}/>
                </ListItemCustom>
            </Link>
        </div>
    );
}

SidebarItem.propTypes = {
    active: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};
