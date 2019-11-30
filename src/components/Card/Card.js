import React, { useState, useRef, useEffect } from "react";
import CardUserInfo from "./CardUserInfo";
import TagsArea from "../TagsArea/TagsArea";
import { connect } from "react-redux";
import PostEditor from "../PostEditor/PostEditor";
import FontAwesome from "react-fontawesome";
import "./Card.css";
import "./Dropdown.css";
import {
    deleteNote as _deleteNote,
    editPost as _editPost,
    setCurrentlyEditingPost as _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost as _saveTagsFromCurrentlyEditingPost,
    deleteTagsFromCurrentlyEditingPost as _deleteTagsFromCurrentlyEditingPost,
} from "../../ducks/posts";
import { keyBy, chain, value } from "lodash";
import { Link } from "react-router-dom";

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
    currentlyEditingPosts,
    deleteTagsFromCurrentlyEditingPost,
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
                                            onClick={() => {
                                                setDropdownIsOpen(false);
                                                setEditingPost(true);
                                                const currentlyEditingPost = {
                                                    noteId: noteId,
                                                    entryText: entryText.slice(
                                                        0
                                                    ),
                                                    tags: chain(tags)
                                                        .keyBy("tagId")
                                                        .value(),
                                                    deletedTags: [],
                                                };
                                                setCurrentlyEditingPost(
                                                    currentlyEditingPost
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button>
                                            <Link
                                                to={`/dream-network/${noteId}`}
                                            >
                                                See full article
                                            </Link>
                                        </button>

                                        <button
                                            onClick={() => deleteNote(noteId)}
                                        >
                                            Delete
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
                                saveButtonText={"Save Changes"}
                                onSave={post => {
                                    setEditingPost(false);
                                    editPost(post.noteId, post.entryText);

                                    saveTagsFromCurrentlyEditingPost(
                                        currentlyEditingPosts[post.noteId]
                                    );
                                    if (
                                        currentlyEditingPosts[post.noteId]
                                            .deletedTags.length
                                    ) {
                                        deleteTagsFromCurrentlyEditingPost(
                                            currentlyEditingPosts[post.noteId]
                                                .deletedTags
                                        );
                                    }
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
                <TagsArea
                    tags={tags}
                    noteId={noteId}
                    editingPost={editingPost}
                />
            </div>
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        user: state.user.user,
        currentlyEditingPosts: state.posts.currentlyEditingPosts,
    };
};

const mapDispatchToProps = {
    deleteNote: _deleteNote,
    editPost: _editPost,
    setCurrentlyEditingPost: _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost: _saveTagsFromCurrentlyEditingPost,
    deleteTagsFromCurrentlyEditingPost: _deleteTagsFromCurrentlyEditingPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
