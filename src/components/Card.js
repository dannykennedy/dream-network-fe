import React, { useState, useRef, useEffect } from "react";
import Tag from "./Tag";
import CardUserInfo from "./CardUserInfo";
import LoadingNotice from "./LoadingNotice";
import { connect } from "react-redux";
import PostEditor from "./PostEditor";
import FontAwesome from "react-fontawesome";
import "./css/Card.css";
import "./css/Dropdown.css";
import {
    deleteNote as _deleteNote,
    editPost as _editPost,
    setCurrentlyEditingPost as _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost as _saveTagsFromCurrentlyEditingPost,
} from "../ducks";
import { keyBy, chain, value } from "lodash";

var HtmlToReactParser = require("html-to-react").Parser;

function Card({
    user,
    entryText,
    firstName,
    lastName,
    noteId,
    timePosted,
    tags,
    deleteNote,
    editPost,
    setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost,
    currentlyEditingPost,
}) {
    const node = useRef();
    const [editingPost, setEditingPost] = useState(false);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    const handleClick = e => {
        if (node.current && node.current.contains(e.target)) {
            return; // inside click
        }
        setDropdownIsOpen(false); // outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    useEffect(() => {
        console.log(editingPost);
    }, [editingPost]);

    var _htmlToReactParser = new HtmlToReactParser();
    return (
        <div id={noteId} className="item-card">
            <div className="inner-card">
                <div className="card-header">
                    <CardUserInfo
                        firstName={firstName}
                        lastName={lastName}
                        timePosted={timePosted}
                    />
                    <div className="card-options dropdown">
                        {user && (
                            <div ref={node} className="dropdown">
                                <button
                                    className="dropbtn"
                                    onClick={() =>
                                        setDropdownIsOpen(!dropdownIsOpen)
                                    }
                                >
                                    <FontAwesome name="ellipsis-v" />
                                </button>
                                {dropdownIsOpen && (
                                    <div className="dropdown-content">
                                        <button
                                            onClick={() => deleteNote(noteId)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDropdownIsOpen(false);
                                                setEditingPost(true);
                                                const currentlyEditingPost = {
                                                    entryText: entryText.slice(
                                                        0
                                                    ),
                                                    tags: chain(tags)
                                                        .keyBy("tagId")
                                                        .value(),
                                                };
                                                setCurrentlyEditingPost(
                                                    currentlyEditingPost
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="card-body-text">
                        {editingPost ? (
                            <PostEditor
                                postId={noteId}
                                content={entryText}
                                onSave={post => {
                                    setEditingPost(false);
                                    editPost(post.noteId, post.entryText);
                                    saveTagsFromCurrentlyEditingPost(
                                        currentlyEditingPost.tags
                                    );
                                }}
                            />
                        ) : (
                            _htmlToReactParser.parse(entryText)
                        )}
                    </div>
                    <div className="card-edit-area">
                        <textarea className="card-edit-textarea"></textarea>
                        <button className="button-standard card-button-savetext">
                            Save
                        </button>
                    </div>
                </div>
                <div className="card-footer">
                    {tags ? (
                        tags.map(tag => {
                            return (
                                <Tag
                                    name={tag.tagName}
                                    type={tag.tagType}
                                    tagId={tag.tagId}
                                    key={tag.tagId}
                                    noteId={noteId}
                                    editing={editingPost}
                                />
                            );
                        })
                    ) : (
                        <LoadingNotice loadingText="Tagging in progress!" />
                    )}
                </div>
            </div>
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        user: state.user,
        currentlyEditingPost: state.currentlyEditingPost,
    };
};

const mapDispatchToProps = {
    deleteNote: _deleteNote,
    editPost: _editPost,
    setCurrentlyEditingPost: _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost: _saveTagsFromCurrentlyEditingPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);
