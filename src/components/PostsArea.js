import React from "react";
import Card from "./Card";
import { connect } from "react-redux";
import LoadingNotice from "./LoadingNotice";

function PostsArea({ posts, given_name, family_name, preferred_username }) {
    return !posts ? (
        <LoadingNotice loadingText="Loading posts" />
    ) : (
        <div>
            {posts.map(post => {
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

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        posts: state.posts,
    };
};

export default connect(mapStateToProps)(PostsArea);
