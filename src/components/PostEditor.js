import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./css/PostEditor.css";
import uuidV4 from "../modules/uuid";
// Dispatch
import { connect } from "react-redux";
import { addPost as _addPost } from "../ducks";
// Config
import editorConfig from "../modules/editorConfig";

class PostEditor extends Component {
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

    handleSubmit(noteText, props) {
        console.log("got text to submit: ", noteText);

        let post = {
            entryText: noteText,
            noteId: uuidV4(),
            firstName: props.user.given_name,
            lastName: props.user.family_name,
            timePosted: new Date().toISOString(),
            tags: null,
            userId: 3,
            userName: props.user.preferred_username,
        };
        props.addPost(post);
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
                    Save
                </button>
            </div>
        );
    }
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        posts: state.posts,
        user: state.user,
    };
};

const mapDispatchToProps = {
    addPost: _addPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostEditor);
