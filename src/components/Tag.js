import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import AutosizeInput from "react-input-autosize";
import { connect } from "react-redux";
import {
    deleteTag as _deleteTag,
    editTagInCurrentlyEditingPost as _editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost as _markTagAsDeletedInCurrentlyEditingPost,
} from "../ducks";
import "./css/Tag.css";

// No icon for 'other' type tags
const icons = {
    location: "map-marker-alt",
    person: "user",
    other: null,
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
};

function Tag({
    name,
    type,
    tagId,
    deleteTag,
    noteId,
    user,
    editing,
    editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost,
}) {
    type = types[type];

    const [tagName, setTagName] = useState(name);

    return (
        <div className={"tag " + type} id={tagId}>
            <div className="tag-wrapper">
                {icons[type] && (
                    <div className="tag-icon">
                        <FontAwesome name={icons[type]} />
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
                                event.target.value
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
                                // deleteTag(tagId, noteId);
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
    deleteTag: _deleteTag,
    markTagAsDeletedInCurrentlyEditingPost: _markTagAsDeletedInCurrentlyEditingPost,
    editTagInCurrentlyEditingPost: _editTagInCurrentlyEditingPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tag);
