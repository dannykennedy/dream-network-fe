import React from "react";
import Card from "../Card";
import { connect } from "react-redux";
import LoadingNotice from "../LoadingNotice";
import Searchbox from "../Searchbox";

function ItemsArea({ userItems, publicItems, user }) {
    if (!user) {
        return !publicItems ? (
            <LoadingNotice loadingText="Loading public items" />
        ) : (
            <div>
                <Searchbox />
                {Object.values(publicItems).map(post => {
                    return <Card post={post} key={post.itemId} />;
                })}
            </div>
        );
    } else {
        return !userItems ? (
            <LoadingNotice loadingText="Loading user posts" />
        ) : (
            <div>
                {Object.values(userItems).map(post => {
                    return <Card post={post} key={post.itemId} />;
                })}
            </div>
        );
    }
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        userItems: state.items.userItems,
        publicItems: state.items.publicItems,
        user: state.user.user,
    };
};

export default connect(mapStateToProps)(ItemsArea);
