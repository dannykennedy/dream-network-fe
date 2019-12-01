import { values, omit } from "lodash";

const baseUrl = process.env.REACT_APP_BASE_URL;

// INITIAL STATE
const initialState = {
    userPosts: null,
    publicPosts: null,
    currentlyEditingPosts: {},
    loading: true,
};

// TYPES OF ACTIONS THAT CAN BE DISPATCHED
const actionTypes = {
    DATA_REQUEST: "DATA_REQUEST",
    DATA_SUCCESS: "DATA_SUCCESS",
    LOGGEDOUT_DATA_SUCCESS: "LOGGEDOUT_DATA_SUCCESS",
    DATA_FAILURE: "DATA_FAILURE",
    ADD_POST: "ADD_POST",
    EDIT_POST: "EDIT_POST",
    DELETE_POST: "DELETE_POST",
    ERROR: "ERROR",
    REPLACE_POST_WITH_TAGGED_POST: "REPLACE_POST_WITH_TAGGED_POST",
    DELETE_TAG: "DELETE_TAG",
    SET_CURRENTLY_EDITING_POST: "SET_CURRENTLY_EDITING_POST",
    EDIT_TAG_IN_CURRENTLY_EDITING_POST: "EDIT_TAG_IN_CURRENTLY_EDITING_POST",
    SAVE_CURRENTLY_EDITING_POST: "SAVE_CURRENTLY_EDITING_POST",
    MARK_TAG_AS_DELETED_IN_POST: "MARK_TAG_AS_DELETED_IN_POST",
    // ADD_TAG_TO_CURRENTLY_EDITING_POST: "ADD_TAG_TO_CURRENTLY_EDITING_POST",
    ADD_TAG_TO_POST: "ADD_TAG_TO_POST",
    SET_TAG_TYPE: "SET_TAG_TYPE",
    NO_OP: "NO_OP",
};

