import { values, omit, keyBy } from "lodash";

const baseUrl = process.env.REACT_APP_BASE_URL;

// INITIAL STATE
const initialState = {
    userItems: null,
    publicItems: null,
    currentlyEditingItems: {},
    loading: true,
    searchTags: [],
};

// TYPES OF ACTIONS THAT CAN BE DISPATCHED
const actionTypes = {
    DATA_REQUEST: "DATA_REQUEST",
    DATA_SUCCESS: "DATA_SUCCESS",
    LOGGEDOUT_DATA_SUCCESS: "LOGGEDOUT_DATA_SUCCESS",
    DATA_FAILURE: "DATA_FAILURE",
    ADD_ITEM: "ADD_ITEM",
    EDIT_ITEM: "EDIT_ITEM",
    DELETE_ITEM: "DELETE_ITEM",
    ERROR: "ERROR",
    REPLACE_ITEM_WITH_TAGGED_ITEM: "REPLACE_ITEM_WITH_TAGGED_ITEM",
    DELETE_TAG: "DELETE_TAG",
    SET_CURRENTLY_EDITING_ITEM: "SET_CURRENTLY_EDITING_ITEM",
    EDIT_TAG_IN_CURRENTLY_EDITING_ITEM: "EDIT_TAG_IN_CURRENTLY_EDITING_ITEM",
    SAVE_CURRENTLY_EDITING_ITEM: "SAVE_CURRENTLY_EDITING_ITEM",
    MARK_TAG_AS_DELETED_IN_ITEM: "MARK_TAG_AS_DELETED_IN_ITEM",
    ADD_TAG_TO_ITEM: "ADD_TAG_TO_ITEM",
    SET_TAG_TYPE: "SET_TAG_TYPE",
    SET_TAG_DESCRIPTION: "SET_TAG_DESCRIPTION",
    SAVE_TAGS_IN_UI: "SAVE_TAGS_IN_UI",
    ADD_SEARCH_TAG: "ADD_SEARCH_TAG",
    NO_OP: "NO_OP",
};

function itemsToObject(itemsArray) {
    var ret = {};

    for (var i = 0; i < itemsArray.length; ++i) {
        ret[itemsArray[i].itemId] = {
            ...itemsArray[i],
            tags: tagsToObject(itemsArray[i].tags),
        };
    }
    return ret;
}

function tagsToObject(tagsArray) {
    var ret = {};
    for (var i = 0; i < tagsArray.length; ++i) {
        ret[tagsArray[i].tagId] = tagsArray[i];
    }
    return ret;
}

