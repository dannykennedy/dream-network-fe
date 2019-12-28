import React, { useState, useEffect } from "react";
import Tag from "../Tag";
import SearchQueryArea from "./SearchQueryArea";
import "./Searchbox.css";
import { connect } from "react-redux";
import {
    addSearchTag as _addSearchTag,
    getTagType as _getTagType,
    filterItems as _filterItems,
    setSearchTagType as _setSearchTagType,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { mapEntitiesToTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";
import FontAwesome from "react-fontawesome";

function Searchbox({
    searchTags,
    addSearchTag,
    setSearchTagType,
    getTagType,
    filterItems,
}) {
    const [inputText, setInputText] = useState("");

    // Every time the search tags update, filter the content
    useEffect(() => {
        filterItems(searchTags);
    }, [searchTags, filterItems]);

    const onAddTag = tagName => {
        const tagId = uuidV4();
        addSearchTag(tagName, mapEntitiesToTypes.NONE, tagId);
        getTagType(tagName, tagId, "", setSearchTagType);
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
            <SearchQueryArea />
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
    getTagType: _getTagType,
    filterItems: _filterItems,
    setSearchTagType: _setSearchTagType,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
