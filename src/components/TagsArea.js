import React, { useState, useEffect } from "react";
import Tag from "./Tag";
import "./css/TagsArea.css";
import LoadingNotice from "./LoadingNotice";
import uuidV4 from "../modules/uuid";
import { connect } from "react-redux";
import { addTagToCurrentlyEditingPost as _addTagToCurrentlyEditingPost } from "../ducks/posts";

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
}) {
    const [inputText, setInputText] = useState("");
    const [cardTags, setCardTags] = useState(tags);

    useEffect(() => {
        setCardTags(tags);
    }, [tags]);

    const onAddTag = tagName => {
        const id = uuidV4();
        const newTag = {
            tagId: id,
            tagName: tagName,
            tagType: "OTHER",
            noteId: noteId,
            isNewTag: true,
        };
        setCardTags([...cardTags, newTag]);
        addTagToCurrentlyEditingPost(newTag);
    };

    const onDeleteTag = tagId => {
        setCardTags(
            cardTags.filter(tag => {
                console.log("Name: ", tag.tagName);

                if (tag.tagId === tagId) {
                    console.log("tag.tagid", tag.tagId);
                    console.log("to be deleted", tagId);
                }

                return tag.tagId !== tagId;
            })
        );
    };

    return (
        <div className="card-footer">
            {cardTags ? (
                <div className={"tags-area"}>
                    {cardTags.map(tag => {
                        return (
                            <Tag
                                name={tag.tagName}
                                type={tag.tagType}
                                tagId={tag.tagId}
                                key={tag.tagId}
                                noteId={noteId}
                                editing={editingPost}
                                onDelete={() => {
                                    onDeleteTag(tag.tagId);
                                }}
                            />
                        );
                    })}
                    {editingPost && (
                        <input
                            placeholder={"Add a tag"}
                            className={"add-tag-input"}
                            style={{ boxSizing: "border-box" }}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsArea);
