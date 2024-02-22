const UseStyle = theme => ({
    root: {
        display: 'flex',
    },

    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    productTitle: {
        width: 'auto',
        margin: theme.spacing(1),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    tabBarRoot: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.secondary.main,
        TextTransform: "none",
        flexGrow: 1,
        width: 'auto',
        paddingRight: theme.spacing(4),
        margin: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(0),


    },
    tabBarTitle: {
        textTransform: "none",
        fontSize: 17,
        color: theme.palette.primary.main
    },

    tabContentRoot: {
        width: 'auto',
        margin: theme.spacing(0),
    },
    tabContentHead: {
        width: 'auto',
        margin: theme.spacing(0),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    tableHead: {
        minWidth: 70,
        background: theme.palette.background.default,
        color: '#000'
    },
    orgDialog: {
        background: '#ecf6fe',
        minWidth: 500,
    },
    orgInput: {
        background: theme.palette.background.default,
        width: "100%",
    },
    dialogTitle: {
        margin: theme.spacing(4),
    },
    dialogActions: {
        margin: theme.spacing(4),
    },
    dialogContent: {
        width: "80%",
        margin: "auto",
    },
    closeIcon: {
        float: "right",
    },
    createButtons: {
        textTransform: 'none',
        width: 100
    },
    deleteButtons: {
        textTransform: 'none',
        color: 'white',
        width: 100,
        background: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.main,
        },
    },
    deleteDialogPaper: {
        margin: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    deleteActionButtons: {
        margin: theme.spacing(2),
        textTransform: 'none'
    },
    networkAppBar: {
        position: 'relative',
    },
    networkTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
        align: 'center',
        padding: '15px 15px',
    },
    networkFormLayout: {
        margin: '15px 10px 10px 0px',
        marginLeft: '20%',
        minWidth: 500,
    },
    networkFormLabel: {
        paddingTop: '15px',
    },
    newTemplateButton: {
        marginTop: theme.spacing(2),
        textTransform: 'none'
    },
    subnetRoot: {
        width: '400',
        marginLeft: '20%',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginBottom: '20px',
    },
    subnetTitle: {
        margin: '15px 15px',
    },
    subnetForm: {
        margin: '10px 10px 10px 0px',
        marginLeft: '20%',
        marginRight: '20%',
        minWidth: 500,
        maxWidth: 500,
    },
    subnetFormLabel: {
        margin: '15px 10px 10px 0px',
        marginLeft: '10%'
    },
    subnetButton: {
        marginLeft: '80%',
        marginTop: '20px',
        minWidth: 100,
        textTransform: 'none'
    },
    networkTableRoot: {
        minWidth: '50%',
        marginLeft: '20%',
        marginRight: '20%'
    },
    backButton: {
        marginTop: '20px',
        marginLeft: '21%',
        marginBottom: '5%'
    },
    region: {
        minWidth: 500,
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.main,
    },
    search: {
        position: 'relative',
        marginTop: 20,
        color: 'black',
        float: 'right',
        border: "1px solid",
        borderColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.default,
        marginRight: theme.spacing(2),
        marginLeft: 0,
        minWidth: 500
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('minwidth'),
        minwidth: 500,
        [theme.breakpoints.up('md')]: {
            width: '50ch',
        }
    },
    tabBarVerticalRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        minWidth: '900px',
        marginTop: 20,
        height: 250

    },
    verticalTabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        width: 250
    },
    verticalTabContent: {
        maxWidth: 800
    },
    categoryTitle: {
        marginTop: 20,
        marginLeft: 60
    },
    marketPlaceTitle: {
        marginBottom: 20,
    },
    toolsCard: {
        maxWidth: 250
    },
    toolsCheckbox: {
        margin: theme.spacing(4),
    }
});
export default UseStyle;