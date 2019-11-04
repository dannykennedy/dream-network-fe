import React from "react";
import Card from "./Card";
import { connect } from "react-redux";
import LoadingNotice from "./LoadingNotice";

function PostsArea({ userPosts, publicPosts, user }) {
    if (!user) {
        return !publicPosts ? (
            <LoadingNotice loadingText="Loading posts" />
        ) : (
            <div>
                {publicPosts.map(post => {
                    return (
                        <Card
                            entryText={post.entryText}
                            firstName={post.firstName || "Anonymous"}
                            lastName={post.lastName || "Echidna"}
                            noteId={post.noteId}
                            timePosted={post.timePosted}
                            tags={post.tags}
                            key={post.noteId}
                        />
                    );
                })}
            </div>
        );
    } else {
        return !userPosts ? (
            <LoadingNotice loadingText="Loading posts" />
        ) : (
            <div>
                {userPosts.map(post => {
                    return (
                        <Card
                            entryText={post.entryText}
                            firstName={post.firstName}
                            lastName={post.lastName}
                            noteId={post.noteId}
                            timePosted={post.timePosted}
                            tags={post.tags}
                            key={post.noteId}
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
        userPosts: state.userPosts,
        publicPosts: state.publicPosts,
        user: state.user,
    };
};

export default connect(mapStateToProps)(PostsArea);
