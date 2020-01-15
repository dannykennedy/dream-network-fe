import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import CardInfoHeader from "./CardInfoHeader";
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
    saveTagsFromCurrentItem as _saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem as _deleteTagsFromCurrentItem,
} from "../../ducks/items";
import { values } from "lodash";
import { Link } from "react-router-dom";
import { Base64 } from "../../modules/base64";
import LoadingNotice from "../../components/LoadingNotice";

let HtmlToReactParser = require("html-to-react").Parser;

function Card({
    post,
    itemIdBase64,
    user,
    deleteItem,
    editItem,
    saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem,
    userItems,
    showingCardAsMainContent,
}) {
    console.log("I'm in card", itemIdBase64);

    // If there's no data (e.g. when refreshing the page), fetch the post for this card.

    let entryText, firstName, lastName, itemId, timePosted, tags, describedTags;

    if (!post) {
        console.log("no post yet");
    } else {
        entryText = post.entryText;
        firstName = post.firstName;
        lastName = post.lastName;
        itemId = post.itemId;
        timePosted = post.timePosted;
        tags = post.tags;
        describedTags = post.describedTags;
    }

    const [editingItem, setEditingItem] = useState(false);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const node = useRef();

    let authorNames = [
        {
            tagName: `${firstName} ${lastName}`,
        },
    ];

    // Truncate text if needed
    var _htmlToReactParser = new HtmlToReactParser();
    const textToShow = showingCardAsMainContent
        ? entryText
        : truncate(entryText, 500, {
              keepImageTag: true,
              ellipsis: `...`,
          });

    // Test
    // var domthing = new DOMParser().parseFromString(textToShow, "text/html");
    // console.log("READMORE", domthing.getElementsByTagName("body")[0].innerHTML);
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

    console.log("post", post);

    return (
        <div>
            {!post ? (
                <LoadingNotice />
            ) : (
                <div id={itemId} className="item-card">
                    {showingCardAsMainContent && (
                        // If reading the full article, then this should be the canonical copy
                        // Each item should exist at only one place, there is no hierarchy.
                        // TODO: Unless a custom canonical URL is specified
                        <Helmet>
                            <link rel="canonical" href={window.location.href} />
                        </Helmet>
                    )}
                    <div className="inner-card">
                        <div className="card-header">
                            <CardInfoHeader
                                authors={authorNames}
                                timePosted={timePosted}
                            />
                            <div className="card-options dropdown">
                                {user && (
                                    <div ref={node} className="dropdown">
                                        <button
                                            className="dropbtn"
                                            onClick={() =>
                                                setDropdownIsOpen(
                                                    !dropdownIsOpen
                                                )
                                            }
                                        >
                                            <FontAwesome name="ellipsis-v" />
                                        </button>
                                        {dropdownIsOpen && (
                                            <div className="dropdown-content">
                                                <button
                                                    onClick={() => {
                                                        setDropdownIsOpen(
                                                            false
                                                        );
                                                        setEditingItem(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button>
                                                    <Link
                                                        to={
                                                            describedTags[
                                                                "Custom slug"
                                                            ]
                                                                ? `/${new Base64().encode(
                                                                      itemId
                                                                  )}/${
                                                                      describedTags[
                                                                          "Custom slug"
                                                                      ].tagName
                                                                  }`
                                                                : `/${itemId}`
                                                        }
                                                    >
                                                        See full article
                                                    </Link>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteItem(itemId)
                                                    }
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
                                            editItem(
                                                post.itemId,
                                                post.entryText
                                            );

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
            )}
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
    saveTagsFromCurrentItem: _saveTagsFromCurrentItem,
    deleteTagsFromCurrentItem: _deleteTagsFromCurrentItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);

// if (tags !== []) {
//     authorNames = Object.values(tags).filter(tag => {
//         return (
//             tag.tagDescription &&
//             tag.tagDescription.toLowerCase() === "author"
//         );
//     });
// }
// if (authorNames === []) {
//     authorNames = [
//         {
//             tagName: `${firstName} ${lastName}`,
//         },
//     ];
// }
// console.log("authornames", authorNames);
