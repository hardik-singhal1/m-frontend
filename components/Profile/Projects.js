import ListItem from "@mui/material/ListItem";
import React, { useState ,Fragment} from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import {useRouter} from "next/router";
import {CircularProgress} from "@mui/material";
function ProjectsList({ projects , loading }) {
    const router = useRouter();
    const changePage = (event, value) => {
        setPageNumber(value - 1);
    };
    const [pageNumber, setPageNumber] = useState(0);
    const projectsPerPage = 10;
    const pagesVisited = pageNumber * projectsPerPage;
    const pageCount = Math.ceil(projects?.length / projectsPerPage);

    const displayProjects=projects?.slice(pagesVisited,pagesVisited + projectsPerPage).map((project) => {
        return (
            <ListItem key={project?.name} component="div" disablePadding>
                <ListItemButton style={{ textAlign: "center" }}>
                    <ListItemText style={{color:"blue"}} onClick={()=>{
                        router.push(`/organization/${project.org}/projects/${project.name}/environment/${project.env}`)
                    }}>{project?.name}</ListItemText>
                </ListItemButton>
            </ListItem>
        );
    });

    const loadingIcon = () =>{
        return(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div style={{height:"90%",display:"flex",flexDirection:"column"}}>
            {loading===false ? displayProjects : loadingIcon()}
            <Pagination
                count={pageCount}
                onChange={changePage}
                style={{marginBottom:"2rem",display:"flex",justifyContent:"center",alignItems:"flex-end",height:"100%"}}
            />
        </div>
    );
}

export default React.memo(ProjectsList);
