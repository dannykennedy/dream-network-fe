import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import AutosizeInput from "react-input-autosize";
import Spinner from "../Spinner";
import TagDescriptionDropdown from "./TagDescriptionDropdown";
import TagDropdown from "./TagDropdown";
import { connect } from "react-redux";
import {
    editTagInCurrentlyEditingItem as _editTagInCurrentlyEditingItem,
    markTagAsDeletedInCurrentlyEditingItem as _markTagAsDeletedInCurrentlyEditingItem,
} from "../../ducks/items";
import "./Tag.css";
import { icons } from "../../theme/icons";
import { tagTypes, mapEntitiesToTypes } from "./tagTypes";
import { TagDescriptions } from "./TagDescriptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { findDatesInText } from "../../modules/recogniseDate";
// let parse_date = require("parse-dates");

export function Tag({
    name,
    type,
    tagId,
    itemId,
    user,
    tagDescription,
    editing,
    onDelete,
    editTagInCurrentlyEditingItem,
    onSetTagType,
    onSetTagDescription,
}) {
    type = mapEntitiesToTypes[type];

    const [tagName, setTagName] = useState(name);

    let d = new Date();

    //console.log("parsing dates: ", findDatesInText("I want to go on Friday"));

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
                    <TagDropdown
                        tagType={type}
                        tagId={tagId}
                        itemId={itemId}
                        onSetTagType={onSetTagType}
                    />
                )}
                {editing && TagDescriptions[type] && (
                    <TagDescriptionDropdown
                        tagType={type}
                        tagId={tagId}
                        itemId={itemId}
                        tagDescription={tagDescription}
                        onSetTagDescription={onSetTagDescription}
                    />
                )}
                {editing ? (
                    type === tagTypes.DATE ? (
                        <DatePicker
                            selected={Date.parse(tagName) || d}
                            // onSelect={this.handleSelect} //when day is clicked
                            onChange={e => {
                                setTagName(e);
                                console.log(e);
                                editTagInCurrentlyEditingItem(
                                    tagId,
                                    e.toDateString(),
                                    itemId
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
                                editTagInCurrentlyEditingItem(
                                    tagId,
                                    event.target.value,
                                    itemId
                                );
                            }}
                        />
                    )
                ) : (
                    <div className="tag-name">
                        <span>
                            {tagDescription && <span>{tagDescription} - </span>}
                            {name}
                        </span>
                    </div>
                )}
                {user && editing && (
                    <div className="tag-options">
                        <div
                            className="tag-remove-icon tag-icon"
                            onClick={function() {
                                onDelete(tagId, itemId);
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
    markTagAsDeletedInCurrentlyEditingItem: _markTagAsDeletedInCurrentlyEditingItem,
    editTagInCurrentlyEditingItem: _editTagInCurrentlyEditingItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
