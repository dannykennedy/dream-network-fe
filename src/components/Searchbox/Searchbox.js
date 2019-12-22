import React, { useState } from "react";
import Tag from "../Tag";
import "./Searchbox.css";
import { connect } from "react-redux";
import {
    addSearchTag as _addSearchTag,
    removeSearchTag as _removeSearchTag,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";
import { tagTypes } from "../../constants/tagTypes";
import uuidV4 from "../../modules/uuid";

function Searchbox({ searchTags, addSearchTag, removeSearchTag }) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const tagId = uuidV4();
        addSearchTag(tagName, "NONE", tagId);
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
                {searchTags.map((tag, i) => {
                    return (
                        <span>
                            <Tag
                                name={tag.tagName}
                                type={tagTypes.OTHER}
                                tagId={tagTypes.tagId}
                                editing={true}
                                onDelete={removeSearchTag}
                                key={tag.tagName + i}
                            ></Tag>
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
    removeSearchTag: _removeSearchTag,
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
