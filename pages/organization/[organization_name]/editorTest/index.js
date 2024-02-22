import EditorHelper from "../../../../components/editor/EditorHelper";
import EditorView from "../../../../components/editor/EditorView";
import {useEffect, useState} from "react";

function editorTest({files}) {

    const [filesState, setFilesState] = useState([
        {
            "name": "test.tf",
            "content": `module "gke-opinionated" {
     source = "bootlabstech/gke-opinionated/google"
     version = "1.0.0-beta.3"
     subnet= var.test_subnet
}
`
        },
        {
            "name": "test.tfvars",
            "content": `variable "test_subnet" {
	type = "string"
	description = "the test variable"
}
test_subnet = 1
`
        }
    ]);

    function onFileSave(fileName, fileContent) {
        let newFileState = [...filesState];

        newFileState.forEach((v, i) => {
            if (v.name === fileName) {
                newFileState[i] = {
                    name: fileName,
                    content: fileContent
                }
            }
        });

        setFilesState(newFileState);
    }

    return(
        <EditorHelper
            files={filesState}
            onFileContentChange={(fileName, fileContent, markers, autoComplete, onValueChange) => {
                return (
                    <div key={fileName}>
                        <EditorView
                            key={fileName}
                            editorFileName={fileName}
                            editorValue={fileContent}
                            // editorExpanded={false}
                            editorMarkers={markers}
                            onFileSave={onFileSave}
                            onValueChange={onValueChange}
                            autoComplete={autoComplete}
                        />
                        <br/>
                    </div>
                );
            }}
        />
    )
}

export default editorTest;