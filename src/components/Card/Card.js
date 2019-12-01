import React, { useState, useRef, useEffect } from "react";
import CardUserInfo from "./CardUserInfo";
import TagsArea from "../TagsArea/TagsArea";
import { connect } from "react-redux";
import PostEditor from "../PostEditor/PostEditor";
import FontAwesome from "react-fontawesome";
import "./Card.css";
import "./Dropdown.css";
import {
    deletePost as _deletePost,
    editPost as _editPost,
    setCurrentlyEditingPost as _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost as _saveTagsFromCurrentlyEditingPost,
    deleteTagsFromCurrentPost as _deleteTagsFromCurrentPost,
} from "../../ducks/posts";
import { chain, values } from "lodash";
import { Link } from "react-router-dom";

var HtmlToReactParser = require("html-to-react").Parser;

function Card({
    post,
    user,
    deletePost,
    editPost,
    setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost,
    currentlyEditingPosts,
    deleteTagsFromCurrentPost,
    userPosts,
}) {
    const { entryText, firstName, lastName, postId, timePosted, tags } = post;
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
        <div id={postId} className="item-card">
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
                                                    postId: postId,
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
                                                to={`/dream-network/${postId}`}
                                            >
                                                See full article
                                            </Link>
                                        </button>

                                        <button
                                            onClick={() => deletePost(postId)}
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
                                postId={postId}
                                content={entryText}
                                saveButtonText={"Save Changes"}
                                onSave={post => {
                                    setEditingPost(false);
                                    editPost(post.postId, post.entryText);

                                    saveTagsFromCurrentlyEditingPost(
                                        currentlyEditingPosts[post.postId]
                                    );
                                    deleteTagsFromCurrentPost(
                                        values(
                                            userPosts[post.postId].tags
                                        ).filter(tag => tag.isDeleted)
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
                <TagsArea
                    tags={tags}
                    postId={postId}
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
        userPosts: state.posts.userPosts,
        currentlyEditingPosts: state.posts.currentlyEditingPosts,
    };
};

const mapDispatchToProps = {
    deletePost: _deletePost,
    editPost: _editPost,
    setCurrentlyEditingPost: _setCurrentlyEditingPost,
    saveTagsFromCurrentlyEditingPost: _saveTagsFromCurrentlyEditingPost,
    deleteTagsFromCurrentPost: _deleteTagsFromCurrentPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
