import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import {
    fetchData as _fetchData,
    fetchAllData as _fetchAllData,
    addPost as _addPost,
} from "./ducks/posts";
import { setUser as _setUser } from "./ducks/user";
// Components
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea/PostsArea";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";
import PostEditor from "./components/PostEditor";
import Navbar from "./components/Navbar";
import Tag from "./components/Tag";
import LoadingNotice from "./components/LoadingNotice";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Root,
    Route,
} from "react-router-dom";
import Card from "./components/Card";

const App = withAuth(
    ({ fetchData, fetchAllData, setUser, auth, addPost, userPosts }) => {
        console.log("userposts", userPosts);

        const [authenticated, user] = useAuth(auth);

        useEffect(() => {
            if (user) {
                fetchData(user.email);
            }
        }, [fetchData, user]);

        useEffect(() => {
            fetchAllData();
        }, [fetchAllData]);

        useEffect(() => {
            setUser(user);
        }, [user, setUser]);

        // useEffect(() => {}, [userPosts]);

        return (
            <div className="App">
                <Navbar authenticated={authenticated} auth={auth} />
                <Router>
                    <Switch>
                        <Route
                            path="/dream-network/:postId"
                            render={({ match }) => {
                                let post;
                                if (userPosts) {
                                    post = userPosts[match.params.postId];
                                }
                                return (
                                    <div>
                                        {userPosts ? (
                                            <Card
                                                post={post}
                                                key={post.postId}
                                            />
                                        ) : (
                                            <LoadingNotice
                                                loadingText={"Loading post"}
                                            />
                                        )}
                                    </div>
                                );
                            }}
                        ></Route>
                        <Route exact={true} path="/dream-network">
                            <div id={"App-body"}>
                                {authenticated ? (
                                    <div>
                                        <div id={"posts-area"}>
                                            {user && (
                                                <div>
                                                    <PostEditor
                                                        content={""}
                                                        onSave={addPost}
                                                    />
                                                    <PostsArea user={user} />
                                                </div>
                                            )}
                                        </div>
                                        <ChartsArea />
                                    </div>
                                ) : (
                                    <div>
                                        <div id={"posts-area"}>
                                            <PostsArea
                                                user={null}
                                                preferred_username={null}
                                                given_name={null}
                                                family_name={null}
                                            />
                                        </div>
                                        <ChartsArea />
                                    </div>
                                )}
                            </div>
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
);

// const Article = ({ match, userPosts }) => {
//     return (
//         <div>
//             This is post {match.params.postId}
//             <span>{userPosts[match.params.postId]}</span>
//         </div>
//     );
// };

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        userPosts: state.posts.userPosts,
    };
};

const mapDispatchToProps = {
    fetchData: _fetchData,
    fetchAllData: _fetchAllData,
    setUser: _setUser,
    addPost: _addPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
