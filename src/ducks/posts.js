import { dispatch } from "rxjs/internal/observable/pairs";
import { values, omit, keyBy, chain, value } from "lodash";

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
    SAVE_TAGS_FROM_CURRENTLY_EDITING_POST:
        "SAVE_TAGS_FROM_CURRENTLY_EDITING_POST",
    MARK_TAG_AS_DELETED_IN_CURRENTLY_EDITING_POST:
        "MARK_TAG_AS_DELETED_IN_CURRENTLY_EDITING_POST",
    DELETE_TAGS_FROM_CURRENTLY_EDITING_POST:
        "DELETE_TAGS_FROM_CURRENTLY_EDITING_POST",
    ADD_TAG_TO_CURRENTLY_EDITING_POST: "ADD_TAG_TO_CURRENTLY_EDITING_POST",
};

function notesToObject(notesArray) {
    var ret = {};

    for (var i = 0; i < notesArray.length; ++i) {
        ret[notesArray[i].noteId] = {
            ...notesArray[i],
            tags: tagsToObject(notesArray[i].tags),
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
        case actionTypes.DATA_REQUEST:
            console.log("request");
            return state;
        case actionTypes.DATA_SUCCESS:
            console.log("success");

            let copy = action.payload.map(post => post);

            console.log("hi", notesToObject(action.payload));

            return {
                ...state,
                loading: false,
                userPosts: action.payload,
            };
        case actionTypes.LOGGEDOUT_DATA_SUCCESS:
            console.log("All data success");
            return {
                ...state,
                loading: false,
                publicPosts: action.payload,
            };
        // Add a post to the list of currently editing posts
        case actionTypes.SET_CURRENTLY_EDITING_POST:
            console.log("Currently editing: ", action.payload);
            return {
                ...state,
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.noteId]: action.payload,
                },
            };
        // Update tag in state.currentlyEditingPost
        case actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_POST:
            return {
                ...state,
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.noteId]: {
                        ...state.currentlyEditingPosts[action.payload.noteId],
                        tags: {
                            ...state.currentlyEditingPosts[
                                action.payload.noteId
                            ].tags,
                            [action.payload.tagId]: {
                                ...state.currentlyEditingPosts[
                                    action.payload.noteId
                                ].tags[action.payload.tagId],
                                tagName: action.payload.tagName,
                            },
                        },
                    },
                },
            };
        case actionTypes.ADD_TAG_TO_CURRENTLY_EDITING_POST:
            console.log("adding this tag", action.payload);

            return {
                ...state,
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.noteId]: {
                        ...state.currentlyEditingPosts[action.payload.noteId],
                        tags: {
                            ...state.currentlyEditingPosts[
                                action.payload.noteId
                            ].tags,
                            [action.payload.tagId]: action.payload,
                        },
                    },
                },
            };
        // Mark tag as deleted (don't worry about deleting yet)
        case actionTypes.MARK_TAG_AS_DELETED_IN_CURRENTLY_EDITING_POST:
            console.log(
                "tags all",
                state.currentlyEditingPosts[action.payload.noteId].tags
            );
            console.log(
                "delete list",
                state.currentlyEditingPosts[action.payload.noteId].deletedTags
            );

            return {
                ...state,
                // Delete from UI
                userPosts: state.userPosts.map(post => {
                    if (post.noteId === action.payload.noteId) {
                        return {
                            ...post,
                            tags: post.tags.filter(
                                tag => tag.tagId !== action.payload.tagId
                            ),
                        };
                    } else {
                        return post;
                    }
                }),

                // Mark as 'to be deleted' from DB
                currentlyEditingPosts: {
                    ...state.currentlyEditingPosts,
                    [action.payload.noteId]: {
                        ...state.currentlyEditingPosts[action.payload.noteId],
                        tags: omit(
                            state.currentlyEditingPosts[action.payload.noteId]
                                .tags,
                            action.payload.tagId
                        ),
                        deletedTags: [
                            ...state.currentlyEditingPosts[
                                action.payload.noteId
                            ].deletedTags,
                            action.payload,
                        ],
                    },
                },
            };
        case actionTypes.DELETE_TAGS_FROM_CURRENTLY_EDITING_POST:
            return state;

        // Save all tags from state.currentlyEditingPost to current UI
        case actionTypes.SAVE_TAGS_FROM_CURRENTLY_EDITING_POST:
            return {
                ...state,
                userPosts: state.userPosts.map(post => {
                    if (post.noteId === action.payload.noteId) {
                        return {
                            ...post,
                            tags: values(action.payload.tags),
                        };
                    } else {
                        return post;
                    }
                }),
            };
        case actionTypes.DATA_FAILURE:
            console.log("data failure");
            return state;
        case actionTypes.ADD_POST:
            console.log("adding a post", action.payload);
            return {
                ...state,
                userPosts: [action.payload, ...state.userPosts],
            };
        case actionTypes.DELETE_POST:
            console.log("Deleting post: ", action.payload);
            return {
                ...state,
                userPosts: state.userPosts.filter(
                    post => post.noteId !== action.payload
                ),
            };
        // Optimistically update edited post in state
        case actionTypes.EDIT_POST:
            console.log("Editing post", action.payload);
            // Replace note with edited note in state
            return {
                ...state,
                userPosts: state.userPosts.map(post => {
                    if (action.payload.postId === post.noteId) {
                        return {
                            ...post,
                            entryText: action.payload.postText,
                        };
                    } else {
                        return post;
                    }
                }),
            };
        case actionTypes.REPLACE_POST_WITH_TAGGED_POST:
            return {
                ...state,
                userPosts: state.userPosts.map(note => {
                    return note.noteId === action.payload.noteId
                        ? action.payload
                        : note;
                }),
            };
        case actionTypes.DELETE_TAG:
            if (!state.userPosts) {
                console.log("Can't delete tag without a user");
                return state;
            }
            return {
                ...state,
                userPosts: state.userPosts.map(post => {
                    if (post.noteId === action.payload.noteId) {
                        return {
                            ...post,
                            tags: post.tags.filter(
                                tag => tag.tagId !== action.payload.tagId
                            ),
                        };
                    } else {
                        return post;
                    }
                }),
            };
        case actionTypes.ERROR:
            alert(action.payload);
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

