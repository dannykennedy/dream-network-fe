import React, { useState, useEffect } from "react";
import SearchQueryArea from "./SearchQueryArea";
import "./Searchbox.css";
import { connect } from "react-redux";
import {
    addSearchTags as _addSearchTags,
    getTagType as _getTagType,
    filterItems as _filterItems,
    setSearchTagType as _setSearchTagType,
    getSearchTags as _getSearchTags,
    setSearchInProgress as _setSearchInProgress,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { mapEntitiesToTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";
import FontAwesome from "react-fontawesome";

function Searchbox({
    searchTags,
    addSearchTags,
    setSearchTagType,
    getTagType,
    filterItems,
    getSearchTags,
    setSearchInProgress,
}) {
    const [inputText, setInputText] = useState("");

    // Every time the search tags update, filter the content
    useEffect(() => {
        filterItems(searchTags);
    }, [searchTags, filterItems]);

    const onEnterSearchText = searchText => {
        // const tagId = uuidV4();
        // addSearchTags(searchText, mapEntitiesToTypes.NONE, tagId);
        getSearchTags(searchText);
        setSearchInProgress(true);
        // getTagType(searchText, tagId, "", setSearchTagType);
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
                            onEnterSearchText(inputText);
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
    addSearchTags: _addSearchTags,
    getTagType: _getTagType,
    filterItems: _filterItems,
    setSearchTagType: _setSearchTagType,
    getSearchTags: _getSearchTags,
    setSearchInProgress: _setSearchInProgress,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
