import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import striptags from "striptags";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./ItemEditor.css";
import uuidV4 from "../../modules/uuid";
// import clearFormatting from "draft-js-clear-formatting";
// Dispatch
import { connect } from "react-redux";
import { addItem as _addItem } from "../../ducks/items";
// Config
import editorConfig from "./editorConfig";

class ItemEditor extends Component {
    constructor(props) {
        super(props);
        const html = props.content;
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onEditorStateChange = editorState => {
        this.setState({
            editorState,
        });
    };

    clearEditor = () => {
        const html = "";
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
            editorState,
        });
    };

    clearEditorButton = () => {
        return <div onClick={this.clearEditor}>Nukem!</div>;
    };

    handleSubmit(postText, props) {
        let itemId = props.itemId ? props.itemId : uuidV4();

        let post = {
            entryText: postText,
            itemId: itemId,
            firstName: props.user.given_name,
            lastName: props.user.family_name,
            timePosted: new Date().toISOString(),
            tags: null,
            userId: 3,
            userName: props.user.preferred_username,
        };
        this.clearEditor();
        props.onSave(post, itemId);
    }

    nukeFormatting(htmlContent) {
        console.log("Nuking ", htmlContent);

        const html = `<p>${striptags(htmlContent)}</p>`.replace(/\n/g, " ");
        console.log("Nuked ", html);
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
            editorState,
        });
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={editorConfig}
                    stripPastedStyles={true}
                />
                <button
                    className="button-standard"
                    onClick={() => {
                        this.handleSubmit(
                            draftToHtml(
                                convertToRaw(editorState.getCurrentContent())
                            ),
                            this.props
                        );
                    }}
                >
                    {this.props.saveButtonText || "Save"}
                </button>

                <button
                    className="button-standard"
                    onClick={() => {
                        this.nukeFormatting(
                            draftToHtml(
                                convertToRaw(editorState.getCurrentContent())
                            )
                        );
                    }}
                >
                    Nuke all formatting!
                </button>
            </div>
        );
    }
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        items: state.items.items,
        user: state.user.user,
    };
};

const mapDispatchToProps = {
    addItem: _addItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
