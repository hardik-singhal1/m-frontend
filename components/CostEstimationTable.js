import "react-table/react-table.css";
import React from "react";
import ReactTable from "react-table";
// import styles from "./styles/CostEstimation.module.css"
// Columns for usage based resources
const columns = [
    {
        Header: "Resource Name",
        accessor: "name",
        id: "resoureName"
    },
    // {
    //     Header: "Cost ($)",
    //     accessor: "cost",
    //     id: "cost"
    // }
];
const subColumns = [
    {
        Header: "Sub Resources",
        accessor: "name",
        id: "name"
    }
];
const costComponentColumns = [
    {
        Header: "Cost Components",
        accessor: "name",
        id: "name",
    },
    {
        Header: "Cost ($)",
        accessor: "price",
        id: "price",
    },
    {
        Header: "Unit",
        accessor: "unit",
        id: "unit"
    }
];
// Columns for reserved
const resColumns = [
    {
        Header: "Resource Name",
        accessor: "name",
        id: "resoureName"
    },
    {
        Header: "HourlyCost ($)",
        accessor: "hourlyCost",
        id: "hourlyCost"
    },
    {
        Header: "MonthlyCost ($)",
        accessor: "monthlyCost",
        id: "monthlyCost"
    }
];
const resCostColumns = [
    {
        Header: "Cost Component",
        accessor: "name",
        id: "name"
    },
    {
        Header: "Unit",
        accessor: "unit",
        id: "unit"
    },
    {
        Header: "Price ($)",
        accessor: "price",
        id: "price"
    },
    {
        Header: "HourlyQuantity",
        accessor: "hourlyQuantity",
        id: "hourlyQuantity"
    },
    {
        Header: "HourlyCost ($)",
        accessor: "hourlyCost",
        id: "hourlyCost"
    },
    {
        Header: "MonthlyQuantity",
        accessor: "monthlyQuantity",
        id: "monthlyQuantity"
    },
    {
        Header: "MonthlyCost ($)",
        accessor: "monthlyCost",
        id: "monthlyCost"
    }
];
function CollapsibleTableComponent({ rows, type }) {
    return (
        <div style={{boxShadow:"none"}}>
            <ReactTable style={{background:'#fafbfb',borderRadius:"0.5rem",boxShadow:"none"}}
                SubComponent={(event) => {
                    return (
                        <div>
                            {
                                (event.row._original.costComponents && event.row._original.costComponents!==null)&&
                                <ReactTable
                                    style={{padding: "2rem",border:"none",boxShadow:"none"}}
                                    columns={type === "reserved"
                                        ? resCostColumns
                                        : costComponentColumns}
                                    data={event.row._original.costComponents}
                                    defaultPageSize={event.row._original.costComponents.length}
                                    showPagination={false}
                                />
                            }
                            {
                                (event?.row._original?.subresources && event?.row._original?.subresources!==null) &&
                                <ReactTable
                                    SubComponent={(event) => {
                                        return (
                                            <ReactTable
                                                style={{border:"none",boxShadow:"none"}}
                                                columns={costComponentColumns}
                                                data={event.row._original?.costComponents}
                                                defaultPageSize={event.row._original.costComponents?.length}
                                                showPagination={false}
                                            />
                                        );
                                    }}
                                    // className={styles.CollapseTable}
                                    style={{padding: "2rem"}}
                                    columns={subColumns}
                                    data={event.row._original?.subresources}
                                    defaultPageSize={event.row._original?.subresources.length +1}
                                    showPagination={false}
                                />
                            }
                        </div>
                    );
                }}
                columns={type === "reserved"
                    ?resColumns:columns}
                data={rows}
                pageSize={rows.length==0?5:rows.length}
                showPagination={false}
            />
            <br />
        </div>
    );
}
export default React.memo(CollapsibleTableComponent);
