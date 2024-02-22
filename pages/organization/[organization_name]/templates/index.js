import React, {useState, useCallback, useEffect, useContext} from 'react'
import {useRouter} from "next/router";
import {getDetails} from "../../../../utils/fetch-util";
import {hostport} from "../../../../next.config";
import Typography from "@material-ui/core/Typography";
import TemplateList from "../../../../components/templates/TemplateList";
import {Divider} from "@mui/material";;
import { HiTemplate } from 'react-icons/hi';

export default function templates() {
    const [rows, setRows] = useState([])
    const router = useRouter()
    const {organization_name: organizationName} = router.query

    const columns = [
        {
            field: "template_name",
            headerName: "Templates",
            width: 1200,
            renderCell: (params) => {
                return (
                    <Typography
                        style={{
                            color: "green"
                        }}
                    >
                        {params.value}
                    </Typography>
                )
            },
        }
    ];

    const getTemplates = useCallback(() => {
        if (organizationName !== undefined) {
            let url = `${hostport}/api/v1/organizations/${organizationName}/templates/`
            getDetails(url, "", "", "", "")
                .then((res) => {
                    let data = []
                    res.response_data.map((e, i) => {
                        data.push({
                            id: i,
                            template_name: e
                        })
                    })
                    setRows(data)
                })
                .catch((err) => console.log(err))
        }
    })

    useEffect(() => {
        getTemplates()
    }, [router, organizationName])

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                    <HiTemplate style={{width:"25",height:"25",color:"navy"}}/>
                    <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                        Templates
                    </Typography>
                </div>
            </div>
            <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",padding:"1rem 1rem 0 1rem",borderRadius:"0.5rem"}}>
                {
                    rows.map((e) => {
                        return (
                            <TemplateList name={e.template_name}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
