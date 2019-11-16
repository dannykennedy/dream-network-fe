const initialState = {
    user: null,
};

// TYPES OF ACTIONS THAT CAN BE DISPATCHED
const actionTypes = {
    SET_USER: "SET_USER",
};

// STATE MACHINE
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export const setUser = payload => {
    return {
        type: actionTypes.SET_USER,
        payload,
    };
};
