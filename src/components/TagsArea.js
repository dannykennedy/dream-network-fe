import React, { useState, useEffect } from "react";
import Tag from "./Tag";
import "./css/TagsArea.css";
import LoadingNotice from "./LoadingNotice";
import uuidV4 from "../modules/uuid";
import { connect } from "react-redux";
import {
    addTagToCurrentlyEditingPost as _addTagToCurrentlyEditingPost,
    getTagType as _getTagType,
    setTagType as _setTagType,
} from "../ducks/posts";

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const isEnterKey = keyCode => {
    return keyCode === KeyCodes.enter || keyCode === KeyCodes.comma;
};

function TagsArea({
    tags,
    noteId,
    editingPost,
    addTagToCurrentlyEditingPost,
    currentlyEditingPosts,
    getTagType,
}) {
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        console.log("setting tags");
        // setCardTags(tags);
    }, [tags]);

    const onAddTag = tagName => {
        const id = uuidV4();
        const newTag = {
            tagId: id,
            tagName: tagName,
            tagType: "NONE",
            noteId: noteId,
            isNewTag: true,
        };
        getTagType(tagName, id, noteId);
        // setCardTags([...cardTags, newTag]);
        addTagToCurrentlyEditingPost(newTag);
    };

    return (
        <div className="card-footer">
            {tags ? (
                <div className={"tags-area"}>
                    {Object.values(tags).map(tag => {
                        return (
                            <Tag
                                name={tag.tagName}
                                type={tag.tagType}
                                tagId={tag.tagId}
                                key={tag.tagId}
                                noteId={noteId}
                                editing={editingPost}
                            />
                        );
                    })}
                    {editingPost && (
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
        currentlyEditingPosts: state.posts.currentlyEditingPosts,
    };
};

const mapDispatchToProps = {
    addTagToCurrentlyEditingPost: _addTagToCurrentlyEditingPost,
    getTagType: _getTagType,
    setTagType: _setTagType,
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsArea);
