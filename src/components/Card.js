import React from "react";
import Tag from "./Tag";
import { parseTimestamp } from "../modules/parseDate";
import LoadingNotice from "./LoadingNotice";
import { connect } from "react-redux";
import Dropdown from "./Dropdown";
import "./css/Card.css";
var HtmlToReactParser = require("html-to-react").Parser;

function Card({
    user,
    entryText,
    firstName,
    lastName,
    noteId,
    timePosted,
    tags,
}) {
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
                            <Dropdown
                                onChange={() => {
                                    console.log("changed");
                                }}
                                noteId={noteId}
                            />
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="card-body-text">
                        {_htmlToReactParser.parse(entryText)}
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

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Card);
