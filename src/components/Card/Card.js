import React, { useState, useRef, useEffect } from "react";
import CardUserInfo from "./CardUserInfo";
import TagsArea from "../TagsArea/TagsArea";
import { connect } from "react-redux";
import ItemEditor from "../ItemEditor/ItemEditor";
import FontAwesome from "react-fontawesome";
import truncate from "html-truncate"; //https://www.npmjs.com/package/html-truncate
import "./Card.css";
import "./Dropdown.css";
import {
    deleteItem as _deleteItem,
    editItem as _editItem,
    setCurrentlyEditingItem as _setCurrentlyEditingItem,
    saveTagsFromCurrentItem as _saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem as _deleteTagsFromCurrentItem,
} from "../../ducks/items";
import { chain, values } from "lodash";
import { Link } from "react-router-dom";
let HtmlToReactParser = require("html-to-react").Parser;

function Card({
    post,
    user,
    deleteItem,
    editItem,
    setCurrentlyEditingItem,
    saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem,
    userItems,
    showingFullText,
}) {
    const { entryText, firstName, lastName, itemId, timePosted, tags } = post;
    const [editingItem, setEditingItem] = useState(false);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const node = useRef();

    // Truncate text if needed
    var _htmlToReactParser = new HtmlToReactParser();
    const textToShow = showingFullText
        ? entryText
        : truncate(entryText, 700, {
              keepImageTag: true,
              ellipsis: `...<a href='dream-network/${itemId}'>Read more</a>`,
          });

    const handleClick = e => {
        if (node.current && node.current.contains(e.target)) {
            return; // inside click
        }
        setDropdownIsOpen(false); // outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div id={itemId} className="item-card">
            <div className="inner-card">
                <div className="card-header">
                    <CardUserInfo
                        firstName={firstName}
                        lastName={lastName}
                        timePosted={timePosted}
                    />
                    <div className="card-options dropdown">
                        {user && (
                            <div ref={node} className="dropdown">
                                <button
                                    className="dropbtn"
                                    onClick={() =>
                                        setDropdownIsOpen(!dropdownIsOpen)
                                    }
                                >
                                    <FontAwesome name="ellipsis-v" />
                                </button>
                                {dropdownIsOpen && (
                                    <div className="dropdown-content">
                                        <button
                                            onClick={() => {
                                                setDropdownIsOpen(false);
                                                setEditingItem(true);
                                                const currentlyEditingItem = {
                                                    itemId: itemId,
                                                    entryText: entryText.slice(
                                                        0
                                                    ),
                                                    tags: chain(tags)
                                                        .keyBy("tagId")
                                                        .value(),
                                                    deletedTags: [],
                                                };
                                                setCurrentlyEditingItem(
                                                    currentlyEditingItem
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button>
                                            <Link
                                                to={`/dream-network/${itemId}`}
                                            >
                                                See full article
                                            </Link>
                                        </button>

                                        <button
                                            onClick={() => deleteItem(itemId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="card-body-text">
                        {editingItem ? (
                            <ItemEditor
                                itemId={itemId}
                                content={entryText}
                                saveButtonText={"Save Changes"}
                                onSave={post => {
                                    setEditingItem(false);
                                    editItem(post.itemId, post.entryText);

                                    saveTagsFromCurrentItem(
                                        userItems[post.itemId]
                                    );
                                    deleteTagsFromCurrentItem(
                                        values(
                                            userItems[post.itemId].tags
                                        ).filter(tag => tag.isDeleted)
                                    );
                                }}
                            />
                        ) : (
                            _htmlToReactParser.parse(textToShow)
                        )}
                    </div>
                    <div className="card-edit-area">
                        <textarea className="card-edit-textarea"></textarea>
                        <button className="button-standard card-button-savetext">
                            Save
                        </button>
                    </div>
                </div>
                <TagsArea
                    tags={tags}
                    itemId={itemId}
                    editingItem={editingItem}
                />
            </div>
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        user: state.user.user,
        userItems: state.items.userItems,
    };
};

const mapDispatchToProps = {
    deleteItem: _deleteItem,
    editItem: _editItem,
    setCurrentlyEditingItem: _setCurrentlyEditingItem,
    saveTagsFromCurrentItem: _saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem: _deleteTagsFromCurrentItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
