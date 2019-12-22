import React, { useState } from "react";
import Tag from "../Tag";
import "./Searchbox.css";
import { connect } from "react-redux";
import { addSearchTag as _addSearchTag } from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { tagTypes } from "../../constants/tagTypes";

function Searchbox({ searchTags, addSearchTag }) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        addSearchTag(tagName, "NONE");
    };

    return (
        <div id="search-box-area">
            <input
                id="search-box"
                value={inputText}
                placeholder="Search for something"
                onKeyDown={e => {
                    if (isEnterKey(e.keyCode)) {
                        onAddTag(inputText);
                        setInputText("");
                    }
                }}
                onChange={e => {
                    if (!(e.target.value === "," || e.target.value === "\n")) {
                        setInputText(e.target.value);
                    }
                }}
            ></input>
            <div id="search-tags-area">
                {searchTags.map(tag => {
                    return (
                        <span>
                            <Tag name={tag.tagName} type={tagTypes.OTHER}></Tag>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        searchTags: state.items.searchTags,
    };
};

const mapDispatchToProps = {
    addSearchTag: _addSearchTag,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
