import {createDetails, getDetails} from "../utils/fetch-util";
import { hostport } from "../next.config";
import { useRouter } from "next/router";
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {AuthContext} from "./authContext";

const check = (role, action, objectID) => {
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const projectName = router.query.project_name;
    const [
        checkData,
        setCheckData
    ] = useState(false);
    const [
        asPath,
        setAsPath
    ] = useState("")

    const {userData} = useContext(AuthContext);

   let level = "project"
   let headerObject = `organizations/${organizationName}/projects/${projectName}`

    if( typeof projectName === "undefined")
    {
        level = "organization"
        headerObject = `organizations/${organizationName}`
    }


    if (objectID) {
        if (objectID.includes("/projects/")) {
            level = "project";
        } else {
            level = "organization";
        }
        headerObject = objectID;
    }

    if (router.asPath !== asPath && organizationName) {

        try {
            const checkapi = `${hostport}/api/v1/iam/roles/check`;

            const checkApiValue = {
                level:level,
                object:headerObject,
                identity:"identity::"+role,
                action:action
            }
            createDetails(checkapi,"",level,headerObject,checkApiValue)
                .then((res) => setCheckData(true))
                .catch((err) => setCheckData(false))
        } catch (err) {}
        setAsPath(router.asPath)
    }
    return checkData;
};

const Can = (props) => check(props.role, props.perform, props.object)
    ? props.yes()
    : props.no();

Can.defaultProps = {
    no: () => null,
    yes: () => null
};

export default Can;

Can.propTypes = {
    no: PropTypes.func,
    perform: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    yes: PropTypes.func,
    object: PropTypes.string
};
