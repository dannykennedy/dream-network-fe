import React, { useState } from "react";
import Tag from "../Tag";
import "./TagsArea.css";
import LoadingNotice from "../LoadingNotice";
import uuidV4 from "../../modules/uuid";
import { connect } from "react-redux";
import {
    addTagToPost as _addTagToPost,
    getTagType as _getTagType,
} from "../../ducks/posts";

// Inspired by https://www.npmjs.com/package/react-tag-input
// Look at this component in the future for autosuggestions
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const isEnterKey = keyCode => {
    return keyCode === KeyCodes.enter || keyCode === KeyCodes.comma;
};

function TagsArea({ tags, postId, editingPost, getTagType, addTagToPost }) {
    const [inputText, setInputText] = useState("");

    const onAddTag = tagName => {
        const id = uuidV4();
        const newTag = {
            tagId: id,
            tagName: tagName,
            tagType: "NONE",
            postId: postId,
            isNewTag: true,
        };
        getTagType(tagName, id, postId);
        addTagToPost(newTag);
    };

    return (
        <div className="card-footer">
            {tags ? (
                <div className={"tags-area"}>
                    {Object.values(tags)
                        .filter(tag => !tag.isDeleted)
                        .map(tag => {
                            return (
                                <Tag
                                    name={tag.tagName}
                                    type={tag.tagType}
                                    tagId={tag.tagId}
                                    tagDescription={tag.tagDescription}
                                    key={tag.tagId}
                                    postId={postId}
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
    addTagToPost: _addTagToPost,
    getTagType: _getTagType,
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsArea);
