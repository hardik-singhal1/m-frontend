import Editor from "@monaco-editor/react";
import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary, Button,
    createTheme,
    ThemeProvider,
    Typography
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {styled} from '@mui/material/styles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import {addTFModule, getTFModule} from '@aravindlib1/testgopherjs/parser';
import {Edit, MoreVert, Refresh} from "@material-ui/icons";
import Box from "@material-ui/core/Box";

export default function NewProjectEditor({
                                            editorFileName,
                                            editorExpanded,
                                            editorValue,
                                         }) {

    // file name displayed in the header of the accordion
    const [fileName, setFileName] = useState("");

    // text content in the editor
    const [value, setValue] = useState("test");

    // expand the accordion to reveal the editor
    const [expanded, setExpanded] = useState(false);

    // compute height of the editor component
    const [height, setHeight] = useState("90vh");

    // markers
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        adjustHeightAccordingToLines(editorValue);
        let file = {
            "name": "test.tf",
            "content": editorValue
        }

        // addTFModule(
        //     file,
        //     {
        //         "first_header": "test",
        //         "second_header": "test",
        //         "attributes": {
        //             "test": "tseffffff",
        //             "sttttttttttttttttttttt": {
        //                 "test": "test"
        //             }
        //         }
        //     }
        // )
        setValue(file.content);
    }, [editorValue]);

    function adjustHeightAccordingToLines(value) {
        let count = (value.match(/\n/g) || []).length;
        setHeight(`${count * 20.399999}px`);
    }

    function addMarkers(value) {
        let files = [
            {
                "name": "test.tf",
                "content": value
            },
            {
                "name": "variables.tf",
                "content": `
variable "test" {
	type = "string"
	description = "the test variable"
}
variable "test_optional" {
	type = "string"
	description = "the optional variable"
	default = "optional text"
}
`
            },
            {
                name: "variables.tfvars",
                content: `
test=1
`
            }
        ]
        let m = getTFModule(files, {
            "first_header": "test",
            "second_header": "*",
        })

        if(m.Module.Attributes == null) {
            return [];
        }

        return [
            {
                startLineNumber: m.Module.HeaderRange.Start.Line,
                startColumn: m.Module.HeaderRange.Start.Column,
                endLineNumber: m.Module.HeaderRange.End.Line,
                endColumn: m.Module.HeaderRange.End.Column,
                message: 'Missing attributes',
                severity: monaco.MarkerSeverity.Error
            }
        ];
    }

    useEffect(() => {
        setExpanded(editorExpanded);
    }, [editorExpanded]);

    useEffect(() => {
        setFileName(editorFileName);
    }, [editorFileName]);

    function onEditorValueChange(value, m) {
        setValue(value);
        adjustHeightAccordingToLines(value);
        // let markers = addMarkers(value);
        // if(monacoObj !== null && editor !== null) {
        //     monacoObj.editor.setModelMarkers(editor.getModel(), "owner", markers);
        // }
        // setMarkers(markers);
    }

    function onExpandClick(event, isExpanded) {
        setExpanded(isExpanded);
    }

    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            {...props}
        />
    ))(({ theme }) => ({
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

    const [monacoObj, setMonacoObj] = useState(null);
    const [editor, setEditor] = useState(null);

    return (
        <div
        >
            <Accordion
                disableGutters={true}
                expanded={expanded}
                onChange={onExpandClick}
                TransitionProps={{ unmountOnExit: true }}
                sx={{
                    border: `1px solid lightgrey`
                }}
                elevation={0}
            >
                <AccordionSummary
                    expandIcon={<ExpandLessIcon />}
                    sx={{
                        borderBottom: `${expanded ? '1' : '0'}px solid lightgrey`
                    }}
                >
                    <ThemeProvider theme={headingFont}>
                        <Typography variant={"body2"}>
                            {fileName}
                        </Typography>
                        <Box sx={{flexGrow: 1}}/>
                        <Button sx={{height: 25, marginLeft: 1, marginRight: 1}} variant={"contained"} disabled={true}>Save</Button>
                        <Edit sx={{marginLeft: 1, marginRight: 1}}/>
                        <MoreVert sx={{marginLeft: 1, marginRight: 1}}/>
                    </ThemeProvider>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        height: "fit-content"
                    }}
                >
                    <Editor
                        height={height}
                        defaultLanguage={"hcl"}
                        value={value}
                        path={fileName}
                        onChange={onEditorValueChange}
                        onMount={(editor, monaco) => {
                            setMonacoObj(monaco);
                            setEditor(editor);
                            // let markers = addMarkers(editor.getValue());
                            // monaco.editor.setModelMarkers(editor.getModel(), "owner", markers);
                        }}
                    />
                </AccordionDetails>

            </Accordion>

        </div>
    )
}