// import React, { Component } from "react";
// import { EditorState, convertToRaw, ContentState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./css/PostEditor.css";
// import draftToHtml from "draftjs-to-html";

// class PostEditor extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             editorState: EditorState.createEmpty(),
//         };
//     }

//     onEditorStateChange = editorState => {
//         this.setState({
//             editorState,
//         });
//     };

//     saveText = () => {
//         console.log(draftToHtml(convertToRaw(this.state.getCurrentContent())));
//     };

//     render() {
//         const { editorState } = this.state;
//         return (
//             <div>
//                 <Editor
//                     editorState={editorState}
//                     wrapperClassName="demo-wrapper"
//                     editorClassName="demo-editor"
//                     onEditorStateChange={this.onEditorStateChange}
//                 />
//                 <button onClick={this.saveText} className="button-standard">
//                     Save to your private journal
//                 </button>
//             </div>
//         );
//     }
// }

import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./css/PostEditor.css";

class PostEditor extends Component {
    constructor(props) {
        super(props);
        const html = "";
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
        this.saveText = this.saveText.bind(this);
    }

    onEditorStateChange = editorState => {
        this.setState({
            editorState,
        });
    };

    saveText = html => {
        console.log(html);
    };

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        options: [
                            "inline",
                            "link",
                            "history",
                            "image",
                            "blockType",
                        ],
                        inline: {
                            options: ["bold", "italic", "superscript"],
                        },
                        blockType: {
                            inDropdown: true,
                            options: ["Normal", "H2", "Blockquote"],
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                        },
                        image: {
                            className: undefined,
                            component: undefined,
                            popupClassName: undefined,
                            urlEnabled: true,
                            uploadEnabled: true,
                            alignmentEnabled: true,
                            uploadCallback: undefined,
                            previewImage: false,
                            inputAccept:
                                "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                            alt: { present: false, mandatory: false },
                            defaultSize: {
                                height: "auto",
                                width: "auto",
                            },
                        },
                    }}
                />
                <button
                    onClick={function() {
                        console.log(
                            draftToHtml(
                                convertToRaw(editorState.getCurrentContent())
                            )
                        );
                    }}
                    className="button-standard"
                >
                    Save to your journal
                </button>
            </div>
        );
    }
}

export default PostEditor;

// {/* <textarea
//     disabled
//     value={draftToHtml(
//         convertToRaw(editorState.getCurrentContent())
//     )}
// /> */}
