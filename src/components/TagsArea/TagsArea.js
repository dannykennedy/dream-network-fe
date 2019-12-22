import React, { useState } from "react";
import Tag from "../Tag";
import "./TagsArea.css";
import LoadingNotice from "../LoadingNotice";
import uuidV4 from "../../modules/uuid";
import { connect } from "react-redux";
import {
    addTagToItem as _addTagToItem,
    getTagType as _getTagType,
    markTagAsDeletedInCurrentlyEditingItem as _markTagAsDeletedInCurrentlyEditingItem,
    setTagType as _setTagType,
} from "../../ducks/items";
import { isEnterKey } from "../../modules/keyCodes";

// Inspired by https://www.npmjs.com/package/react-tag-input
// Look at this component in the future for autosuggestions

function TagsArea({
    tags,
    itemId,
    editingItem,
    getTagType,
    addTagToItem,
    markTagAsDeletedInCurrentlyEditingItem,
    setTagType,
}) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const id = uuidV4();
        const newTag = {
            tagId: id,
            tagName: tagName,
            tagType: "NONE",
            itemId: itemId,
            isNewTag: true,
        };
        getTagType(tagName, id, itemId);
        addTagToItem(newTag);
    };

    return (
        <div className="card-footer">
            {tags ? (
                <div className={"tags-area"}>
                    {Object.values(tags)
                        .filter(tag => !tag.isDeleted)
                        .map((tag, i) => {
                            return (
                                <Tag
                                    name={tag.tagName}
                                    type={tag.tagType}
                                    tagId={tag.tagId}
                                    tagDescription={tag.tagDescription}
                                    key={tag.tagId + i}
                                    itemId={itemId}
                                    editing={editingItem}
                                    onDelete={
                                        markTagAsDeletedInCurrentlyEditingItem
                                    }
                                    onSetTagType={setTagType}
                                />
                            );
                        })}
                    {editingItem && (
                        <input
                            placeholder={"Add a tag"}
                            className={"add-tag-input"}
                            value={inputText}
                            onKeyDown={e => {
                                if (isEnterKey(e.keyCode)) {
                                    onAddTag(inputText);
                                    setInputText("");
                                }
                            }}
                            onChange={e => {
                                if (
                                    !(
                                        e.target.value === "," ||
                                        e.target.value === "\n"
                                    )
                                ) {
                                    setInputText(e.target.value);
                                }
                            }}
                        />
                    )}
                </div>
            ) : (
                <LoadingNotice loadingText="Tagging in progress!" />
            )}
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        currentlyEditingItems: state.items.currentlyEditingItems,
    };
};

const mapDispatchToProps = {
    addTagToItem: _addTagToItem,
    getTagType: _getTagType,
    markTagAsDeletedInCurrentlyEditingItem: _markTagAsDeletedInCurrentlyEditingItem,
    setTagType: _setTagType,
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsArea);