// STATE MACHINE
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SEARCH_TAG:
            return {
                ...state,
                searchTags: [...state.searchTags, action.payload],
            };
        case actionTypes.SET_TAG_DESCRIPTION:
            const {
                tagDescription,
                tagId: tagID,
                itemId: postID,
            } = action.payload;
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [postID]: {
                        ...state.userItems[postID],
                        tags: {
                            ...state.userItems[postID].tags,
                            [tagID]: {
                                ...state.userItems[postID].tags[tagID],
                                tagDescription: tagDescription,
                            },
                        },
                    },
                },
            };
        case actionTypes.SET_TAG_TYPE:
            const { tagType, tagId, itemId } = action.payload;
            const tagTypeUpperCase = tagType.toUpperCase();
            console.log("gotta payload love you xx", action.payload);

            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [itemId]: {
                        ...state.userItems[itemId],
                        tags: {
                            ...state.userItems[itemId].tags,
                            [tagId]: {
                                ...state.userItems[itemId].tags[tagId],
                                tagType: tagTypeUpperCase,
                            },
                        },
                    },
                },
                currentlyEditingItems: {
                    ...state.currentlyEditingItems,
                    [itemId]: {
                        ...state.currentlyEditingItems[itemId],
                        tags: {
                            ...state.currentlyEditingItems[itemId].tags,
                            [tagId]: {
                                ...state.currentlyEditingItems[itemId].tags[
                                    tagId
                                ],
                                tagType: tagType,
                            },
                        },
                    },
                },
            };
        case actionTypes.DATA_REQUEST:
            console.log("request");
            return state;
        case actionTypes.DATA_SUCCESS:
            console.log("success");
            return {
                ...state,
                loading: false,
                userItems: itemsToObject(action.payload),
            };
        case actionTypes.LOGGEDOUT_DATA_SUCCESS:
            console.log("All data success");
            return {
                ...state,
                loading: false,
                publicItems: itemsToObject(action.payload),
            };
        // Add a post to the list of currently editing items
        case actionTypes.SET_CURRENTLY_EDITING_ITEM:
            console.log("Currently editing: ", action.payload);
            return {
                ...state,
                currentlyEditingItems: {
                    ...state.currentlyEditingItems,
                    [action.payload.itemId]: action.payload,
                },
            };
        // Update tag in state.currentlyEditingItem
        case actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_ITEM:
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: {
                        ...state.userItems[action.payload.itemId],
                        tags: {
                            ...state.userItems[action.payload.itemId].tags,
                            [action.payload.tagId]: {
                                ...state.userItems[action.payload.itemId].tags[
                                    action.payload.tagId
                                ],
                                tagName: action.payload.tagName,
                                edited: true,
                            },
                        },
                    },
                },

                currentlyEditingItems: {
                    ...state.currentlyEditingItems,
                    [action.payload.itemId]: {
                        ...state.currentlyEditingItems[action.payload.itemId],
                        tags: {
                            ...state.currentlyEditingItems[
                                action.payload.itemId
                            ].tags,
                            [action.payload.tagId]: {
                                ...state.currentlyEditingItems[
                                    action.payload.itemId
                                ].tags[action.payload.tagId],
                                tagName: action.payload.tagName,
                            },
                        },
                    },
                },
            };

        case actionTypes.ADD_TAG_TO_ITEM:
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: {
                        ...state.userItems[action.payload.itemId],
                        tags: {
                            ...state.userItems[action.payload.itemId].tags,
                            [action.payload.tagId]: action.payload,
                        },
                    },
                },
            };

        // Mark tag as deleted (don't worry about deleting yet)
        case actionTypes.MARK_TAG_AS_DELETED_IN_ITEM:
            // Delete from UI
            // Mark as 'deleted' in post
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: {
                        ...state.userItems[action.payload.itemId],
                        tags: {
                            ...state.userItems[action.payload.itemId].tags,
                            [action.payload.tagId]: {
                                ...state.userItems[action.payload.itemId].tags[
                                    action.payload.tagId
                                ],
                                isDeleted: true,
                            },
                        },
                    },
                },
            };
        case actionTypes.DATA_FAILURE:
            console.log("data failure");
            return state;
        case actionTypes.ADD_ITEM:
            console.log("adding a post", action.payload);
            return {
                ...state,
                userItems: {
                    [action.payload.itemId]: action.payload,
                    ...state.userItems,
                },
            };
        case actionTypes.DELETE_ITEM:
            console.log("Deleting post: ", action.payload);
            const {
                [action.payload]: val,
                ...withoutDeletedItem
            } = state.userItems;
            return {
                ...state,
                userItems: withoutDeletedItem,
            };
        // Optimistically update edited post in state
        case actionTypes.EDIT_ITEM:
            console.log("Editing post", action.payload);
            // Replace post with edited post in state
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: {
                        ...state.userItems[action.payload.itemId],
                        entryText: action.payload.postText,
                    },
                },
            };
        case actionTypes.REPLACE_ITEM_WITH_TAGGED_ITEM:
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: action.payload,
                },
            };

        case actionTypes.SAVE_TAGS_IN_UI:
            console.log("finna save some tags ", action.payload);
            return {
                ...state,
                userItems: {
                    ...state.userItems,
                    [action.payload.itemId]: {
                        ...state.userItems[action.payload.itemId],
                        tags: keyBy(
                            values(
                                state.userItems[action.payload.itemId].tags
                            ).map(tag => {
                                return { ...tag, isNewTag: false };
                            }),
                            "tagId"
                        ),
                    },
                },
            };

        case actionTypes.DELETE_TAG:
            if (!state.userItems) {
                console.log("Can't delete tag without a user");
                return state;
            }

            const tagsToEdit = state.userItems[action.payload.itemId].tags;
            const {
                [action.payload.tagId]: value,
                ...remainingTags
            } = tagsToEdit;

            console.log("remainingTags", remainingTags);

            return state;
        case actionTypes.ERROR:
            alert(action.payload);
            return state;
        case actionTypes.NO_OP:
            console.log("No-op");
            return state;
        default:
            return state;
    }
};

