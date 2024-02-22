import { Box } from "@material-ui/core";
import PropTypes from "prop-types";
import {productname} from "../../next.config";

export default function Logo({ sx }) {
    return (<Box
        component="img"
        src= {productname === "mpaas" ?  "/logo.png" : "/_logo.png"}
        sx={{ height: 40,
            width: "auto",
            ...sx }}
            />);
}

// Logo.propTypes = {
//     sx: PropTypes.object.isRequired
// };
