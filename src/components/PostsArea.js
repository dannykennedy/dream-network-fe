import React from "react";
import Card from "./Card";
import { connect } from "react-redux";
import LoadingNotice from "./LoadingNotice";

function PostsArea({ posts, publicPosts, user }) {
    if (!user) {
        return !publicPosts ? (
            <LoadingNotice loadingText="Loading posts" />
        ) : (
            <div>
                {publicPosts.map(post => {
                    return (
                        <Card
                            user={user}
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
        return !posts ? (
            <LoadingNotice loadingText="Loading posts" />
        ) : (
            <div>
                {posts.map(post => {
                    return (
                        <Card
                            user={user}
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
        posts: state.posts,
        publicPosts: state.publicPosts,
    };
};

export default connect(mapStateToProps)(PostsArea);
