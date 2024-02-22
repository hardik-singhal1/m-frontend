import React, {useContext, useEffect, useRef, useState} from 'react';
import cytoscape from 'cytoscape';
import nodeHtmlLabel from "cytoscape-node-html-label";
import klay from "cytoscape-klay";
import {useRouter} from "next/router";
import {hostport} from "../../../../../../../../../next.config"
import {ErrorContext} from "../../../../../../../../../lib/errorContext";
import {getDetails} from "../../../../../../../../../utils/fetch-util";
import set from './../../../../../../../../../components/tools/googleIcons';
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {tooltipstyles} from "./../../../../../../../../../styles/Home.module.css"
import popper from "cytoscape-popper";
import SchemaIcon from '@mui/icons-material/Schema';


const Graph = () => {
    const {errorTrigger} = useContext(ErrorContext);
    const router = useRouter();
    const {organization_name, project_name, environment_name} = router.query;
    const [resource, setResource] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [nodeWidth,setNodeWidth] = useState(100);

    cytoscape.use(klay);

    const getResources = () => {
        try {
            const url = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/resources/`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if(res) {
                        let filteredData = res.response_data.filter(item => item.environment === environment_name)
                        filteredData.forEach((e) => e.id = e.resource_id)
                        setResource(filteredData);
                        getNodes(filteredData);
                        getEdges(filteredData);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    const resetGraph=()=>{
        drawGraph();
    }

    const getNodes = (res) => {
        let nodesData = [];
        let maxWidth=0;
        res.map((item) => {
            let type=item.type;
            type= type.substring(type.indexOf('_')+1);
            if (item.provider.includes("azure")) {
                item.icon = "/azure.svg";
            }
            else if (item.provider.includes("google")) {
                if (set.has(type)) {
                    item.icon = `/google-cloud-icons/${type}/${type}.svg`;
                } else {
                    item.icon = "/google-cloud-icons/google-cloud.svg";
                }
            }
            else{
                item.icon = "/aws-icon.svg";
            }
            nodesData.push({data: item});
            if(item.type.length>maxWidth) maxWidth=item.type.length;
        })
        setNodeWidth(maxWidth*7);
        setNodes(nodesData)
    }

    const getEdges = (res) => {
        let edgesData = [];
        let mapRes=res;
        res.map((item) => {
            if (item.dependencies) {
                for (let i = 0; i < item.dependencies.length; i++) {
                    mapRes.forEach((obj)=>{
                        if(obj.resource_id===item.dependencies[i]){
                            edgesData.push({data: {source: item.resource_id, target: item.dependencies[i]}})
                            return;
                        }
                    })
                }
            }
        })
        setEdges(edgesData);
    }

    const graphRef = useRef(null)
    const drawGraph = () => {
        if (typeof cytoscape("core", "nodeHtmlLabel") !== "function") {
            cytoscape.use(nodeHtmlLabel);
        }
        if (typeof cytoscape("core", "popper") !== "function") {
            cytoscape.use(popper);
        }
        let tips = document.createElement("div");
        const cy = cytoscape({
            container: graphRef.current,
            elements: [...nodes, ...edges],
            style: [
                {
                    selector: "edge",
                    css: {
                        "curve-style": "taxi",
                        "line-color": 'grey',
                        width: 5,
                    },
                },
                {
                    selector: "node",
                    style: {
                        label: "data(id)",
                        content: function (data) {
                            let str=data._private.data.id;
                            if(str.length>20){
                                return `${str.substring(0,20)}...`;
                            }
                            return str;
                        },
                        padding: "100px",
                        "font-weight": "bold",
                        "text-margin-y": 60,
                        shape: "roundrectangle",
                        color: "#8450ba",
                        width: nodeWidth,
                        "border-width": 5,
                        "border-color": "#8450ba",
                        "background-color": "white",
                    },
                },
                {
                    selector: "edge.hover",
                    style: {
                        "line-color": "orange"
                    }
                },
                {
                    selector: "node.hover",
                    style: {
                        "border-color": "orange",
                    }
                },
                {
                    selector: "node.click",
                    style: {
                        "border-color": "red",
                    }
                }
            ]
        })
        cy.nodeHtmlLabel([
            {
                query: "node",
                tpl: function (data) {
                    return`<div align="center">
                                <img src="${data.icon}" alt="google" width="200" height="50"><br />
                                <div>${data.type}</div>  
                           </div>`;
                }
            }
        ])
        cy.on("mouseover", "edge", function (e) {
            let edge = e.target;
            let src = edge.source();
            let tgt = edge.target();
            edge.addClass("hover");
            if (src.isNode()) {
                src.addClass("hover");
            }
            if (tgt.isNode()) {
                tgt.addClass("hover");
            }
        });
        cy.on("mouseout", "edge", function (e) {
            let edge = e.target;
            let src = edge.source();
            let tgt = edge.target();
            edge.removeClass("hover");
            if (src.isNode()) {
                src.removeClass("hover");
            }
            if (tgt.isNode()) {
                tgt.removeClass("hover");
            }
        });
        cy.on("mouseover", "node", function (e) {
            let node = e.target;
            let deps = node._private.edges;
            node.addClass("hover")
            if (deps) {
                deps.map((item) => {
                    item.addClass("hover")
                })
            }
            node.popperref = e.target.popper({
                content: () => {
                    tips.innerHTML = e.target.data("id");
                    tips.className = tooltipstyles;
                    document.body.appendChild(tips);
                    return tips;
                },
                popper: {
                    placement: "top-start",
                    removeOnDestroy: true
                }
            });
        });
        cy.on("mouseout", "node", function (e) {
            let node = e.target;
            let deps = node._private.edges;
            node.removeClass("hover")
            document.body.removeChild(tips);
            if (deps) {
                deps.map((item) => {
                    item.removeClass("hover")
                })
            }
        });
        cy.layout({
            name: "klay",
            nodeDimensionsIncludeLabels: true,
            animate: true,
            klay: {
                direction: "RIGHT",
                borderSpacing: 100,
                spacing: 30,
            },
        }).run();
    }


    useEffect(() => {
        if (organization_name !== undefined && project_name !== undefined) {
            getResources();
        }
    }, [router])

    useEffect(() => {
        if (nodes.length !== 0) {
            drawGraph();
        }
    }, [nodes,edges])

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <SchemaIcon style={{color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Inventory Graph
                    </Typography>
                </div>
                <Button
                    onClick={resetGraph}
                    size={"small"}
                    variant={"contained"}
                >Reset Graph</Button>
            </div>
            <div
                ref={graphRef}
                style={{width: '100%', height: '65vh', border: "6px solid navy", borderRadius: "10px",padding:"2rem"}}>
            </div>
        </div>
    )
}

export default Graph
