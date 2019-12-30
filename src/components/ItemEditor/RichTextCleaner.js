import * as React from "react";
import {
    EditorState,
    CharacterMetadata,
    ContentBlock,
    ContentState,
} from "draft-js";

//NIH https://github.com/facebook/draft-js/issues/166#issuecomment-393488544
const removeInlineStyles = (editorState, retainInlineStyles) => {
    if (!retainInlineStyles) {
        retainInlineStyles = [];
    }

    let blocks = editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .map(singleBlock =>
            singleBlock.set(
                "characterList",
                singleBlock.getCharacterList().map(charMetaData => {
                    if (!charMetaData) {
                        return charMetaData;
                    }
                    let entity = charMetaData.getEntity();
                    let style = charMetaData.getStyle();
                    return CharacterMetadata.create({
                        entity: entity,
                        style: style.intersect(retainInlineStyles),
                    });
                })
            )
        );
    return EditorState.createWithContent(
        ContentState.createFromBlockArray(blocks)
    );
};

// interface Props {
//     editorState?: EditorState;
//     onChange?: (editorState: EditorState) => void;
// }

const eraserIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOC4xIDE0bDYuNC03LjJjLjYtLjcuNi0xLjgtLjEtMi41bC0yLjctMi43Yy0uMy0uNC0uOC0uNi0xLjMtLjZIOC42Yy0uNSAwLTEgLjItMS40LjZMLjUgOS4yYy0uNi43LS42IDEuOS4xIDIuNWwyLjcgMi43Yy4zLjQuOC42IDEuMy42SDE2di0xSDguMXptLTEuMy0uMXMwLS4xIDAgMGwtMi43LTIuN2MtLjQtLjQtLjQtLjkgMC0xLjNMNy41IDZoLTFsLTMgMy4zYy0uNi43LS42IDEuNy4xIDIuNEw1LjkgMTRINC42Yy0uMiAwLS40LS4xLS42LS4yTDEuMiAxMWMtLjMtLjMtLjMtLjggMC0xLjFMNC43IDZoMS44TDEwIDJoMUw3LjUgNmwzLjEgMy43LTMuNSA0Yy0uMS4xLS4yLjEtLjMuMnoiLz48L3N2Zz4=";

export class RichTextCleaner extends React.Component {
    clean = () => {
        const { editorState, onChange } = this.props;
        onChange(removeInlineStyles(editorState));
    };

    render() {
        return (
            <div
                className="rdw-remove-wrapper"
                aria-label="rdw-remove-control"
                onClick={this.clean}
            >
                <div className="rdw-option-wrapper" title="Remove">
                    <img src={eraserIcon} alt="" />
                </div>
            </div>
        );
    }
}