// INTERNAL FUNCTIONS
const addItemToState = payload => {
    return {
        type: actionTypes.ADD_ITEM,
        payload,
    };
};

const dataRequest = () => {
    return { type: actionTypes.DATA_REQUEST };
};

const dataSuccess = payload => {
    return {
        type: actionTypes.DATA_SUCCESS,
        payload,
    };
};

const loggedOutDataSuccess = payload => {
    return {
        type: actionTypes.LOGGEDOUT_DATA_SUCCESS,
        payload,
    };
};

const replaceItemWithTaggedItem = payload => {
    return {
        type: actionTypes.REPLACE_ITEM_WITH_TAGGED_ITEM,
        payload,
    };
};

const deleteItemFromUI = payload => {
    return {
        type: actionTypes.DELETE_ITEM,
        payload,
    };
};

const alertError = payload => {
    return {
        type: actionTypes.ERROR,
        payload,
    };
};

const noOp = () => {
    return {
        type: actionTypes.NO_OP,
    };
};

const deleteTagFromUI = (tagId, itemId) => {
    return {
        type: actionTypes.DELETE_TAG,
        payload: { tagId: tagId, itemId: itemId },
    };
};

const saveTagsInUI = post => {
    return {
        type: actionTypes.SAVE_TAGS_IN_UI,
        payload: { itemId: post.itemId },
    };
};

const replaceItemWithEditedItem = (itemId, newItemText) => {
    return {
        type: actionTypes.EDIT_ITEM,
        payload: { itemId: itemId, postText: newItemText },
    };
};

// EXPORTED FUNCTIONS

// A lot of these functions rely on redux-thunk
// Instead of returning an object, we're returning a function (dispatch) that returns an object

export const addSearchTag = (tagName, tagType) => {
    return {
        type: actionTypes.ADD_SEARCH_TAG,
        payload: { tagName: tagName, tagType: tagType },
    };
};

export const setTagType = (tagType, tagId, itemId) => {
    return {
        type: actionTypes.SET_TAG_TYPE,
        payload: { tagType: tagType, tagId: tagId, itemId: itemId },
    };
};

export const setTagDescription = (tagDescription, tagId, itemId) => {
    return {
        type: actionTypes.SET_TAG_DESCRIPTION,
        payload: {
            tagDescription: tagDescription,
            tagId: tagId,
            itemId: itemId,
        },
    };
};

export const setCurrentlyEditingItem = payload => {
    return {
        type: actionTypes.SET_CURRENTLY_EDITING_ITEM,
        payload,
    };
};

export const editTagInCurrentlyEditingItem = (tagId, tagName, itemId) => {
    return {
        type: actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_ITEM,
        payload: { tagId: tagId, tagName: tagName, itemId: itemId },
    };
};

export const markTagAsDeletedInCurrentlyEditingItem = (tagId, itemId) => {
    return {
        type: actionTypes.MARK_TAG_AS_DELETED_IN_ITEM,
        payload: { tagId: tagId, itemId: itemId },
    };
};

export const addTagToItem = tag => {
    return {
        type: actionTypes.ADD_TAG_TO_ITEM,
        payload: tag,
    };
};