const deleteTagFromUI = (tagId, noteId) => {
    return {
        type: actionTypes.DELETE_TAG,
        payload: { tagId: tagId, noteId: noteId },
    };
};

const replacePostWithEditedPost = (postId, newPostText) => {
    return {
        type: actionTypes.EDIT_POST,
        payload: { postId: postId, postText: newPostText },
    };
};

const saveTagsFromCurrentlyEditingPostInUi = currentlyEditingPost => {
    return {
        type: actionTypes.SAVE_TAGS_FROM_CURRENTLY_EDITING_POST,
        payload: currentlyEditingPost,
    };
};

// EXPORTED FUNCTIONS

// A lot of these functions rely on redux-thunk
// Instead of returning an object, we're returning a function (dispatch) that returns an object

export const setCurrentlyEditingPost = payload => {
    return {
        type: actionTypes.SET_CURRENTLY_EDITING_POST,
        payload,
    };
};

export const editTagInCurrentlyEditingPost = (tagId, tagName, noteId) => {
    return {
        type: actionTypes.EDIT_TAG_IN_CURRENTLY_EDITING_POST,
        payload: { tagId: tagId, tagName: tagName, noteId: noteId },
    };
};

export const markTagAsDeletedInCurrentlyEditingPost = (tagId, noteId) => {
    return {
        type: actionTypes.MARK_TAG_AS_DELETED_IN_CURRENTLY_EDITING_POST,
        payload: { tagId: tagId, noteId: noteId },
    };
};

export const addTagToCurrentlyEditingPost = tag => {
    return {
        type: actionTypes.ADD_TAG_TO_CURRENTLY_EDITING_POST,
        payload: tag,
    };
};

// GET POSTS ON INITIAL LOAD
export const fetchData = userEmail => {
    return dispatch => {
        dispatch(dataRequest());
        fetch(`${baseUrl}/notes/${userEmail}`)
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
        fetch(`${baseUrl}/notes/`)
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
        fetch(`${baseUrl}/notes`, {
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
            noteId: postId,
        };

        fetch(`${baseUrl}/notes/${postId}`, {
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

export const saveTagsFromCurrentlyEditingPost = currentlyEditingPost => {
    let tagsArray = values(currentlyEditingPost.tags);
    let addedTagsArray = "";
    console.log("tags in FE: ", tagsArray);

    return dispatch => {
        // Optimistically update UI
        dispatch(saveTagsFromCurrentlyEditingPostInUi(currentlyEditingPost));

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

export const deleteTagsFromCurrentlyEditingPost = tags => {
    return dispatch => {
        dispatch(dataRequest());
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
export const deleteNote = noteId => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deletePostFromUI(noteId));

        // Then delete from database
        fetch(`${baseUrl}/notes/${noteId}`, {
            method: "DELETE",
        })
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    dispatch(
                        alertError("Note could not be deleted at this time")
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
};

// DELETE A TAG
export const deleteTag = (tagId, noteId) => {
    return dispatch => {
        // Optimistically update UI
        dispatch(deleteTagFromUI(tagId, noteId));

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
