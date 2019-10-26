import React from "react";
import Tag from "./Tag";
import { parseTimestamp } from "../modules/parseDate";
import LoadingNotice from "./LoadingNotice";
import Dropdown from "./Dropdown";
import "./css/Card.css";

function openDropdown() {
    console.log("opening the dropdown");
}

function Card({ entryText, firstName, lastName, noteId, timePosted, tags }) {
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
                        <Dropdown
                            onChange={() => {
                                console.log("changed");
                            }}
                            noteId={noteId}
                        />
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-body-text">{entryText}</p>
                    <div className="card-edit-area">
                        <textarea className="card-edit-textarea"></textarea>
                        <button className="button-standard card-button-savetext">
                            Save
                        </button>
                    </div>
                </div>
                <div className="card-footer">
                    {tags ? (
                        tags.map((tag, key) => {
                            return (
                                <Tag
                                    name={tag.tagName}
                                    type={tag.tagType}
                                    tagId={tag.tagId}
                                    key={key}
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

export default Card;
