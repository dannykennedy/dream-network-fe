import { combineReducers } from "redux";
import posts from "./items";
import user from "./user";
export default combineReducers({
    posts,
    user,
});
