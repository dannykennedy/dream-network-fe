import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./ItemEditor.css";
import uuidV4 from "../../modules/uuid";
// Dispatch
import { connect } from "react-redux";
import { addItem as _addItem } from "../../ducks/items";
// Config
import editorConfig from "../../modules/editorConfig";

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
                />
                <button
                    onClick={() => {
                        this.handleSubmit(
                            draftToHtml(
                                convertToRaw(editorState.getCurrentContent())
                            ),
                            this.props
                        );
                    }}
                    className="button-standard"
                >
                    {this.props.saveButtonText || "Save"}
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
