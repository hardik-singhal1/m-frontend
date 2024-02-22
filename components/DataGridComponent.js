import * as React from "react";
import { Box, Pagination, Skeleton, Typography } from "@mui/material";
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

const StyledGridOverlay = styled("div")(({ theme }) => ({
    "& .ant-empty-img-1": {
        fill: theme.palette.mode === "light"
            ? "#aeb8c2"
            : "#262626"
    },
    "& .ant-empty-img-2": {
        fill: theme.palette.mode === "light"
            ? "#f5f5f7"
            : "#595959"
    },
    "& .ant-empty-img-3": {
        fill: theme.palette.mode === "light"
            ? "#dce0e6"
            : "#434343"
    },
    "& .ant-empty-img-4": {
        fill: theme.palette.mode === "light"
            ? "#fff"
            : "#1c1c1c"
    },
    "& .ant-empty-img-5": {
        fill: "#f5f5f5",
        fillOpacity: theme.palette.mode === "light"
            ? "0.8"
            : "0.08"
    },
    "alignItems": "center",
    "display": "flex",
    "flexDirection": "column",
    "height": "100%",
    "justifyContent": "center"
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            {/*<Box*/}
            {/*    component="img"*/}
            {/*    src="/noRows.svg"*/}
            {/*/>*/}
            <Typography
                style={{ color: "#A1A7B8",
                    fontWeight: "bolder" }}
                variant="body2"
            >
                No Data Found
            </Typography>
        </StyledGridOverlay>
    );
}

// const useStyles = makeStyles({
//     root: {
//         "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
//             outline: "none"
//         },
//         "& .MuiDataGrid-columnHeaderTitleContainerContent": {
//         },
//         '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
//             outline: 'none',
//         },
//         '& .MuiDataGrid-columnsContainer':{
//             backgroundColor: "#1b4077",
//             color:'white',
//             borderRadius:'0.5rem',
//             fontWeight:'bold'
//         },
//     }
// });


function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
            page={page + 1}
        />
    );
}

function DataGridComponent({ rows, columns, height, width, selectedValues, loading, search, pageSize }) {
    const LoadingSkeleton = useCallback(() => (<Box
        sx={{
            height: "max-content",
            animation: "pulse",
            // marginTop:"3.5rem"
        }}
    >
        {
            [...Array(8)].map((_, i) => (
                <div
                    key={i}
                    style={{ display: "flex"}}
                >
                    {
                        // [...Array(moduleColumn.length)].map((x, j) => (
                        <Skeleton
                            // key={j}
                            sx={{ height: 35,
                                width: "100%",
                                my: 1,
                                mx: 1 }}
                            variant="rectangular"
                        />
                        // ))
                    }
                </div>
            ))
        }
    </Box>));
    // const classes = useStyles();
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);

    function onSelectedListChange(newSelectedList) {
        if (selectedValues) {
            selectedValues(newSelectedList);
        }
    }

    const onSelectionModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel);
        onSelectedListChange(rows.filter((row) => newSelectionModel.includes(row.id)));
    });

    return (
        // <div style={{
        //     height:"100%",
        //     width:"100%",
        //     fontFamily:'sans-serif'
        //     // boxShadow: "0px 7px 20px -8px rgba(0, 0, 0, 0.1)"
        // }}
        // >
            <DataGrid
                checkboxSelection={Boolean(selectedValues)}
                // className={classes.root}
                columns={columns}
                components={{
                    LoadingOverlay: LoadingSkeleton,
                    NoRowsOverlay: CustomNoRowsOverlay,
                    Pagination: CustomPagination
                }}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 200}
                density="standard"
                disableColumnSelector
                disableSelectionOnClick
                loading={loading}
                onSelectionModelChange={onSelectionModelChange}
                pageSize={pageSize}
                pagination
                rows={loading ? [] : rows}
                rowsPerPageOptions={[5]}
                selectionModel={selectionModel}
                style={{
                    border: 0,
                    borderRadius:'1rem',
                    boxShadow: "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
                }}
                sx={{
                    '& .MuiDataGrid-cell' :{
                        whiteSpace: "normal !important",
                        wordWrap: "break-word !important"
                    },
                    '&.MuiDataGrid-root .MuiDataGrid-row': {
                        // borderRadius: '2px',
                        // padding:"1rem 0",

                        padding:"0.7rem 0"
                    },
                    '&>.MuiDataGrid-main': {
                        '&>.MuiDataGrid-columnHeaders': {
                            borderBottom: 'none'
                        },
                        '& .MuiDataGrid-columnHeaderTitle':{
                            fontWeight:"600",
                            fontSize:"16px"
                        },
                        '& .MuiDataGrid-columnSeparator': {
                            visibility: 'hidden',
                        },
                        '& div div div div >.MuiDataGrid-cell': {
                            borderBottom: 'none',
                        }
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                    },
                    // "&:MuiDataGrid-root":{
                    //     margin:1
                    // },
                    fontFamily:`"Public Sans", sans-serif`,
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f4f6f8",
                        color: "rgb(99, 115, 129)",
                        fontWeight: "bold",
                        borderRadius: "1rem 1rem 0 0",
                    },
                }}
            />
        // </div>
    );
}

export default React.memo(DataGridComponent);

DataGridComponent.propTypes = {
    columns: PropTypes.any.isRequired,
    height: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    rows: PropTypes.array.isRequired,
    selectedValues: PropTypes.func,
    width: PropTypes.string.isRequired
};
