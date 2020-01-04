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
import {
    addItem as _addItem,
    addCustomSlug as _addCustomSlug,
} from "../../ducks/items";
// Config
import editorConfig from "./editorConfig";
import PropTypes from "prop-types";

// "Nuke formatting" option for PDF copy-paste etc.
class RemoveFormattingOption extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    };

    removeFormatting = () => {
        const { editorState, onChange } = this.props;

        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        html = `<p>${striptags(html)}</p>`.replace(/\n/g, " ");
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
        );
        const newEditorState = EditorState.createWithContent(contentState);

        onChange(
            EditorState.push(newEditorState, contentState, "change-block-data")
        );
    };

    render() {
        const eraserIcon =
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOC4xIDE0bDYuNC03LjJjLjYtLjcuNi0xLjgtLjEtMi41bC0yLjctMi43Yy0uMy0uNC0uOC0uNi0xLjMtLjZIOC42Yy0uNSAwLTEgLjItMS40LjZMLjUgOS4yYy0uNi43LS42IDEuOS4xIDIuNWwyLjcgMi43Yy4zLjQuOC42IDEuMy42SDE2di0xSDguMXptLTEuMy0uMXMwLS4xIDAgMGwtMi43LTIuN2MtLjQtLjQtLjQtLjkgMC0xLjNMNy41IDZoLTFsLTMgMy4zYy0uNi43LS42IDEuNy4xIDIuNEw1LjkgMTRINC42Yy0uMiAwLS40LS4xLS42LS4yTDEuMiAxMWMtLjMtLjMtLjMtLjggMC0xLjFMNC43IDZoMS44TDEwIDJoMUw3LjUgNmwzLjEgMy43LTMuNSA0Yy0uMS4xLS4yLjEtLjMuMnoiLz48L3N2Zz4=";
        return (
            <div
                onClick={this.removeFormatting}
                className="rdw-option-wrapper"
                title="Remove all formatting. Can't be undone."
            >
                <img src={eraserIcon} alt="Remove formatting"></img>
            </div>
        );
    }
}

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
                    toolbarCustomButtons={[<RemoveFormattingOption />]}
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
    addCustomSlug: _addCustomSlug,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
