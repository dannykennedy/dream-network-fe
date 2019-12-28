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
    filterItems as _filterItems,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { mapEntitiesToTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";
import FontAwesome from "react-fontawesome";

function Searchbox({
    searchTags,
    addSearchTag,
    removeSearchTag,
    setSearchTagType,
    setSearchTagDescription,
    editSearchTagName,
    getTagType,
    filterItems,
}) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const tagId = uuidV4();
        addSearchTag(tagName, mapEntitiesToTypes.NONE, tagId);
        getTagType(tagName, tagId, "", setSearchTagType);
        filterItems([
            ...searchTags,
            {
                tagName: tagName,
                tagType: mapEntitiesToTypes.NONE,
                tagId: tagId,
            },
        ]);
    };

    return (
        <div id="search-area">
            <div id="search-bar-area">
                <FontAwesome name="search" id="search-icon" />
                <input
                    id="search-bar"
                    value={inputText}
                    placeholder="Search for articles, reviews, dreams..."
                    onKeyDown={e => {
                        if (isEnterKey(e.keyCode)) {
                            onAddTag(inputText);
                            setInputText("");
                        }
                    }}
                    onChange={e => {
                        if (
                            !(e.target.value === "," || e.target.value === "\n")
                        ) {
                            setInputText(e.target.value);
                        }
                    }}
                ></input>
            </div>
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
    filterItems: _filterItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
