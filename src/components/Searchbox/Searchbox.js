import React, { useState } from "react";
import Tag from "../Tag";
import "./Searchbox.css";
import { connect } from "react-redux";
import {
    addSearchTag as _addSearchTag,
    removeSearchTag as _removeSearchTag,
    setSearchTagType as _setSearchTagType,
    setSearchTagDescription as _setSearchTagDescription,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { tagTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";

function Searchbox({
    searchTags,
    addSearchTag,
    removeSearchTag,
    setSearchTagType,
    setSearchTagDescription,
}) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const tagId = uuidV4();
        addSearchTag(tagName, tagTypes.OTHER, tagId);
    };

    return (
        <div id="search-box-area">
            <input
                id="search-box"
                value={inputText}
                placeholder="Search for articles, reviews, dreams..."
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
                {searchTags.length > 0 && <span>Filtering by: </span>}
                {searchTags.map(tag => {
                    return (
                        <Tag
                            name={tag.tagName}
                            type={tag.tagType}
                            tagId={tag.tagId}
                            tagDescription={tag.tagDescription}
                            onSetTagDescription={setSearchTagDescription}
                            editing={true}
                            onDelete={removeSearchTag}
                            onSetTagType={setSearchTagType}
                            key={tag.tagId}
                        ></Tag>
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
    removeSearchTag: _removeSearchTag,
    setSearchTagType: _setSearchTagType,
    setSearchTagDescription: _setSearchTagDescription,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
