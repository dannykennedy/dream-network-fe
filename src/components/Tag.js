import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import AutosizeInput from "react-input-autosize";
import { connect } from "react-redux";
import { deleteTag as _deleteTag } from "../ducks";
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

function Tag({ name, type, tagId, deleteTag, noteId, user, editing }) {
    type = types[type];

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
                        value={name}
                        onChange={function(event) {
                            // event.target.value contains the new value
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
                                deleteTag(tagId, noteId);
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tag);
