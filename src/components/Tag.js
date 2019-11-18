import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import AutosizeInput from "react-input-autosize";
import Spinner from "./Spinner";
import { connect } from "react-redux";
import {
    editTagInCurrentlyEditingPost as _editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost as _markTagAsDeletedInCurrentlyEditingPost,
} from "../ducks/posts";
import "./css/Tag.css";

// No icon for 'other' type tags
const icons = {
    location: "map-marker-alt",
    person: "user",
    other: "tag",
    none: null,
};

const types = {
    PERSON: "person",
    LOCATION: "location",
    OTHER: "other",
    ORGANIZATION: "location",
    NUMBER: "other",
    EVENT: "other",
    WORK_OF_ART: "other",
    CONSUMER_GOOD: "other",
    NONE: "none",
};

function Tag({
    name,
    type,
    tagId,
    noteId,
    user,
    editing,
    editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost,
    onDelete,
}) {
    type = types[type];

    const [tagName, setTagName] = useState(name);

    return (
        <div className={"tag " + type} id={tagId}>
            <div className="tag-wrapper">
                {/* Only show tag icon while editing */}
                {icons[type] === "tag" && editing && (
                    <div className="tag-icon">
                        <FontAwesome name={icons[type]} />
                    </div>
                )}
                {icons[type] && icons[type] !== "tag" && (
                    <div className="tag-icon">
                        <FontAwesome name={icons[type]} />
                    </div>
                )}
                {!icons[type] && (
                    <div className="tag-icon">
                        <Spinner height={"20px"} />
                    </div>
                )}
                {editing ? (
                    <AutosizeInput
                        name="form-field-name"
                        value={tagName}
                        onChange={function(event) {
                            // Change local state
                            setTagName(event.target.value);
                            // Change global state
                            editTagInCurrentlyEditingPost(
                                tagId,
                                event.target.value,
                                noteId
                            );
                        }}
                    />
                ) : (
                    <div className="tag-name">
                        <span>{name}</span>
                    </div>
                )}
                {user && editing && (
                    <div className="tag-options">
                        <div
                            className="tag-remove-icon tag-icon"
                            onClick={function() {
                                markTagAsDeletedInCurrentlyEditingPost(
                                    tagId,
                                    noteId
                                );
                            }}
                        >
                            <FontAwesome name="times" />
                        </div>
                    </div>
                )}
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
    markTagAsDeletedInCurrentlyEditingPost: _markTagAsDeletedInCurrentlyEditingPost,
    editTagInCurrentlyEditingPost: _editTagInCurrentlyEditingPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