function postsToObject(postsArray) {
    var ret = {};

    for (var i = 0; i < postsArray.length; ++i) {
        ret[postsArray[i].postId] = {
            ...postsArray[i],
            tags: tagsToObject(postsArray[i].tags),
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
        case actionTypes.SET_TAG_TYPE:
            const { tagType, tagId, postId } = action.payload;
            const tagTypeUpperCase = tagType.toUpperCase();
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [postId]: {
                        ...state.userPosts[postId],
                        tags: {
                            ...state.userPosts[postId].tags,
                            [tagId]: {
                                ...state.userPosts[postId].tags[tagId],
                                tagType: tagTypeUpperCase,
                            },
                        },
                    },
                },
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [postId]: {
                        ...state.currentlyEditingPosts[postId],
                        tags: {
                            ...state.currentlyEditingPosts[postId].tags,
                            [tagId]: {
                                ...state.currentlyEditingPosts[postId].tags[
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
                userPosts: postsToObject(action.payload),
            };
        case actionTypes.LOGGEDOUT_DATA_SUCCESS:
            console.log("All data success");
            return {
                ...state,
                loading: false,
                publicPosts: postsToObject(action.payload),
            };
        // Add a post to the list of currently editing posts
        case actionTypes.SET_CURRENTLY_EDITING_POST:
            console.log("Currently editing: ", action.payload);
            return {
                ...state,
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.postId]: action.payload,
                },
            };
        // Update tag in state.currentlyEditingPost
        case actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_POST:
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [action.payload.postId]: {
                        ...state.userPosts[action.payload.postId],
                        tags: {
                            ...state.userPosts[action.payload.postId].tags,
                            [action.payload.tagId]: {
                                ...state.userPosts[action.payload.postId].tags[
                                    action.payload.tagId
                                ],
                                tagName: action.payload.tagName,
                                edited: true,
                            },
                        },
                    },
                },

                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.postId]: {
                        ...state.currentlyEditingPosts[action.payload.postId],
                        tags: {
                            ...state.currentlyEditingPosts[
                                action.payload.postId
                            ].tags,
                            [action.payload.tagId]: {
                                ...state.currentlyEditingPosts[
                                    action.payload.postId
                                ].tags[action.payload.tagId],
                                tagName: action.payload.tagName,
                            },
                        },
                    },
                },
            };

        case actionTypes.ADD_TAG_TO_POST:
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [action.payload.postId]: {
                        ...state.userPosts[action.payload.postId],
                        tags: {
                            ...state.userPosts[action.payload.postId].tags,
                            [action.payload.tagId]: action.payload,
                        },
                    },
                },
            };

        // Mark tag as deleted (don't worry about deleting yet)
        case actionTypes.MARK_TAG_AS_DELETED_IN_POST:
            // Delete from UI
            // Mark as 'deleted' in post
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [action.payload.postId]: {
                        ...state.userPosts[action.payload.postId],
                        tags: {
                            ...state.userPosts[action.payload.postId].tags,
                            [action.payload.tagId]: {
                                ...state.userPosts[action.payload.postId].tags[
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
        case actionTypes.ADD_POST:
            console.log("adding a post", action.payload);
            return {
                ...state,
                userPosts: {
                    [action.payload.postId]: action.payload,
                    ...state.userPosts,
                },
            };
        case actionTypes.DELETE_POST:
            console.log("Deleting post: ", action.payload);
            const {
                [action.payload]: val,
                ...withoutDeletedPost
            } = state.userPosts;
            return {
                ...state,
                userPosts: withoutDeletedPost,
            };
        // Optimistically update edited post in state
        case actionTypes.EDIT_POST:
            console.log("Editing post", action.payload);
            // Replace post with edited post in state
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [action.payload.postId]: {
                        ...state.userPosts[action.payload.postId],
                        entryText: action.payload.postText,
                    },
                },
            };
        case actionTypes.REPLACE_POST_WITH_TAGGED_POST:
            return {
                ...state,
                userPosts: {
                    ...state.userPosts,
                    [action.payload.postId]: action.payload,
                },
            };
        case actionTypes.DELETE_TAG:
            if (!state.userPosts) {
                console.log("Can't delete tag without a user");
                return state;
            }

            const tagsToEdit = state.userPosts[action.payload.postId].tags;
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

const addPostToState = payload => {
    return {
        type: actionTypes.ADD_POST,
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

const replacePostWithTaggedPost = payload => {
    return {
        type: actionTypes.REPLACE_POST_WITH_TAGGED_POST,
        payload,
    };
};

const deletePostFromUI = payload => {
    return {
        type: actionTypes.DELETE_POST,
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

const deleteTagFromUI = (tagId, postId) => {
    return {
        type: actionTypes.DELETE_TAG,
        payload: { tagId: tagId, postId: postId },
    };
};

const replacePostWithEditedPost = (postId, newPostText) => {
    return {
        type: actionTypes.EDIT_POST,
        payload: { postId: postId, postText: newPostText },
    };
};

// EXPORTED FUNCTIONS

// A lot of these functions rely on redux-thunk
// Instead of returning an object, we're returning a function (dispatch) that returns an object

export const setTagType = (tagType, tagId, postId) => {
    return {
        type: actionTypes.SET_TAG_TYPE,
        payload: { tagType: tagType, tagId: tagId, postId: postId },
    };
};

export const setCurrentlyEditingPost = payload => {
    return {
        type: actionTypes.SET_CURRENTLY_EDITING_POST,
        payload,
    };
};

export const editTagInCurrentlyEditingPost = (tagId, tagName, postId) => {
    return {
        type: actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_POST,
        payload: { tagId: tagId, tagName: tagName, postId: postId },
    };
};

export const markTagAsDeletedInCurrentlyEditingPost = (tagId, postId) => {
    return {
        type: actionTypes.MARK_TAG_AS_DELETED_IN_POST,
        payload: { tagId: tagId, postId: postId },
    };
};

// export const addTagToCurrentlyEditingPost = tag => {
//     return {
//         type: actionTypes.ADD_TAG_TO_CURRENTLY_EDITING_POST,
//         payload: tag,
//     };
// };

export const addTagToPost = tag => {
    return {
        type: actionTypes.ADD_TAG_TO_POST,
        payload: tag,
    };
};

// GET POSTS ON INITIAL LOAD
export const fetchData = userEmail => {
    return dispatch => {
        dispatch(dataRequest());
        fetch(`${baseUrl}/posts/${userEmail}`)
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
        fetch(`${baseUrl}/posts/`)
            .then(d => d.json())
            .then(json => {
                dispatch(loggedOutDataSuccess(json));
            })
            .catch(err => {
                dispatch({ type: actionTypes.DATA_FAILURE, payload: err });
            });
    };
};

// ADD A POST
export const addPost = post => {
    return dispatch => {
        // Optimistically update UI
        dispatch(addPostToState(post));

        // Then add to database
        fetch(`${baseUrl}/posts`, {
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

                console.log("new Post: ", post);

                dispatch(replacePostWithTaggedPost(post));
            })
            .catch(err => {
                console.log(err);
            });
    };
};

export const editPost = (postId, newPost) => {
    return dispatch => {
        // Optimistically update UI
        dispatch(replacePostWithEditedPost(postId, newPost));

        let body = {
            postText: newPost,
            postId: postId,
        };

        fetch(`${baseUrl}/posts/${postId}`, {
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

export const saveTagsFromCurrentPost = currentPost => {
    let tagsArray = values(currentPost.tags);
    console.log("tags in FE: ", tagsArray);
    console.log("yeeehaw");

    return dispatch => {
        // Optimistically update UI
        dispatch(noOp());

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
export const deleteTagsFromCurrentPost = tags => {
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

// DELETE A POST
export const deletePost = postId => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deletePostFromUI(postId));

        // Then delete from database
        fetch(`${baseUrl}/posts/${postId}`, {
            method: "DELETE",
        })
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    dispatch(
                        alertError("Post could not be deleted at this time")
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

// DELETE A TAG
export const deleteTag = (tagId, postId) => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deleteTagFromUI(tagId, postId));

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

export const getTagType = (tagName, tagId, postId) => {
    return dispatch => {
        // Optimistically update UI
        // dispatch(deleteTagFromUI(tagId, postId));

        // Then delete from database
        fetch(`${baseUrl}/tags/${tagName}/type`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(json => {
                console.log("got type: ", json.type);
                // Type may be undefined, in which case set "other"
                dispatch(setTagType(json.type || "OTHER", tagId, postId));
            })
            .catch(err => {
                console.log(err);
                dispatch(alertError("wat no type"));
            });
    };
};
