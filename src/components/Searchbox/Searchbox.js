import React, { useState } from "react";
import Tag from "../Tag";
import "./Searchbox.css";
import { connect } from "react-redux";
import {
    addSearchTag as _addSearchTag,
    removeSearchTag as _removeSearchTag,
    setSearchTagType as _setSearchTagType,
    setSearchTagDescription as _setSearchTagDescription,
    editSearchTagName as _editSearchTagName,
    getTagType as _getTagType,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { tagTypes, mapEntitiesToTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";

function Searchbox({
    searchTags,
    addSearchTag,
    removeSearchTag,
    setSearchTagType,
    setSearchTagDescription,
    editSearchTagName,
    getTagType,
}) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const tagId = uuidV4();
        addSearchTag(tagName, mapEntitiesToTypes.NONE, tagId);
        getTagType(tagName, tagId, "", setSearchTagType);
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
                            onEditTagName={editSearchTagName}
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
    editSearchTagName: _editSearchTagName,
    getTagType: _getTagType,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
