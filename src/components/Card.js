import React, { useState, useRef, useEffect } from "react";
import Tag from "./Tag";
import { parseTimestamp } from "../modules/parseDate";
import LoadingNotice from "./LoadingNotice";
import { connect } from "react-redux";
import PostEditor from "./PostEditor";
import FontAwesome from "react-fontawesome";
import "./css/Card.css";
import "./css/Dropdown.css";
import { deleteNote as _deleteNote, editPost as _editPost } from "../ducks";

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
}) {
    const node = useRef();
    const [editingPost, setEditingPost] = useState(false);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
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

    var _htmlToReactParser = new HtmlToReactParser();
    return (
        <div id={noteId} className="item-card">
            <div className="inner-card">
                <div className="card-header">
                    <div className="card-avatar tooltip">
                        <div className="avatar-photo">
                            <span className="tooltiptext">{`${firstName} ${lastName}`}</span>
                            <div className="avatar-text">
                                {firstName.charAt(0) + lastName.charAt(0)}
                            </div>
                        </div>
                    </div>
                    <div className="card-header-text">
                        <div className="card-author">{`${firstName} ${lastName}`}</div>
                        <div className="card-date">
                            {parseTimestamp(timePosted)}
                        </div>
                    </div>
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
                                            onClick={() => setEditingPost(true)}
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
                                    console.log(
                                        "text in card is: ",
                                        post.entryText
                                    );

                                    setEditingPost(false);
                                    editPost(post.noteId, post.entryText);
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
    };
};

const mapDispatchToProps = {
    deleteNote: _deleteNote,
    editPost: _editPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);
