import React from "react";
import Card from "../Card";
import { connect } from "react-redux";
import LoadingNotice from "../LoadingNotice";

function PostsArea({ userPosts, publicPosts, user }) {
    if (!user) {
        return !publicPosts ? (
            <LoadingNotice loadingText="Loading public posts" />
        ) : (
            <div>
                {Object.values(publicPosts).map(post => {
                    return <Card post={post} key={post.postId} />;
                })}
            </div>
        );
    } else {
        return !userPosts ? (
            <LoadingNotice loadingText="Loading user posts" />
        ) : (
            <div>
                {Object.values(userPosts).map(post => {
                    return <Card post={post} key={post.postId} />;
                })}
            </div>
        );
    }
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        userPosts: state.posts.userPosts,
        publicPosts: state.posts.publicPosts,
        user: state.user.user,
    };
};

export default connect(mapStateToProps)(PostsArea);
