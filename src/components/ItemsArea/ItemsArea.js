import React from "react";
import Card from "../Card";
import { connect } from "react-redux";
import LoadingNotice from "../LoadingNotice";
import Searchbox from "../Searchbox";
import NoItems from "./NoItems";

function ItemsArea({ userItems, publicItems, currentlyShowingItems, user }) {
    if (!user) {
        return !publicItems ? (
            <LoadingNotice loadingText="Loading posts" />
        ) : (
            <div>
                <Searchbox />
                {Object.values(currentlyShowingItems).map(post => {
                    return (
                        <Card
                            post={post}
                            key={post.itemId}
                            showingCardAsMainContent={false}
                        />
                    );
                })}
            </div>
        );
    } else {
        return !userItems ? (
            <LoadingNotice loadingText="Loading your posts" />
        ) : (
            <div>
                {Object.values(userItems).length < 1 && <NoItems />}
                {Object.values(userItems).map(post => {
                    return (
                        <Card
                            post={post}
                            key={post.itemId}
                            showingCardAsMainContent={false}
                        />
                    );
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
        currentlyShowingItems: state.items.currentlyShowingItems,
        user: state.user.user,
    };
};

export default connect(mapStateToProps)(ItemsArea);
