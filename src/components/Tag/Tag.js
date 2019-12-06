import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import AutosizeInput from "react-input-autosize";
import Spinner from "../Spinner";
import TagDropdown from "./TagDropdown";
import { connect } from "react-redux";
import {
    editTagInCurrentlyEditingPost as _editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost as _markTagAsDeletedInCurrentlyEditingPost,
} from "../../ducks/posts";
import "./Tag.css";
import { icons } from "../../theme/icons";
import { tagTypes, mapEntitiesToTypes } from "./tagTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Tag({
    name,
    type,
    tagId,
    postId,
    user,
    editing,
    editTagInCurrentlyEditingPost,
    markTagAsDeletedInCurrentlyEditingPost,
}) {
    type = mapEntitiesToTypes[type];

    const [tagName, setTagName] = useState(name);

    let d = new Date();

    return (
        <div className={"tag " + type} id={tagId}>
            <div className="tag-wrapper">
                {!editing && icons[type] && icons[type] !== "tag" && (
                    <div className="tag-icon">
                        <FontAwesome name={icons[type]} />
                    </div>
                )}
                {!icons[type] && (
                    <div className="tag-icon">
                        <Spinner height={"16px"} />
                    </div>
                )}
                {editing && icons[type] && (
                    <TagDropdown tagType={type} tagId={tagId} postId={postId} />
                )}
                {editing ? (
                    type === tagTypes.DATE ? (
                        <DatePicker
                            selected={Date.parse(tagName) || d}
                            // onSelect={this.handleSelect} //when day is clicked
                            onChange={e => {
                                setTagName(e);
                                console.log(e);
                                editTagInCurrentlyEditingPost(
                                    tagId,
                                    e.toDateString(),
                                    postId
                                );
                                // setDate(e);
                            }}
                        />
                    ) : (
                        <AutosizeInput
                            name="form-field-name"
                            className="tag-edit-input"
                            value={tagName}
                            onChange={function(event) {
                                // Change local state
                                setTagName(event.target.value);
                                // Change global state
                                editTagInCurrentlyEditingPost(
                                    tagId,
                                    event.target.value,
                                    postId
                                );
                            }}
                        />
                    )
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
                                    postId
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
