import React, {useEffect, useRef, useState} from "react";
import {getTFModule} from "@aravindlib1/testgopherjs/parser";
import {styled} from "@mui/material/styles";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    Button,
    delFile,
    createTheme,
    ThemeProvider,
    Typography
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Box from "@material-ui/core/Box";
import Editor from "@monaco-editor/react";
import {Refresh} from "@material-ui/icons";
import {Fab} from "@material-ui/core";

function EditorView({
                        editorFileName,
                        editorExpanded,
                        editorValue,
                        deleteFile,
                        editorMarkers,
                        onFileSave,
                        onValueChange,
                        autoComplete
                    }) {

    // file name displayed in the header of the accordion
    const [fileName, setFileName] = useState("");

    // text content in the editor
    const [value, setValue] = useState("test");

    // expand the accordion to reveal the editor
    const [expanded, setExpanded] = useState(false);

    // compute height of the editor component
    const [height, setHeight] = useState("60vh");

    // markers
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        adjustHeightAccordingToLines(editorValue);
        setValue(editorValue);
    }, [editorValue]);

    function adjustHeightAccordingToLines(value) {
        if (value !== undefined) {
            let count = (value.match(/\n/g) || []).length;
            if (count > 2) {
                setHeight(`${count * 20.399999}px`);
            }
        }
    }

    useEffect(() => {
        setExpanded(editorExpanded);
    }, [editorExpanded]);

    useEffect(() => {
        setFileName(editorFileName);
    }, [editorFileName]);

    function onEditorValueChange(value) {
        onValueChange(fileName, value);
        adjustHeightAccordingToLines(value);
    }

    // function deleteFile(value) {
    //     delFile(fileName)
    // }

    function onExpandClick(event, isExpanded) {
        setExpanded(isExpanded);
    }

    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            {...props}
        />
    ))(({theme}) => ({
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, .03)'
                : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(-180deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    }));

    const headingFont = createTheme({
        typography: {
            fontFamily: [
                'Source Code Pro',
                'monospace',
            ].join(','),
        },
    });

    const monacoRef = useRef(null);
    const [monacoObj, setMonacoObj] = useState(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (monacoObj && editor && markers) {
            monacoObj.editor.setModelMarkers(editor.getModel(), "owner", markers);
        }
    }, [monacoObj, editor]);

    useEffect(() => {
        if (monacoObj && editor) {
            monacoObj.editor.setModelMarkers(editor.getModel(), "owner", editorMarkers);
        }
        setMarkers(editorMarkers);
    }, [editorMarkers]);

    useEffect(
        () => {
            // initialization on mount here...

            // returning the destructor
            return dispose
        },
        [editor],
    );

    function dispose() {
        if (editor) {
            editor.dispose();
        }
    }

    return (
        <div
        >
            <Accordion
                disableGutters={true}
                expanded={expanded}
                onChange={onExpandClick}
                TransitionProps={{unmountOnExit: true}}
                sx={{
                    border: `1px solid ${markers && markers.length > 0 ? "indianred" : "lightgrey"}`
                }}
                elevation={0}
            >
                <AccordionSummary
                    expandIcon={<ExpandLessIcon/>}
                    sx={{
                        borderBottom: `${expanded ? '1' : '0'}px solid lightgrey`
                    }}
                >
                    <ThemeProvider theme={headingFont}>
                        <Typography variant={"body2"}>
                            {fileName}
                        </Typography>
                        <Box sx={{flexGrow: 1}}/>
                    </ThemeProvider>
                    {/*<Button*/}
                    {/*    startIcon={<DeleteIcon/>}*/}
                    {/*    onClick={() => deleteFile(fileName)}*/}
                    {/*/>*/}
                </AccordionSummary>
                {/*<AccordionActions>*/}
                {/*    <Button*/}
                {/*        sx={{height: 25, marginLeft: 1, marginRight: 1}}*/}
                {/*        variant={"contained"}*/}
                {/*        disabled={markers && markers.length > 0}*/}
                {/*        onClick={() => onFileSave(fileName, value)}*/}
                {/*    >*/}
                {/*        Save*/}
                {/*    </Button>*/}
                {/*    <Edit sx={{marginLeft: 1, marginRight: 1}}/>*/}
                {/*    <MoreVert sx={{marginLeft: 1, marginRight: 1}}/>*/}
                {/*</AccordionActions>*/}
                <AccordionDetails
                    sx={{
                        height: "fit-content"
                    }}
                >
                    <Editor
                        key={fileName}
                        height={height}
                        defaultLanguage={"hcl"}
                        value={value}
                        path={fileName}
                        onChange={onEditorValueChange}
                        onMount={(editor, monaco) => {
                            monacoRef.current = monaco;
                            setMonacoObj(monaco);
                            setEditor(editor);
                        }}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default EditorView;