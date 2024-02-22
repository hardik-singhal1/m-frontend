import {useEffect, useState} from "react";

function DiffEditorHelper({
                          files,
                          onFileContentChange
                      }) {

    const [filesState, setFilesState] = useState([]);

    useEffect(() => {
        setFilesState(files);
    }, [files]);

    return (
        <>
            {
                filesState.map(f => onFileContentChange(f.name, f.content))
            }
        </>
    )

}

export default DiffEditorHelper;