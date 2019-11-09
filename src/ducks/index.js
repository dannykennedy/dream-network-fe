const baseUrl = process.env.REACT_APP_BASE_URL;

// INITIAL STATE
const initialState = {
    userPosts: null,
    publicPosts: null,
    loading: true,
    user: null,
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
    SET_USER: "SET_USER",
};

// STATE MACHINE
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DATA_REQUEST:
            console.log("request");
            return state;
        case actionTypes.DATA_SUCCESS:
            console.log("success");
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
                        console.log("putting in: ", action.payload.postText);
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
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
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

// EXPORTED FUNCTIONS

// A lot of these functions rely on redux-thunk
// Instead of returning an object, we're returning a function (dispatch) that returns an object

export const setUser = payload => {
    return {
        type: actionTypes.SET_USER,
        payload,
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

        // fetch(`${baseUrl}/notes${postId}`, {
        //     method: "PATCH",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(post),
        // })
        //     .then(data => data.json())
        //     .then(json => {
        //         console.log("got tags: ", json);

        //         post = {
        //             ...post,
        //             tags: json.map(responseRow => {
        //                 return {
        //                     tagName: responseRow.name,
        //                     tagType: responseRow.type,
        //                     tagId: responseRow.tagId,
        //                 };
        //             }),
        //         };

        //         console.log("new Post: ", post);

        //         dispatch(replacePostWithTaggedPost(post));
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
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
        fetch(`${baseUrl}/tags/delete/${tagId}`, {
            method: "POST",
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