// GET ITEMS ON INITIAL LOAD
export const fetchData = userEmail => {
    return dispatch => {
        dispatch(dataRequest());
        fetch(`${baseUrl}/items/${userEmail}`)
            .then(d => d.json())
            .then(json => {
                dispatch(dataSuccess(json));
            })
            .catch(err => {
                dispatch({ type: actionTypes.DATA_FAILURE, payload: err });
            });
    };
};

export const fetchAllData = () => {
    return dispatch => {
        dispatch(dataRequest());
        fetch(`${baseUrl}/items/`)
            .then(d => d.json())
            .then(json => {
                dispatch(loggedOutDataSuccess(json));
            })
            .catch(err => {
                dispatch({ type: actionTypes.DATA_FAILURE, payload: err });
            });
    };
};

// ADD AN ITEM
export const addItem = post => {
    return dispatch => {
        // Optimistically update UI
        dispatch(addItemToState(post));

        // Then add to database
        fetch(`${baseUrl}/items`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        })
            .then(data => data.json())
            .then(json => {
                console.log("got tags: ", json);

                post = {
                    ...post,
                    tags: json.map(responseRow => {
                        return {
                            tagName: responseRow.name,
                            tagType: responseRow.type,
                            tagId: responseRow.tagId,
                        };
                    }),
                };

                console.log("new Item: ", post);

                dispatch(replaceItemWithTaggedItem(post));
            })
            .catch(err => {
                console.log(err);
            });
    };
};

export const editItem = (itemId, newItem) => {
    return dispatch => {
        // Optimistically update UI
        dispatch(replaceItemWithEditedItem(itemId, newItem));

        let body = {
            postText: newItem,
            itemId: itemId,
        };

        fetch(`${baseUrl}/items/${itemId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            // .then(data => data.json())
            .then(json => {
                // console.log("got a response: ", json);
                // TODO: retag the post? Using a diff?
            })
            .catch(err => {
                console.log(err);
            });
    };
};

export const saveTagsFromCurrentItem = currentItem => {
    let tagsArray = values(currentItem.tags);
    console.log("tags in FE: ", tagsArray);
    console.log("yeeehaw");

    return dispatch => {
        // Remove 'isNewTag' from tags
        dispatch(saveTagsInUI(currentItem));

        // Update changed tags in DB
        fetch(`${baseUrl}/tags/`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tagsArray),
        })
            .then(data => data.json())
            .catch(err => {
                console.log(err);
            });

        // Add new tags to DB
        fetch(`${baseUrl}/tags/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tagsArray),
        })
            .then(data => data.json())
            .catch(err => {
                console.log(err);
            });
    };
};

// Delete all tags marked as 'deleted' from current post
export const deleteTagsFromCurrentItem = tags => {
    console.log("deleting tags in fe...", tags);
    if (!tags.length) {
        return dispatch => {
            dispatch(noOp());
        };
    }

    return dispatch => {
        // dispatch(dataRequest());
        fetch(`${baseUrl}/tags/`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tags),
        })
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    dispatch(
                        alertError("Tag could not be deleted at this time")
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

// DELETE AN ITEM
export const deleteItem = itemId => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deleteItemFromUI(itemId));

        // Then delete from database
        fetch(`${baseUrl}/items/${itemId}`, {
            method: "DELETE",
        })
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    dispatch(
                        alertError("Item could not be deleted at this time")
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

// DELETE A TAG
export const deleteTag = (tagId, itemId) => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deleteTagFromUI(tagId, itemId));

        // Then delete from database
        fetch(`${baseUrl}/tags/${tagId}`, {
            method: "DELETE",
        })
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    dispatch(
                        alertError("Tag could not be deleted at this time")
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

export const getTagType = (tagName, tagId, itemId) => {
    return dispatch => {
        // Then delete from database
        fetch(`${baseUrl}/tags/${tagName}/type`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(json => {
                console.log("got type: ", json.type);
                // Type may be undefined, in which case set "other"
                dispatch(setTagType(json.type || "OTHER", tagId, itemId));
            })
            .catch(err => {
                console.log(err);
                dispatch(alertError("wat no type"));
            });
    };
};
