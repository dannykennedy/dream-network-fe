import { combineReducers } from "redux";
import posts from "./posts";
import user from "./user";
import currentlyEditing from "./currentlyEditing";
export default combineReducers({
    posts,
    currentlyEditing,
    user,
});
