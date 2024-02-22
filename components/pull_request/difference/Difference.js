import React, {useEffect} from "react";
import Editor from '@monaco-editor/react';
import EditorView from "../../editor/EditorView";
import EditorHelper from "../../editor/EditorHelper";
import DiffEditorView from "../../editor/DiffEditor";
import DiffEditorHelper from "../../editor/DiffEditorHelper";

export default function Difference({files}) {

    return (
        <div>
            <DiffEditorHelper
                files={files}
                onFileContentChange={(fileName, fileContent) => {
                    return (
                        <>
                            <DiffEditorView
                                key={fileName}
                                editorFileName={fileName}
                                editorValue={fileContent}
                                editorExpanded={false}
                            />
                            <br/>
                        </>
                    );
                }}
            />
        </div>
    )
}